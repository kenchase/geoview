import type { Coordinate } from 'ol/coordinate';
import type { Extent } from 'ol/extent';
import { DomHelper } from 'geoview-core/core/utils/dom-helper';
import { delay, whenThisThen } from 'geoview-core/core/utils/utilities';
import { TIMEOUT } from 'geoview-core/core/utils/constant';
import {
  getStoreUIActiveAppBarTab,
  getStoreUIActiveFooterBarTab,
  getStoreUIActiveTrapGeoView,
  getStoreUIFocusItem,
} from 'geoview-core/core/stores/states/ui-state';
import { getStoreAppIsCrosshairsActive } from 'geoview-core/core/stores/states/app-state';
import { getStoreMapPointerPosition, setStoreMapPointerPosition } from 'geoview-core/core/stores/states/map-state';
import type { FeatureInfoLayerSet, QueryEndedEvent } from 'geoview-core/geo/layer/layer-sets/feature-info-layer-set';
import { TestError } from '../core/exceptions';
import { Test } from '../core/test';
import { GVAbstractTester } from './abstract-gv-tester';

const MULTI_FEATURE_QUERY_EXTENT: Extent = [-88.5, 52.2, -85.5, 52.8];

/**
 * Tests keyboard accessibility and cross-panel user interactions.
 */
export class A11yUxTester extends GVAbstractTester {
  /**
   * Returns the name of the tester.
   *
   * @returns The tester name
   */
  override getName(): string {
    return 'A11yUxTester';
  }

  /**
   * Tests closing Details with Ctrl+M and reopening it with a new crosshair query.
   *
   * @returns A promise that resolves with focus, panel, and repeated-query observations
   */
  testKeyboardQueryMapFocusReturn(): Promise<Test<TypeKeyboardQueryFocusResult>> {
    const mapId = this.getMapId();
    const viewer = this.getMapViewer();
    const view = viewer.getView();
    const { mapController, uiController, layerSetController } = this.getControllersRegistry();
    const querySet = layerSetController.featureInfoLayerSet;
    const originalFocus = DomHelper.getActiveElement();
    const originalMode = getStoreUIActiveTrapGeoView(mapId);
    const originalCrosshair = getStoreAppIsCrosshairsActive(mapId);
    const originalFocusItem = getStoreUIFocusItem(mapId);
    const originalAppBar = getStoreUIActiveAppBarTab(mapId);
    const originalCenter = view.getCenter()?.slice();
    const originalResolution = view.getResolution();
    const originalPointer = getStoreMapPointerPosition(mapId);
    const queries: Coordinate[] = [];

    /** Records completed queries independently of whether their coordinates or results changed. */
    const recordQuery = (_sender: FeatureInfoLayerSet, event: QueryEndedEvent): void => {
      queries.push([...event.coordinate]);
    };

    /** Dispatches keys from actual focus so a misplaced focus cannot produce a false pass. */
    const pressKey = (key: string, ctrlKey = false): void => {
      const activeElement = DomHelper.getActiveElementWithinMap(mapId);
      if (!activeElement) throw new TestError('Keyboard query test requires focus inside its existing map');
      activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey, bubbles: true, cancelable: true }));
    };

    /** Checks whether the currently focused element belongs to Details. */
    const hasDetailsFocus = (): boolean => {
      const activeElement = DomHelper.getActiveElement();
      return !!activeElement && !!DomHelper.getAppBarPanel(mapId, 'details')?.contains(activeElement);
    };

    return this.test(
      'Test Ctrl+M closes Details and returns map focus before Enter queries and reopens Details',
      async (test): Promise<TypeKeyboardQueryFocusResult> => {
        const target = DomHelper.getMapTargetElement(mapId);
        const detailsButton = DomHelper.getAppBarButton(mapId, 'details');
        if (!target || !detailsButton) throw new TestError('Existing map target and Details button must be mounted');
        if (!target.ownerDocument.hasFocus()) throw new TestError('Keyboard focus tests require the browser page to be in the foreground');

        test.addStep('Preparing keyboard navigation on the existing map and polygon layer...');
        await layerSetController.featureInfoLayerSet.waitForLayerToGetRegistered('geojsonLYR5/polygons.json');
        uiController.setCrosshairActive(false);
        uiController.setActiveAppBarTab(originalAppBar.tabId, false, false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(true);
        await mapController.zoomToLonLatExtentOrCoordinate(GVAbstractTester.ONTARIO_CENTER_LONLAT, GVAbstractTester.USE_ZOOM_ANIMATION);
        viewer.map.renderSync();
        await DomHelper.waitForReactIdle();
        detailsButton.focus();
        querySet.onQueryEnded(recordQuery);

        test.addStep('Pressing Ctrl+M to focus the map and activate its crosshair...');
        pressKey('m', true);
        await DomHelper.waitForReactIdle();
        const initiallyFocused = DomHelper.getActiveElement() === target;
        const initiallyActive = getStoreAppIsCrosshairsActive(mapId);
        const firstCrosshair = mapController.getViewportCenterPosition()?.lonlat;
        if (!firstCrosshair) throw new TestError('Crosshair coordinates must be available before the first query');

        test.addStep('Pressing Enter and waiting for the first query and Details focus...');
        pressKey('Enter');
        await whenThisThen(() => queries.length === 1, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        await GVAbstractTester.waitForBatchedQueryPropagation(test);
        const detailsFocused = await whenThisThen(hasDetailsFocus, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        const queryFocus = DomHelper.getActiveElement();
        const focusAfterQuery = queryFocus?.id || queryFocus?.className;
        const crosshairAfterQuery = getStoreAppIsCrosshairsActive(mapId);

        test.addStep('Pressing Ctrl+M again and checking map focus, crosshair activation, and Details closure...');
        pressKey('m', true);
        await DomHelper.waitForReactIdle();
        const shortcutFocus = DomHelper.getActiveElement();
        const focusAfterShortcut = shortcutFocus?.id || shortcutFocus?.className;
        const mapFocused = DomHelper.getActiveElement() === target;
        const detailsFocusedAfterShortcut = !!shortcutFocus && !!DomHelper.getAppBarPanel(mapId, 'details')?.contains(shortcutFocus);
        const crosshairActive = getStoreAppIsCrosshairsActive(mapId);
        const detailsOpen = getStoreUIActiveAppBarTab(mapId);
        const detailsOpenAfterShortcut = detailsOpen.isOpen && detailsOpen.tabId === 'details';
        const queriesAfterShortcut = queries.length;
        const secondCrosshair = mapController.getViewportCenterPosition()?.lonlat;
        if (!secondCrosshair) throw new TestError('Crosshair coordinates must be available after Ctrl+M');
        let detailsAfterSecondQuery: TypeKeyboardQueryFocusResult['detailsAfterSecondQuery'];

        // Preserve step 3 failures rather than masking them with a timeout or treating an already-open panel as reopened.
        if (mapFocused && crosshairActive && !detailsOpenAfterShortcut) {
          test.addStep('Pressing Enter again and waiting for a second query to reopen and focus Details...');
          pressKey('Enter');
          await whenThisThen(() => queries.length === 2, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
          await GVAbstractTester.waitForBatchedQueryPropagation(test);
          await whenThisThen((): boolean => {
            const activeTab = getStoreUIActiveAppBarTab(mapId);
            return activeTab.isOpen && activeTab.tabId === 'details' && hasDetailsFocus();
          }, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
          const reopenedTab = getStoreUIActiveAppBarTab(mapId);
          detailsAfterSecondQuery = {
            open: reopenedTab.isOpen && reopenedTab.tabId === 'details',
            focused: hasDetailsFocus(),
          };
        }

        return {
          initiallyFocused,
          initiallyActive,
          detailsFocused,
          focusAfterQuery,
          crosshairAfterQuery,
          focusAfterShortcut,
          mapTargetId: target.id,
          mapFocused,
          detailsFocusedAfterShortcut,
          crosshairActive,
          detailsOpenAfterShortcut,
          detailsAfterSecondQuery,
          queriesAfterShortcut,
          queries,
          expectedCoordinates: [firstCrosshair, secondCrosshair],
        };
      },
      (test, result): void => {
        test.addStep('Verifying the initial shortcut and keyboard query transferred focus to Details...');
        Test.assertIsEqual(result.initiallyFocused, true);
        Test.assertIsEqual(result.initiallyActive, true);
        Test.assertIsEqual(result.detailsFocused, true);
        Test.assertIsEqual(result.crosshairAfterQuery, false);

        test.addStep('Verifying step 3: Ctrl+M focuses the map, activates the crosshair, and closes Details without querying...');
        Test.assertJsonObject(
          {
            focus: result.focusAfterShortcut,
            crosshairActive: result.crosshairActive,
            detailsOpen: result.detailsOpenAfterShortcut,
            queryCount: result.queriesAfterShortcut,
          },
          { focus: result.mapTargetId, crosshairActive: true, detailsOpen: false, queryCount: 1 }
        );

        test.addStep('Verifying two distinct query completions at their crosshair coordinates...');
        Test.assertIsEqual(result.queries.length, 2);
        result.queries.forEach((coordinate, index): void => {
          coordinate.forEach((value, axis): void => {
            Test.assertIsEqualWithinTolerance(value, result.expectedCoordinates[index][axis], 1e-9);
          });
        });
        test.addStep('Verifying step 4: the second Enter query reopened Details and transferred focus into it...');
        Test.assertIsDefined('Details after the second query', result.detailsAfterSecondQuery);
        Test.assertIsEqual(result.detailsAfterSecondQuery.open, true);
        Test.assertIsEqual(result.detailsAfterSecondQuery.focused, true);
      },
      async (): Promise<void> => {
        querySet.offQueryEnded(recordQuery);
        uiController.setCrosshairActive(false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(false);
        uiController.setActiveAppBarTab(originalAppBar.tabId, originalAppBar.isOpen, originalAppBar.isFocusTrapped ?? false);
        view.setResolution(originalResolution);
        view.setCenter(originalCenter);
        viewer.map.renderSync();
        await DomHelper.waitForReactIdle();
        uiController.setActiveTrapGeoView(originalMode);
        uiController.enableFocusTrap(originalFocusItem);
        await DomHelper.waitForReactIdle();
        if (originalFocus instanceof HTMLElement && originalFocus.isConnected) originalFocus.focus({ preventScroll: true });
        uiController.setCrosshairActive(originalCrosshair);
        setStoreMapPointerPosition(mapId, originalPointer ?? mapController.getMapCenterPosition());
        await DomHelper.waitForReactIdle();
      }
    );
  }

  /**
   * Tests Ctrl+M closes app-bar panels and map popovers without closing footer panels.
   *
   * @returns A promise that resolves with focus and panel observations
   */
  testKeyboardShortcutClosesPanelsAndPreservesFooter(): Promise<Test<TypeKeyboardShortcutPanelsResult>> {
    const mapId = this.getMapId();
    const { uiController } = this.getControllersRegistry();
    const originalFocus = DomHelper.getActiveElement();
    const originalMode = getStoreUIActiveTrapGeoView(mapId);
    const originalCrosshair = getStoreAppIsCrosshairsActive(mapId);
    const originalFocusItem = getStoreUIFocusItem(mapId);
    const originalAppBar = getStoreUIActiveAppBarTab(mapId);
    const originalFooterBar = getStoreUIActiveFooterBarTab(mapId);

    /** Dispatches Ctrl+M from the element that currently owns focus in this map. */
    const pressCtrlM = (): void => {
      const activeElement = DomHelper.getActiveElementWithinMap(mapId);
      if (!activeElement) throw new TestError('Ctrl+M panel test requires focus inside its existing map');
      activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', ctrlKey: true, bubbles: true, cancelable: true }));
    };

    return this.test(
      'Test Ctrl+M closes app-bar panels and map popovers while preserving the footer panel',
      async (test): Promise<TypeKeyboardShortcutPanelsResult> => {
        const target = DomHelper.getMapTargetElement(mapId);
        const layersButton = DomHelper.getAppBarButton(mapId, 'layers');
        const settingsButton = DomHelper.getGVElementByFullId<HTMLButtonElement>(mapId, `${mapId}-appBar-settings-btn`);
        const basemapButton = DomHelper.getGVRootElement(mapId).querySelector<HTMLButtonElement>('button[aria-label="Change basemap"]');
        if (!target || !layersButton || !settingsButton || !basemapButton) {
          throw new TestError('The map target, Layers button, Settings button, and basemap control must be mounted');
        }
        if (!target.ownerDocument.hasFocus()) throw new TestError('Keyboard focus tests require the browser page to be in the foreground');

        test.addStep('Preparing the existing map with the footer Data Table panel open...');
        uiController.closeMapPopovers();
        uiController.setCrosshairActive(false);
        uiController.setActiveAppBarTab(undefined, false, false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(true);
        uiController.setActiveFooterBarTab('data-table');
        await DomHelper.waitForReactIdle();

        test.addStep('Opening the Layers app-bar panel and pressing Ctrl+M...');
        layersButton.focus();
        layersButton.click();
        await DomHelper.waitForReactIdle();
        const appBarBeforeShortcut = getStoreUIActiveAppBarTab(mapId);
        pressCtrlM();
        await DomHelper.waitForReactIdle();
        const appBarAfterShortcut = getStoreUIActiveAppBarTab(mapId);
        const mapFocusedAfterAppBar = DomHelper.getActiveElement() === target;
        const crosshairActiveAfterAppBar = getStoreAppIsCrosshairsActive(mapId);
        const footerAfterAppBar = getStoreUIActiveFooterBarTab(mapId);

        test.addStep('Opening Settings and pressing Ctrl+M...');
        uiController.setActiveAppBarTab('layers', false, false);
        await DomHelper.waitForReactIdle();
        settingsButton.focus();
        settingsButton.click();
        await DomHelper.waitForReactIdle();
        const settingsOpenBeforeShortcut = settingsButton.getAttribute('aria-expanded') === 'true';
        pressCtrlM();
        await DomHelper.waitForReactIdle();
        const settingsClosedAfterShortcut = settingsButton.getAttribute('aria-expanded') === 'false';
        const mapFocusedAfterPopover = DomHelper.getActiveElement() === target;
        const crosshairActiveAfterPopover = getStoreAppIsCrosshairsActive(mapId);
        const footerAfterPopover = getStoreUIActiveFooterBarTab(mapId);

        test.addStep('Opening the map basemap popover and pressing Ctrl+M...');
        basemapButton.focus();
        basemapButton.click();
        await DomHelper.waitForReactIdle();
        const basemapPopoverWasOpen = basemapButton.getAttribute('aria-expanded') === 'true';
        pressCtrlM();
        await DomHelper.waitForReactIdle();
        const basemapPopoverClosed = basemapButton.getAttribute('aria-expanded') === 'false';
        const mapFocusedAfterMapPopover = DomHelper.getActiveElement() === target;
        const crosshairActiveAfterMapPopover = getStoreAppIsCrosshairsActive(mapId);
        const footerAfterMapPopover = getStoreUIActiveFooterBarTab(mapId);

        test.addStep('Pressing Ctrl+M with no panel or popover open...');
        target.focus();
        pressCtrlM();
        await DomHelper.waitForReactIdle();

        return {
          appBarWasOpen: appBarBeforeShortcut.isOpen && appBarBeforeShortcut.tabId === 'layers',
          appBarClosed: !appBarAfterShortcut.isOpen,
          mapFocusedAfterAppBar,
          crosshairActiveAfterAppBar,
          footerPreservedAfterAppBar: footerAfterAppBar.tabId === 'data-table' && footerAfterAppBar.isOpen,
          settingsWasOpen: settingsOpenBeforeShortcut,
          settingsClosedAfterShortcut,
          mapFocusedAfterPopover,
          crosshairActiveAfterPopover,
          footerPreservedAfterPopover: footerAfterPopover.tabId === 'data-table' && footerAfterPopover.isOpen,
          basemapPopoverWasOpen,
          basemapPopoverClosed,
          mapFocusedAfterMapPopover,
          crosshairActiveAfterMapPopover,
          footerPreservedAfterMapPopover: footerAfterMapPopover.tabId === 'data-table' && footerAfterMapPopover.isOpen,
          mapFocusedWithNothingOpen: DomHelper.getActiveElement() === target,
          crosshairActiveWithNothingOpen: getStoreAppIsCrosshairsActive(mapId),
        };
      },
      (test, result): void => {
        test.addStep('Verifying the Layers app-bar panel was open before Ctrl+M...');
        Test.assertIsEqual(result.appBarWasOpen, true);
        test.addStep('Verifying Ctrl+M closes the Layers app-bar panel...');
        Test.assertIsEqual(result.appBarClosed, true);
        test.addStep('Verifying map focus after closing the app-bar panel...');
        Test.assertIsEqual(result.mapFocusedAfterAppBar, true);
        test.addStep('Verifying the crosshair is active after closing the app-bar panel...');
        Test.assertIsEqual(result.crosshairActiveAfterAppBar, true);
        test.addStep('Verifying the footer Data Table panel remains open after the app-bar shortcut...');
        Test.assertIsEqual(result.footerPreservedAfterAppBar, true);

        test.addStep('Verifying Settings was open before Ctrl+M...');
        Test.assertIsEqual(result.settingsWasOpen, true);
        test.addStep('Verifying Ctrl+M closes Settings...');
        Test.assertIsEqual(result.settingsClosedAfterShortcut, true);
        test.addStep('Verifying map focus after the Settings shortcut...');
        Test.assertIsEqual(result.mapFocusedAfterPopover, true);
        test.addStep('Verifying the crosshair is active after the Settings shortcut...');
        Test.assertIsEqual(result.crosshairActiveAfterPopover, true);
        test.addStep('Verifying the footer Data Table panel remains open after the Settings shortcut...');
        Test.assertIsEqual(result.footerPreservedAfterPopover, true);

        test.addStep('Verifying the basemap popover was open before Ctrl+M...');
        Test.assertIsEqual(result.basemapPopoverWasOpen, true);
        test.addStep('Verifying Ctrl+M closes the basemap popover...');
        Test.assertIsEqual(result.basemapPopoverClosed, true);
        test.addStep('Verifying map focus after the basemap shortcut...');
        Test.assertIsEqual(result.mapFocusedAfterMapPopover, true);
        test.addStep('Verifying the crosshair is active after the basemap shortcut...');
        Test.assertIsEqual(result.crosshairActiveAfterMapPopover, true);
        test.addStep('Verifying the footer Data Table panel remains open after the basemap shortcut...');
        Test.assertIsEqual(result.footerPreservedAfterMapPopover, true);

        test.addStep('Verifying Ctrl+M with nothing open focuses the map...');
        Test.assertIsEqual(result.mapFocusedWithNothingOpen, true);
        test.addStep('Verifying Ctrl+M with nothing open activates the crosshair...');
        Test.assertIsEqual(result.crosshairActiveWithNothingOpen, true);
      },
      async (): Promise<void> => {
        uiController.closeMapPopovers();
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveAppBarTab(originalAppBar.tabId, originalAppBar.isOpen, originalAppBar.isFocusTrapped ?? false);
        uiController.setActiveFooterBarTab(originalFooterBar.tabId || undefined, originalFooterBar.isOpen);
        uiController.setFooterBarIsOpen(originalFooterBar.isOpen);
        await DomHelper.waitForReactIdle();
        uiController.setActiveTrapGeoView(originalMode);
        uiController.enableFocusTrap(originalFocusItem);
        await DomHelper.waitForReactIdle();
        if (originalFocus instanceof HTMLElement && originalFocus.isConnected) originalFocus.focus({ preventScroll: true });
        uiController.setCrosshairActive(originalCrosshair);
        await DomHelper.waitForReactIdle();
      }
    );
  }

  /**
   * Tests Escape returns to the map after an in-panel crosshair-query Details focus.
   *
   * @returns A promise that resolves with the resulting focus and crosshair state
   */
  testCrosshairDetailsEscapeReturnsToMap(): Promise<Test<TypeCrosshairDetailsEscapeResult>> {
    const mapId = this.getMapId();
    const viewer = this.getMapViewer();
    const view = viewer.getView();
    const { mapController, uiController, layerSetController } = this.getControllersRegistry();
    const querySet = layerSetController.featureInfoLayerSet;
    const originalFocus = DomHelper.getActiveElement();
    const originalMode = getStoreUIActiveTrapGeoView(mapId);
    const originalCrosshair = getStoreAppIsCrosshairsActive(mapId);
    const originalFocusItem = getStoreUIFocusItem(mapId);
    const originalAppBar = getStoreUIActiveAppBarTab(mapId);
    const originalCenter = view.getCenter()?.slice();
    const originalResolution = view.getResolution();
    const originalPointer = getStoreMapPointerPosition(mapId);
    const queries: Coordinate[] = [];

    /** Records completed queries for this test. */
    const recordQuery = (_sender: FeatureInfoLayerSet, event: QueryEndedEvent): void => {
      queries.push([...event.coordinate]);
    };

    /** Dispatches a key from the focused element inside this map. */
    const pressKey = (key: string, ctrlKey = false): void => {
      const activeElement = DomHelper.getActiveElementWithinMap(mapId);
      if (!activeElement) throw new TestError('Details Escape test requires focus inside its existing map');
      activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey, bubbles: true, cancelable: true }));
    };

    /** Checks whether focus currently belongs to the Details app-bar panel. */
    const hasDetailsFocus = (): boolean => {
      const activeElement = DomHelper.getActiveElement();
      return !!activeElement && !!DomHelper.getAppBarPanel(mapId, 'details')?.contains(activeElement);
    };

    return this.test(
      'Test Escape returns focus to the crosshair after navigating within query-opened Details',
      async (test): Promise<TypeCrosshairDetailsEscapeResult> => {
        const target = DomHelper.getMapTargetElement(mapId);
        if (!target) throw new TestError('The map target must be mounted');
        if (!target.ownerDocument.hasFocus()) throw new TestError('Keyboard focus tests require the browser page to be in the foreground');

        test.addStep('Preparing a crosshair query on the existing polygon layer...');
        await layerSetController.featureInfoLayerSet.waitForLayerToGetRegistered('geojsonLYR5/polygons.json');
        uiController.setCrosshairActive(false);
        uiController.setActiveAppBarTab(undefined, false, false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(true);
        await mapController.zoomToLonLatExtentOrCoordinate(MULTI_FEATURE_QUERY_EXTENT, false);
        viewer.map.renderSync();
        await DomHelper.waitForReactIdle();
        mapController.synchronizeCrosshairPointerPosition();
        uiController.setCrosshairActive(true);
        target.focus();
        querySet.onQueryEnded(recordQuery);

        test.addStep('Querying from the active crosshair and waiting for Details focus...');
        await DomHelper.waitForReactIdle();
        pressKey('Enter');
        await whenThisThen(() => queries.length === 1, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        await GVAbstractTester.waitForBatchedQueryPropagation(test);
        await whenThisThen(hasDetailsFocus, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);

        const targetPanel = DomHelper.getAppBarPanel(mapId, 'details');
        const closeButton = DomHelper.getAppBarPanelCloseButton(mapId, 'details');
        if (!targetPanel || !closeButton) throw new TestError('The query-opened Details panel must be mounted');
        const availableLayerButton = targetPanel.querySelector<HTMLButtonElement>('ul button');
        if (!availableLayerButton) throw new TestError('The query-opened Details panel must list the available result layer');
        availableLayerButton.click();
        await whenThisThen(() => {
          const nextButton = targetPanel.querySelector<HTMLButtonElement>(
            '[role="group"][aria-label="Feature navigation"] button[aria-label="Next feature"]'
          );
          return !!nextButton && nextButton.getAttribute('aria-disabled') !== 'true';
        }, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);

        const navigationGroup = targetPanel.querySelector('[role="group"][aria-label="Feature navigation"]');
        const nextFeatureButton = navigationGroup?.querySelector<HTMLButtonElement>('button[aria-label="Next feature"]');
        const featureStatus = navigationGroup?.parentElement;
        const subPanel = nextFeatureButton?.closest<HTMLElement>('.responsive-layout-right-main');
        if (!nextFeatureButton || !featureStatus || !subPanel) {
          throw new TestError('The map13 query must expose multiple Details results to exercise result navigation');
        }

        test.addStep('Moving focus within Details, navigating a result, and moving the mouse without clicking...');
        closeButton.focus();
        closeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
        const focusStayedWithinAfterTab = targetPanel.contains(DomHelper.getActiveElement() ?? null);
        nextFeatureButton.focus();
        nextFeatureButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
        const focusStayedWithinAfterArrow = targetPanel.contains(DomHelper.getActiveElement() ?? null);
        const statusBeforeResultChange = featureStatus.textContent;
        nextFeatureButton.click();
        await DomHelper.waitForReactIdle();
        const resultChangedAfterNavigation = featureStatus.textContent !== statusBeforeResultChange;
        targetPanel.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        const focusStayedWithinAfterResultChange = targetPanel.contains(DomHelper.getActiveElement() ?? null);

        test.addStep('Pressing Escape within the feature sub-panel after navigation and mouse movement...');
        const subPanelWasOpen = subPanel.getClientRects().length > 0;
        pressKey('Escape');
        await DomHelper.waitForReactIdle();
        const subPanelClosedAfterEscape = subPanel.getClientRects().length === 0;
        const detailsOpenAfterFirstEscape = getStoreUIActiveAppBarTab(mapId).isOpen;
        const focusAfterFirstEscape = DomHelper.getActiveElement()?.id;

        test.addStep('Pressing Escape from the parent layer item to close Details...');
        pressKey('Escape');
        await delay(TIMEOUT.dataPanelLoading);
        await DomHelper.waitForReactIdle();

        return {
          focusStayedWithinAfterTab,
          focusStayedWithinAfterArrow,
          resultChangedAfterNavigation,
          focusStayedWithinAfterResultChange,
          subPanelWasOpen,
          subPanelClosedAfterEscape,
          detailsOpenAfterFirstEscape,
          focusAfterFirstEscape,
          parentLayerItemId: availableLayerButton.id,
          detailsClosed: !getStoreUIActiveAppBarTab(mapId).isOpen,
          mapFocused: DomHelper.getActiveElement() === target,
          crosshairActive: getStoreAppIsCrosshairsActive(mapId),
          queryCount: queries.length,
        };
      },
      (test, result): void => {
        test.addStep('Verifying Tab focus remains inside Details...');
        Test.assertIsEqual(result.focusStayedWithinAfterTab, true);
        test.addStep('Verifying arrow-key focus remains inside Details...');
        Test.assertIsEqual(result.focusStayedWithinAfterArrow, true);
        test.addStep('Verifying keyboard result navigation changes the selected feature...');
        Test.assertIsEqual(result.resultChangedAfterNavigation, true);
        test.addStep('Verifying focus remains inside Details after switching results...');
        Test.assertIsEqual(result.focusStayedWithinAfterResultChange, true);
        Test.assertIsEqual(result.queryCount, 1);

        test.addStep('Verifying the feature sub-panel was open before Escape...');
        Test.assertIsEqual(result.subPanelWasOpen, true);
        test.addStep('Verifying the first Escape closes the feature sub-panel...');
        Test.assertIsEqual(result.subPanelClosedAfterEscape, true);
        test.addStep('Verifying Details remains open after the first Escape...');
        Test.assertIsEqual(result.detailsOpenAfterFirstEscape, true);
        test.addStep('Verifying the first Escape restores focus to the parent layer item...');
        Test.assertIsEqual(result.focusAfterFirstEscape, result.parentLayerItemId);

        test.addStep('Verifying the second Escape closes Details...');
        Test.assertIsEqual(result.detailsClosed, true);
        test.addStep('Verifying Escape restores map focus...');
        Test.assertIsEqual(result.mapFocused, true);
        test.addStep('Verifying Escape activates the crosshair...');
        Test.assertIsEqual(result.crosshairActive, true);
      },
      async (): Promise<void> => {
        querySet.offQueryEnded(recordQuery);
        uiController.setCrosshairActive(false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(false);
        uiController.setActiveAppBarTab(originalAppBar.tabId, originalAppBar.isOpen, originalAppBar.isFocusTrapped ?? false);
        view.setResolution(originalResolution);
        view.setCenter(originalCenter);
        viewer.map.renderSync();
        await DomHelper.waitForReactIdle();
        uiController.setActiveTrapGeoView(originalMode);
        uiController.enableFocusTrap(originalFocusItem);
        await DomHelper.waitForReactIdle();
        if (originalFocus instanceof HTMLElement && originalFocus.isConnected) originalFocus.focus({ preventScroll: true });
        uiController.setCrosshairActive(originalCrosshair);
        setStoreMapPointerPosition(mapId, originalPointer ?? mapController.getMapCenterPosition());
        await DomHelper.waitForReactIdle();
      }
    );
  }

  /**
   * Tests that mouse input cancels query-origin Escape ownership and that mouse-open Details and Close keep current behavior.
   *
   * @returns A promise that resolves with fallback focus observations
   */
  testDetailsEscapeOwnershipCancellation(): Promise<Test<TypeDetailsEscapeCancellationResult>> {
    const mapId = this.getMapId();
    const viewer = this.getMapViewer();
    const view = viewer.getView();
    const { mapController, uiController, layerSetController } = this.getControllersRegistry();
    const querySet = layerSetController.featureInfoLayerSet;
    const originalFocus = DomHelper.getActiveElement();
    const originalMode = getStoreUIActiveTrapGeoView(mapId);
    const originalCrosshair = getStoreAppIsCrosshairsActive(mapId);
    const originalFocusItem = getStoreUIFocusItem(mapId);
    const originalAppBar = getStoreUIActiveAppBarTab(mapId);
    const originalCenter = view.getCenter()?.slice();
    const originalResolution = view.getResolution();
    const originalPointer = getStoreMapPointerPosition(mapId);
    const queries: Coordinate[] = [];

    /** Records completed queries for this test. */
    const recordQuery = (_sender: FeatureInfoLayerSet, event: QueryEndedEvent): void => {
      queries.push([...event.coordinate]);
    };

    /** Dispatches a key from the focused element inside this map. */
    const pressKey = (key: string, ctrlKey = false): void => {
      const activeElement = DomHelper.getActiveElementWithinMap(mapId);
      if (!activeElement) throw new TestError('Details Escape test requires focus inside its existing map');
      activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey, bubbles: true, cancelable: true }));
    };

    /** Checks whether focus currently belongs to the Details app-bar panel. */
    const hasDetailsFocus = (): boolean => {
      const activeElement = DomHelper.getActiveElement();
      return !!activeElement && !!DomHelper.getAppBarPanel(mapId, 'details')?.contains(activeElement);
    };

    return this.test(
      'Test Close, mouse input, and mouse-open Details keep their existing focus behavior',
      async (test): Promise<TypeDetailsEscapeCancellationResult> => {
        const target = DomHelper.getMapTargetElement(mapId);
        const detailsButton = DomHelper.getAppBarButton(mapId, 'details');
        if (!target || !detailsButton) throw new TestError('The map target and Details button must be mounted');
        if (!target.ownerDocument.hasFocus()) throw new TestError('Keyboard focus tests require the browser page to be in the foreground');

        test.addStep('Preparing a crosshair query on the existing polygon layer...');
        await layerSetController.featureInfoLayerSet.waitForLayerToGetRegistered('geojsonLYR5/polygons.json');
        uiController.setCrosshairActive(false);
        uiController.setActiveAppBarTab(undefined, false, false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(true);
        await mapController.zoomToLonLatExtentOrCoordinate(MULTI_FEATURE_QUERY_EXTENT, false);
        viewer.map.renderSync();
        await DomHelper.waitForReactIdle();
        mapController.synchronizeCrosshairPointerPosition();
        uiController.setCrosshairActive(true);
        target.focus();
        querySet.onQueryEnded(recordQuery);

        /** Runs a crosshair query and waits for Details focus. */
        const queryIntoDetails = async (): Promise<void> => {
          const startingQueryCount = queries.length;
          target.focus();
          await DomHelper.waitForReactIdle();
          pressKey('Enter');
          await whenThisThen(() => queries.length === startingQueryCount + 1, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
          await GVAbstractTester.waitForBatchedQueryPropagation(test);
          await whenThisThen(hasDetailsFocus, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        };

        await queryIntoDetails();
        const detailsPanel = DomHelper.getAppBarPanel(mapId, 'details');
        const closeButton = DomHelper.getAppBarPanelCloseButton(mapId, 'details');
        if (!detailsPanel) throw new TestError('The query-opened Details panel must be mounted');
        if (!closeButton) throw new TestError('The query-opened Details panel Close button must be mounted');

        const availableLayerButton = detailsPanel.querySelector<HTMLButtonElement>('ul button');
        if (!availableLayerButton) throw new TestError('The query-opened Details panel must list the available result layer');
        availableLayerButton.click();
        await whenThisThen(() => {
          const nextButton = detailsPanel.querySelector<HTMLButtonElement>(
            '[role="group"][aria-label="Feature navigation"] button[aria-label="Next feature"]'
          );
          return !!nextButton && nextButton.getAttribute('aria-disabled') !== 'true';
        }, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);

        const navigationGroup = detailsPanel.querySelector('[role="group"][aria-label="Feature navigation"]');
        const nextFeatureButton = navigationGroup?.querySelector<HTMLButtonElement>('button[aria-label="Next feature"]');
        const featureStatus = navigationGroup?.parentElement;
        const subPanel = nextFeatureButton?.closest<HTMLElement>('.responsive-layout-right-main');
        if (!nextFeatureButton || !featureStatus || !subPanel) {
          throw new TestError('The query-opened Details panel must expose its feature sub-panel and navigation');
        }

        test.addStep('Canceling query-origin Escape ownership with a mouse click on the next-result button...');
        const previousFeatureStatus = featureStatus.textContent;
        nextFeatureButton.focus();
        nextFeatureButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }));
        nextFeatureButton.click();
        await DomHelper.waitForReactIdle();
        const resultChangedAfterMouseClick = featureStatus.textContent !== previousFeatureStatus;
        test.addStep('Pressing Escape within the feature sub-panel after the mouse click...');
        const subPanelWasOpen = subPanel.getClientRects().length > 0;
        pressKey('Escape');
        await DomHelper.waitForReactIdle();
        const subPanelClosedAfterEscape = subPanel.getClientRects().length === 0;
        const detailsOpenAfterFirstEscape = getStoreUIActiveAppBarTab(mapId).isOpen;
        const focusAfterFirstEscape = DomHelper.getActiveElement()?.id;

        test.addStep('Pressing Escape from the parent layer item to close Details after mouse cancellation...');
        pressKey('Escape');
        await delay(TIMEOUT.dataPanelLoading);
        await DomHelper.waitForReactIdle();
        const mouseClickEscapeClosedDetails = !getStoreUIActiveAppBarTab(mapId).isOpen;
        const mouseClickEscapeReturnedToMap = DomHelper.getActiveElement() === DomHelper.getMapTargetElement(mapId);
        const crosshairInactiveAfterMouseClickEscape = !getStoreAppIsCrosshairsActive(mapId);

        test.addStep('Opening Details with the mouse, checking Escape, and closing with the Close button...');
        if (getStoreUIActiveAppBarTab(mapId).isOpen) {
          closeButton.click();
          await DomHelper.waitForReactIdle();
        }
        detailsButton.click();
        await whenThisThen(() => getStoreUIActiveAppBarTab(mapId).isOpen, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        closeButton.focus();
        pressKey('Escape');
        await delay(TIMEOUT.dataPanelLoading);
        await DomHelper.waitForReactIdle();
        const mouseOpenedDetailsUsedNormalReturn = DomHelper.getActiveElement() === detailsButton && !getStoreAppIsCrosshairsActive(mapId);
        if (getStoreUIActiveAppBarTab(mapId).isOpen) {
          closeButton.click();
          await DomHelper.waitForReactIdle();
        }
        if (!getStoreUIActiveAppBarTab(mapId).isOpen) {
          detailsButton.click();
          await whenThisThen(() => getStoreUIActiveAppBarTab(mapId).isOpen, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        }
        closeButton.click();
        await delay(TIMEOUT.dataPanelLoading);
        await DomHelper.waitForReactIdle();
        const closeButtonUsedNormalReturn = DomHelper.getActiveElement() === detailsButton && !getStoreAppIsCrosshairsActive(mapId);

        return {
          resultChangedAfterMouseClick,
          subPanelWasOpen,
          subPanelClosedAfterEscape,
          detailsOpenAfterFirstEscape,
          focusAfterFirstEscape,
          parentLayerItemId: availableLayerButton.id,
          mouseClickEscapeClosedDetails,
          mouseClickEscapeReturnedToMap,
          crosshairInactiveAfterMouseClickEscape,
          mouseOpenedDetailsUsedNormalReturn,
          closeButtonUsedNormalReturn,
        };
      },
      (test, result): void => {
        test.addStep('Verifying the result changed after the mouse click...');
        Test.assertIsEqual(result.resultChangedAfterMouseClick, true);
        test.addStep('Verifying the feature sub-panel was open before Escape...');
        Test.assertIsEqual(result.subPanelWasOpen, true);
        test.addStep('Verifying the first Escape closes the feature sub-panel after a mouse click...');
        Test.assertIsEqual(result.subPanelClosedAfterEscape, true);
        test.addStep('Verifying Details remains open after the first Escape...');
        Test.assertIsEqual(result.detailsOpenAfterFirstEscape, true);
        test.addStep('Verifying the first Escape restores focus to the parent layer item...');
        Test.assertIsEqual(result.focusAfterFirstEscape, result.parentLayerItemId);
        test.addStep('Verifying the second Escape after a mouse click closes Details...');
        Test.assertIsEqual(result.mouseClickEscapeClosedDetails, true);
        test.addStep('Verifying mouse cancellation prevents Escape from returning focus to the map...');
        Test.assertIsEqual(result.mouseClickEscapeReturnedToMap, false);
        test.addStep('Verifying the crosshair remains inactive after mouse-canceled Escape...');
        Test.assertIsEqual(result.crosshairInactiveAfterMouseClickEscape, true);
        test.addStep('Verifying mouse-open Details keeps its existing Escape behavior...');
        Test.assertIsEqual(result.mouseOpenedDetailsUsedNormalReturn, true);
        test.addStep('Verifying the Close button keeps its existing behavior...');
        Test.assertIsEqual(result.closeButtonUsedNormalReturn, true);
      },
      async (): Promise<void> => {
        querySet.offQueryEnded(recordQuery);
        uiController.setCrosshairActive(false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(false);
        uiController.setActiveAppBarTab(originalAppBar.tabId, originalAppBar.isOpen, originalAppBar.isFocusTrapped ?? false);
        view.setResolution(originalResolution);
        view.setCenter(originalCenter);
        viewer.map.renderSync();
        await DomHelper.waitForReactIdle();
        uiController.setActiveTrapGeoView(originalMode);
        uiController.enableFocusTrap(originalFocusItem);
        await DomHelper.waitForReactIdle();
        if (originalFocus instanceof HTMLElement && originalFocus.isConnected) originalFocus.focus({ preventScroll: true });
        uiController.setCrosshairActive(originalCrosshair);
        setStoreMapPointerPosition(mapId, originalPointer ?? mapController.getMapCenterPosition());
        await DomHelper.waitForReactIdle();
      }
    );
  }

  /**
   * Tests that leaving query-opened Details cancels its Escape focus return.
   *
   * @returns A promise that resolves with fallback focus observations
   */
  testDetailsEscapeFocusLeaveCancellation(): Promise<Test<TypeDetailsEscapeFocusLeaveResult>> {
    const mapId = this.getMapId();
    const viewer = this.getMapViewer();
    const view = viewer.getView();
    const { mapController, uiController, layerSetController } = this.getControllersRegistry();
    const querySet = layerSetController.featureInfoLayerSet;
    const originalFocus = DomHelper.getActiveElement();
    const originalMode = getStoreUIActiveTrapGeoView(mapId);
    const originalCrosshair = getStoreAppIsCrosshairsActive(mapId);
    const originalFocusItem = getStoreUIFocusItem(mapId);
    const originalAppBar = getStoreUIActiveAppBarTab(mapId);
    const originalCenter = view.getCenter()?.slice();
    const originalResolution = view.getResolution();
    const originalPointer = getStoreMapPointerPosition(mapId);
    const queries: Coordinate[] = [];

    /** Records completed queries for this test. */
    const recordQuery = (_sender: FeatureInfoLayerSet, event: QueryEndedEvent): void => {
      queries.push([...event.coordinate]);
    };

    /** Dispatches a key from the focused element inside this map. */
    const pressKey = (key: string, ctrlKey = false): void => {
      const activeElement = DomHelper.getActiveElementWithinMap(mapId);
      if (!activeElement) throw new TestError('Details Escape test requires focus inside its existing map');
      activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey, bubbles: true, cancelable: true }));
    };

    return this.test(
      'Test leaving query-opened Details cancels its Escape focus return',
      async (test): Promise<TypeDetailsEscapeFocusLeaveResult> => {
        const target = DomHelper.getMapTargetElement(mapId);
        const detailsButton = DomHelper.getAppBarButton(mapId, 'details');
        const layersButton = DomHelper.getAppBarButton(mapId, 'layers');
        if (!target || !detailsButton || !layersButton) throw new TestError('Map, Details, and Layers controls must be mounted');
        if (!target.ownerDocument.hasFocus()) throw new TestError('Keyboard focus tests require the browser page to be in the foreground');

        test.addStep('Preparing one crosshair query on the existing polygon layer...');
        await layerSetController.featureInfoLayerSet.waitForLayerToGetRegistered('geojsonLYR5/polygons.json');
        uiController.setCrosshairActive(false);
        uiController.setActiveAppBarTab(undefined, false, false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(true);
        await mapController.zoomToLonLatExtentOrCoordinate(MULTI_FEATURE_QUERY_EXTENT, false);
        viewer.map.renderSync();
        await DomHelper.waitForReactIdle();
        mapController.synchronizeCrosshairPointerPosition();
        uiController.setCrosshairActive(true);
        target.focus();
        querySet.onQueryEnded(recordQuery);

        test.addStep('Querying from the active crosshair, leaving Details, and pressing Escape...');
        await DomHelper.waitForReactIdle();
        pressKey('Enter');
        await whenThisThen(() => queries.length === 1, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        await GVAbstractTester.waitForBatchedQueryPropagation(test);
        await DomHelper.waitForReactIdle();
        layersButton.focus();
        pressKey('Escape');
        await DomHelper.waitForReactIdle();
        const focusAfterEscape = DomHelper.getActiveElement();

        return {
          focusReturnedToMapAfterEscape: focusAfterEscape === target,
          focusRemainsOnLayersButton: focusAfterEscape === layersButton,
          crosshairInactiveAfterEscape: !getStoreAppIsCrosshairsActive(mapId),
        };
      },
      (test, result): void => {
        test.addStep('Verifying Escape does not return focus to the map after it leaves Details...');
        Test.assertIsEqual(result.focusReturnedToMapAfterEscape, false);
        test.addStep('Verifying Escape leaves the crosshair inactive after focus leaves Details...');
        Test.assertIsEqual(result.crosshairInactiveAfterEscape, true);
      },
      async (): Promise<void> => {
        querySet.offQueryEnded(recordQuery);
        uiController.setCrosshairActive(false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(false);
        uiController.setActiveAppBarTab(originalAppBar.tabId, originalAppBar.isOpen, originalAppBar.isFocusTrapped ?? false);
        view.setResolution(originalResolution);
        view.setCenter(originalCenter);
        viewer.map.renderSync();
        await DomHelper.waitForReactIdle();
        uiController.setActiveTrapGeoView(originalMode);
        uiController.enableFocusTrap(originalFocusItem);
        await DomHelper.waitForReactIdle();
        if (originalFocus instanceof HTMLElement && originalFocus.isConnected) originalFocus.focus({ preventScroll: true });
        uiController.setCrosshairActive(originalCrosshair);
        setStoreMapPointerPosition(mapId, originalPointer ?? mapController.getMapCenterPosition());
        await DomHelper.waitForReactIdle();
      }
    );
  }

  /**
   * Tests Ctrl+M is ignored while Export is open.
   *
   * @param withFormatDropdown - Whether to press the shortcut from Export's portaled format dropdown
   * @returns A promise that resolves with Export modal and keyboard notification observations
   */
  testKeyboardShortcutIgnoredForExportModal(withFormatDropdown = false): Promise<Test<TypeExportModalShortcutResult>> {
    const mapId = this.getMapId();
    const viewer = this.getMapViewer();
    const { uiController } = this.getControllersRegistry();
    const originalFocus = DomHelper.getActiveElement();
    const originalMode = getStoreUIActiveTrapGeoView(mapId);
    const originalCrosshair = getStoreAppIsCrosshairsActive(mapId);
    const originalFocusItem = getStoreUIFocusItem(mapId);
    const originalAppBar = getStoreUIActiveAppBarTab(mapId);
    const keyboardEvents: Array<{ key: string; ctrlKey: boolean }> = [];
    let exportDialog: HTMLElement | undefined;
    let formatDropdown: HTMLElement | undefined;
    let formatSelect: HTMLElement | undefined;

    /** Dispatches a key from the currently focused element, whether inside or outside the viewer root. */
    const pressActiveKey = (key: string, ctrlKey = false): void => {
      const activeElement = DomHelper.getActiveElement();
      if (!activeElement) throw new TestError('Export modal keyboard test requires an active element');
      activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey, bubbles: true, cancelable: true }));
    };

    const keyboardEventDelegate = viewer.onMapKeyboardEvent((_sender, event) => {
      keyboardEvents.push({ key: event.keyboardEvent.key.toLowerCase(), ctrlKey: event.keyboardEvent.ctrlKey });
    });

    return this.test(
      withFormatDropdown
        ? 'Test Ctrl+M does nothing while Export format dropdown is open'
        : 'Test Ctrl+M does nothing while Export is open',
      async (test): Promise<TypeExportModalShortcutResult> => {
        const exportButton = DomHelper.getGVElementByFullId<HTMLButtonElement>(mapId, `${mapId}-appBar-export-modal-btn`);
        const mapTarget = DomHelper.getMapTargetElement(mapId);
        if (!exportButton || !mapTarget) throw new TestError('Export and map controls must be mounted');
        if (!mapTarget.ownerDocument.hasFocus())
          throw new TestError('Keyboard focus tests require the browser page to be in the foreground');

        test.addStep('Opening Export and pressing Ctrl+M from within its modal...');
        uiController.setCrosshairActive(false);
        uiController.setActiveAppBarTab(undefined, false, false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(true);
        exportButton.focus();
        exportButton.click();
        await whenThisThen(() => {
          exportDialog =
            DomHelper.getGVRootElement(mapId).querySelector<HTMLElement>(
              `#${CSS.escape(`${mapId}-export-dialog`)} [role="dialog"][aria-modal="true"]`
            ) ?? undefined;
          return !!exportDialog;
        }, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        const openedExportDialog = exportDialog;
        if (!openedExportDialog) throw new TestError('The Export modal must be mounted after opening');
        const exportTitleInput = openedExportDialog.querySelector<HTMLInputElement>(`#${CSS.escape(`${mapId}-export-title-input`)}`);
        if (!exportTitleInput) throw new TestError('The open Export modal must contain its title input');
        if (!withFormatDropdown) exportTitleInput.focus();
        await whenThisThen(() => {
          const activeElement = DomHelper.getActiveElement();
          if (withFormatDropdown) return activeElement === exportTitleInput;
          return !!activeElement && openedExportDialog.contains(activeElement);
        }, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        const notificationsBeforeOrdinaryKey = keyboardEvents.length;
        pressActiveKey('x');
        const ordinaryKeyboardNotification = keyboardEvents.length > notificationsBeforeOrdinaryKey;
        const exportOpenBeforeShortcut = getStoreUIFocusItem(mapId).activeElementId === 'export';
        if (withFormatDropdown) {
          test.addStep('Opening the format dropdown and waiting for focus in its portaled list...');
          formatSelect = openedExportDialog.querySelector<HTMLElement>('[role="combobox"]') ?? undefined;
          if (!formatSelect) throw new TestError('Export must contain its format selector');
          formatSelect.focus();
          pressActiveKey('ArrowDown');
          await whenThisThen(() => {
            const listId = formatSelect?.getAttribute('aria-controls');
            formatDropdown = listId ? DomHelper.getGVElementByFullId(mapId, listId) : undefined;
            const activeElement = DomHelper.getActiveElement();
            return formatSelect?.getAttribute('aria-expanded') === 'true' && !!activeElement && !!formatDropdown?.contains(activeElement);
          }, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        }
        const dropdownExpandedBeforeShortcut = formatSelect?.getAttribute('aria-expanded') === 'true';
        test.addStep('Pressing Ctrl+M from the focused Export control...');
        pressActiveKey('m', true);
        await DomHelper.waitForReactIdle();
        const exportOpenAfterShortcut = getStoreUIFocusItem(mapId).activeElementId === 'export';
        const exportFocusAfter = DomHelper.getActiveElement();
        const exportFocusStayedInModal = !!exportDialog && !!exportFocusAfter && exportDialog.contains(exportFocusAfter);
        const exportCtrlMNotifications = keyboardEvents.filter((event) => event.ctrlKey && event.key === 'm').length;
        const crosshairAfterExportShortcut = getStoreAppIsCrosshairsActive(mapId);

        return {
          exportOpenBeforeShortcut,
          exportOpenAfterShortcut,
          exportFocusStayedInModal,
          exportCtrlMNotifications,
          crosshairAfterExportShortcut,
          ordinaryKeyboardNotification,
          dropdown: withFormatDropdown
            ? {
                expandedBeforeShortcut: dropdownExpandedBeforeShortcut,
                expandedAfterShortcut: formatSelect?.getAttribute('aria-expanded') === 'true',
                focusStayedInDropdown: !!exportFocusAfter && !!formatDropdown?.contains(exportFocusAfter),
                outsideDialog: !!formatDropdown && !openedExportDialog.contains(formatDropdown),
              }
            : undefined,
        };
      },
      (test, result): void => {
        test.addStep('Verifying Export remains open and focused, without crosshair or keyboard-notification side effects...');
        Test.assertIsEqual(result.exportOpenBeforeShortcut, true);
        Test.assertIsEqual(result.exportOpenAfterShortcut, true);
        if (withFormatDropdown) {
          Test.assertIsDefined('Export format dropdown observations', result.dropdown);
          test.addStep('Verifying the format dropdown was expanded outside the dialog before Ctrl+M...');
          Test.assertIsEqual(result.dropdown.expandedBeforeShortcut, true);
          Test.assertIsEqual(result.dropdown.outsideDialog, true);
          test.addStep('Verifying Ctrl+M leaves the format dropdown expanded...');
          Test.assertIsEqual(result.dropdown.expandedAfterShortcut, true);
          test.addStep('Verifying focus stays inside the format dropdown...');
          Test.assertIsEqual(result.dropdown.focusStayedInDropdown, true);
        } else {
          Test.assertIsEqual(result.exportFocusStayedInModal, true);
        }
        test.addStep('Verifying Ctrl+M sends no map keyboard notification...');
        Test.assertIsEqual(result.exportCtrlMNotifications, 0);
        test.addStep('Verifying Ctrl+M leaves the crosshair inactive...');
        Test.assertIsEqual(result.crosshairAfterExportShortcut, false);

        Test.assertIsEqual(result.ordinaryKeyboardNotification, true);
      },
      async (): Promise<void> => {
        viewer.offMapKeyboardEvent(keyboardEventDelegate);
        if (formatSelect?.getAttribute('aria-expanded') === 'true' && formatDropdown?.isConnected) {
          formatDropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
          await DomHelper.waitForReactIdle();
        }
        if (getStoreUIFocusItem(mapId).activeElementId === 'export') uiController.disableFocusTrap('no-focus');
        uiController.setCrosshairActive(false);
        uiController.setActiveAppBarTab(originalAppBar.tabId, originalAppBar.isOpen, originalAppBar.isFocusTrapped ?? false);
        uiController.setActiveTrapGeoView(originalMode);
        uiController.enableFocusTrap(originalFocusItem);
        await DomHelper.waitForReactIdle();
        if (originalFocus instanceof HTMLElement && originalFocus.isConnected) originalFocus.focus({ preventScroll: true });
        uiController.setCrosshairActive(originalCrosshair);
        await DomHelper.waitForReactIdle();
      }
    );
  }

  /**
   * Tests Ctrl+M is ignored while Share is open.
   *
   * @returns A promise that resolves with Share modal and keyboard notification observations
   */
  testKeyboardShortcutIgnoredForShareModal(): Promise<Test<TypeShareModalShortcutResult>> {
    const mapId = this.getMapId();
    const viewer = this.getMapViewer();
    const { uiController } = this.getControllersRegistry();
    const originalFocus = DomHelper.getActiveElement();
    const originalMode = getStoreUIActiveTrapGeoView(mapId);
    const originalCrosshair = getStoreAppIsCrosshairsActive(mapId);
    const originalFocusItem = getStoreUIFocusItem(mapId);
    const originalAppBar = getStoreUIActiveAppBarTab(mapId);
    const keyboardEvents: Array<{ key: string; ctrlKey: boolean }> = [];
    let shareDialog: HTMLElement | undefined;

    /** Dispatches a key from the currently focused element outside the viewer root. */
    const pressActiveKey = (key: string, ctrlKey = false): void => {
      const activeElement = DomHelper.getActiveElement();
      if (!activeElement) throw new TestError('Share modal keyboard test requires an active element');
      activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey, bubbles: true, cancelable: true }));
    };

    const keyboardEventDelegate = viewer.onMapKeyboardEvent((_sender, event) => {
      keyboardEvents.push({ key: event.keyboardEvent.key.toLowerCase(), ctrlKey: event.keyboardEvent.ctrlKey });
    });

    return this.test(
      'Test Ctrl+M does nothing while Share is open',
      async (test): Promise<TypeShareModalShortcutResult> => {
        const shareButton = DomHelper.getGVElementByFullId<HTMLButtonElement>(mapId, `${mapId}-share-button`);
        if (!shareButton) throw new TestError('The Share button must be mounted');
        if (!shareButton.ownerDocument.hasFocus())
          throw new TestError('Keyboard focus tests require the browser page to be in the foreground');

        test.addStep('Opening Share and focusing its modal...');
        uiController.setCrosshairActive(false);
        uiController.setActiveAppBarTab(undefined, false, false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(true);
        shareButton.focus();
        shareButton.click();
        const shareDialogElement = await DomHelper.waitForDomElement(
          '[role="dialog"][aria-labelledby="share-dialog-title"][aria-modal="true"]',
          shareButton.ownerDocument.body,
          GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS
        );
        if (!(shareDialogElement instanceof HTMLElement)) throw new TestError('The open Share modal must be an HTML dialog');
        const openedShareDialog = shareDialogElement;
        shareDialog = openedShareDialog;
        const shareFocusTarget = openedShareDialog.querySelector<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex="0"]'
        );
        if (!shareFocusTarget) throw new TestError('The open Share modal must contain a focusable control');
        shareFocusTarget.focus();
        await whenThisThen(() => {
          const activeElement = DomHelper.getActiveElement();
          return !!activeElement && openedShareDialog.contains(activeElement);
        }, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);

        test.addStep('Pressing Ctrl+M while focus is inside Share...');
        const shareFocusBefore = DomHelper.getActiveElement();
        const shareDialogOpenBeforeShortcut = openedShareDialog.getAttribute('aria-modal') === 'true';
        const shareActiveElementOutsideMap = !DomHelper.getActiveElementWithinMap(mapId);
        pressActiveKey('m', true);
        await DomHelper.waitForReactIdle();
        const shareFocusAfter = DomHelper.getActiveElement();
        const shareDialogOpenAfterShortcut = openedShareDialog.getAttribute('aria-modal') === 'true';

        return {
          shareDialogOpenBeforeShortcut,
          shareDialogOpenAfterShortcut,
          shareFocusStayedInModal:
            !!shareFocusBefore && shareFocusAfter === shareFocusBefore && openedShareDialog.contains(shareFocusAfter),
          shareActiveElementOutsideMap,
          shareCtrlMNotifications: keyboardEvents.filter((event) => event.ctrlKey && event.key === 'm').length,
          crosshairRemainsInactive: !getStoreAppIsCrosshairsActive(mapId),
        };
      },
      (test, result): void => {
        test.addStep('Verifying Share remains open and focused, without notifying this map...');
        Test.assertIsEqual(result.shareDialogOpenBeforeShortcut, true);
        Test.assertIsEqual(result.shareDialogOpenAfterShortcut, true);
        Test.assertIsEqual(result.shareFocusStayedInModal, true);
        Test.assertIsEqual(result.shareActiveElementOutsideMap, true);
        Test.assertIsEqual(result.shareCtrlMNotifications, 0);
        Test.assertIsEqual(result.crosshairRemainsInactive, true);
      },
      async (): Promise<void> => {
        viewer.offMapKeyboardEvent(keyboardEventDelegate);
        if (shareDialog?.isConnected) {
          shareDialog.querySelectorAll<HTMLButtonElement>('button').item(1)?.click();
          await DomHelper.waitForReactIdle();
        }
        uiController.setCrosshairActive(false);
        uiController.setActiveAppBarTab(originalAppBar.tabId, originalAppBar.isOpen, originalAppBar.isFocusTrapped ?? false);
        uiController.setActiveTrapGeoView(originalMode);
        uiController.enableFocusTrap(originalFocusItem);
        await DomHelper.waitForReactIdle();
        if (originalFocus instanceof HTMLElement && originalFocus.isConnected) originalFocus.focus({ preventScroll: true });
        uiController.setCrosshairActive(originalCrosshair);
        await DomHelper.waitForReactIdle();
      }
    );
  }
}

// #region TYPES AND INTERFACES

/** Observations before and after returning from Details to the map with Ctrl+M. */
interface TypeKeyboardQueryFocusResult {
  initiallyFocused: boolean;
  initiallyActive: boolean;
  detailsFocused: boolean;
  focusAfterQuery: string | undefined;
  crosshairAfterQuery: boolean;
  focusAfterShortcut: string | undefined;
  mapTargetId: string;
  mapFocused: boolean;
  detailsFocusedAfterShortcut: boolean;
  crosshairActive: boolean;
  detailsOpenAfterShortcut: boolean;
  detailsAfterSecondQuery: { open: boolean; focused: boolean } | undefined;
  queriesAfterShortcut: number;
  queries: Coordinate[];
  expectedCoordinates: Coordinate[];
}

/** Ctrl+M focus, crosshair, app-bar, and footer observations. */
interface TypeKeyboardShortcutPanelsResult {
  appBarWasOpen: boolean;
  appBarClosed: boolean;
  mapFocusedAfterAppBar: boolean;
  crosshairActiveAfterAppBar: boolean;
  footerPreservedAfterAppBar: boolean;
  settingsWasOpen: boolean;
  settingsClosedAfterShortcut: boolean;
  mapFocusedAfterPopover: boolean;
  crosshairActiveAfterPopover: boolean;
  footerPreservedAfterPopover: boolean;
  basemapPopoverWasOpen: boolean;
  basemapPopoverClosed: boolean;
  mapFocusedAfterMapPopover: boolean;
  crosshairActiveAfterMapPopover: boolean;
  footerPreservedAfterMapPopover: boolean;
  mapFocusedWithNothingOpen: boolean;
  crosshairActiveWithNothingOpen: boolean;
}

/** Details focus ownership observations after an in-panel crosshair query. */
interface TypeCrosshairDetailsEscapeResult {
  focusStayedWithinAfterTab: boolean;
  focusStayedWithinAfterArrow: boolean;
  resultChangedAfterNavigation: boolean;
  focusStayedWithinAfterResultChange: boolean;
  subPanelWasOpen: boolean;
  subPanelClosedAfterEscape: boolean;
  detailsOpenAfterFirstEscape: boolean;
  focusAfterFirstEscape: string | undefined;
  parentLayerItemId: string;
  detailsClosed: boolean;
  mapFocused: boolean;
  crosshairActive: boolean;
  queryCount: number;
}

/** Fallback focus observations after query-origin Details ownership is canceled. */
interface TypeDetailsEscapeCancellationResult {
  resultChangedAfterMouseClick: boolean;
  subPanelWasOpen: boolean;
  subPanelClosedAfterEscape: boolean;
  detailsOpenAfterFirstEscape: boolean;
  focusAfterFirstEscape: string | undefined;
  parentLayerItemId: string;
  mouseClickEscapeClosedDetails: boolean;
  mouseClickEscapeReturnedToMap: boolean;
  crosshairInactiveAfterMouseClickEscape: boolean;
  mouseOpenedDetailsUsedNormalReturn: boolean;
  closeButtonUsedNormalReturn: boolean;
}

/** Fallback focus observations after keyboard focus leaves query-opened Details. */
interface TypeDetailsEscapeFocusLeaveResult {
  focusReturnedToMapAfterEscape: boolean;
  focusRemainsOnLayersButton: boolean;
  crosshairInactiveAfterEscape: boolean;
}

/** Export modal and map keyboard notification observations after Ctrl+M. */
interface TypeExportModalShortcutResult {
  exportOpenBeforeShortcut: boolean;
  exportOpenAfterShortcut: boolean;
  exportFocusStayedInModal: boolean;
  exportCtrlMNotifications: number;
  crosshairAfterExportShortcut: boolean;
  ordinaryKeyboardNotification: boolean;
  dropdown:
    | {
        expandedBeforeShortcut: boolean;
        expandedAfterShortcut: boolean;
        focusStayedInDropdown: boolean;
        outsideDialog: boolean;
      }
    | undefined;
}

/** Share modal observations after Ctrl+M. */
interface TypeShareModalShortcutResult {
  shareDialogOpenBeforeShortcut: boolean;
  shareDialogOpenAfterShortcut: boolean;
  shareFocusStayedInModal: boolean;
  shareActiveElementOutsideMap: boolean;
  shareCtrlMNotifications: number;
  crosshairRemainsInactive: boolean;
}

// #endregion TYPES AND INTERFACES
