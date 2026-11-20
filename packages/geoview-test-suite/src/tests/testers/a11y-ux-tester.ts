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
import { getStoreDetailsCurrentFeatureIndex, getStoreDetailsSelectedLayerPath } from 'geoview-core/core/stores/states/feature-info-state';
import { getStoreMapPointerPosition, setStoreMapPointerPosition } from 'geoview-core/core/stores/states/map-state';
import type { FeatureInfoLayerSet, QueryEndedEvent } from 'geoview-core/geo/layer/layer-sets/feature-info-layer-set';
import { TestError } from '../core/exceptions';
import { Test } from '../core/test';
import { GVAbstractTester } from './abstract-gv-tester';

const MULTI_FEATURE_QUERY_EXTENT: Extent = [-88.5, 52.2, -85.5, 52.8];
const MODAL_FOCUS_SETTLE_MS = 300;

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
   * Tests repeated crosshair queries open the Details sub-panel and focus its main Close button.
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

    return this.test(
      'Test Ctrl+M closes Details and returns map focus before Enter queries and reopens Details',
      async (test): Promise<TypeKeyboardQueryFocusResult> => {
        const target = DomHelper.getMapTargetElement(mapId);
        const detailsButton = DomHelper.getAppBarButton(mapId, 'details');
        const detailsPanel = DomHelper.getAppBarPanel(mapId, 'details');
        if (!target || !detailsButton || !detailsPanel) throw new TestError('Existing map target and Details controls must be mounted');
        if (!target.ownerDocument.hasFocus()) throw new TestError('Keyboard focus tests require the browser page to be in the foreground');

        test.addStep('Preparing keyboard navigation on the existing map and polygon layer...');
        await layerSetController.featureInfoLayerSet.waitForLayerToGetRegistered('geojsonLYR5/polygons.json');
        uiController.setCrosshairActive(false);
        uiController.setActiveAppBarTab(originalAppBar.tabId, false, false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(true);
        detailsButton.focus();
        querySet.onQueryEnded(recordQuery);
        const observations: TypeKeyboardQueryFocusResult['observations'] = [];

        /** Records one query and its focus transitions before the next query starts. */
        const runQuery = async (index: number, expectsFeatures: boolean): Promise<TypeKeyboardQueryFocusResult['observations'][number]> => {
          let subPanelClosedBeforeQuery: boolean | undefined;
          if (index === 2) {
            test.addStep('Closing the feature sub-panel before repeating the query at the same coordinates...');
            uiController.setActiveAppBarTab('details', true, true);
            await DomHelper.waitForReactIdle();
            const layerButton = detailsPanel.querySelector<HTMLButtonElement>('ul button');
            if (!layerButton) throw new TestError('Details must expose its result layer');
            layerButton.click();
            await DomHelper.waitForReactIdle();
            const subPanelClose = detailsPanel.querySelector<HTMLButtonElement>(
              '.responsive-layout-right-main-content button[aria-label="Close selection"]'
            );
            if (!subPanelClose) throw new TestError('Details must expose its feature sub-panel Close button');
            subPanelClose.focus();
            pressKey('Escape');
            await DomHelper.waitForReactIdle();
            subPanelClosedBeforeQuery = !detailsPanel.querySelector('.responsive-layout-right-main')?.getClientRects().length;
          }

          test.addStep(`Query ${index + 1}: pressing Ctrl+M and checking map focus and Details closure...`);
          pressKey('m', true);
          await DomHelper.waitForReactIdle();
          const shortcutFocusId = DomHelper.getActiveElement()?.id;
          const shortcutCrosshairActive = getStoreAppIsCrosshairsActive(mapId);
          const detailsClosedAfterShortcut = !getStoreUIActiveAppBarTab(mapId).isOpen;
          const queryCountAfterShortcut = queries.length;
          await mapController.zoomToLonLatExtentOrCoordinate(
            expectsFeatures ? MULTI_FEATURE_QUERY_EXTENT : GVAbstractTester.ALBERTA_CENTER_LONLAT,
            false
          );
          viewer.map.renderSync();
          mapController.synchronizeCrosshairPointerPosition();
          const expectedCoordinate = mapController.getViewportCenterPosition()?.lonlat;
          if (!expectedCoordinate) throw new TestError('Crosshair coordinates must be available before each query');

          test.addStep(`Query ${index + 1}: pressing Enter and waiting for ${expectsFeatures ? 'features' : 'the guide'}...`);
          const focusDepartures: string[] = [];
          let mainCloseReceivedFocus = false;

          /** Records transient focus theft even if another pending entry callback later restores the main Close button. */
          const recordFocus = (event: FocusEvent): void => {
            const element = event.target;
            if (!(element instanceof HTMLElement)) return;
            if (element === DomHelper.getAppBarPanelCloseButton(mapId, 'details')) mainCloseReceivedFocus = true;
            else if (mainCloseReceivedFocus) focusDepartures.push(element.id || element.getAttribute('aria-label') || element.className);
          };

          detailsPanel.addEventListener('focusin', recordFocus);
          try {
            pressKey('Enter');
            await whenThisThen(() => queries.length === index + 1, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
            await GVAbstractTester.waitForBatchedQueryPropagation(test);
            test.addStep(`Query ${index + 1}: waiting for rendered content and the sub-panel autofocus animation frame...`);
            await whenThisThen(
              () =>
                !!detailsPanel.querySelector(expectsFeatures ? '[aria-label="Feature navigation"]' : '.guide-container')?.getClientRects()
                  .length,
              GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS
            );
            await DomHelper.waitForReactIdle();
            await delay(TIMEOUT.focusDelay);
            await DomHelper.waitForReactIdle();
          } finally {
            detailsPanel.removeEventListener('focusin', recordFocus);
          }
          const mainClose = DomHelper.getAppBarPanelCloseButton(mapId, 'details');
          if (!mainClose) throw new TestError('Query-opened Details must expose its main Close button');
          const activeElement = DomHelper.getActiveElement();
          const activeTab = getStoreUIActiveAppBarTab(mapId);
          const observation: TypeKeyboardQueryFocusResult['observations'][number] = {
            expectsFeatures,
            expectedCoordinate,
            shortcutFocusId,
            shortcutCrosshairActive,
            detailsClosedAfterShortcut,
            queryCountAfterShortcut,
            focusAfterQuery: activeElement?.id || activeElement?.getAttribute('aria-label') || activeElement?.className,
            mainCloseId: mainClose.id,
            focusDepartures,
            detailsOpenAfterQuery: activeTab.isOpen && activeTab.tabId === 'details',
            crosshairInactiveAfterQuery: !getStoreAppIsCrosshairsActive(mapId),
            subPanelVisible: !!detailsPanel.querySelector('.responsive-layout-right-main')?.getClientRects().length,
            featuresVisible: !!detailsPanel.querySelector('[aria-label="Feature navigation"]')?.getClientRects().length,
            guideVisible: !!detailsPanel.querySelector('.guide-container')?.getClientRects().length,
            subPanelClosedBeforeQuery,
          };

          if (index % 2 === 1) {
            test.addStep(`Query ${index + 1}: pressing one Escape from query focus...`);
            pressKey('Escape');
            await DomHelper.waitForReactIdle();
            observation.escape = {
              detailsClosed: !getStoreUIActiveAppBarTab(mapId).isOpen,
              focusId: DomHelper.getActiveElement()?.id,
              crosshairActive: getStoreAppIsCrosshairsActive(mapId),
            };
          }
          return observation;
        };

        for (const [index, expectsFeatures] of [true, true, true, false, false, true].entries()) {
          // eslint-disable-next-line no-await-in-loop -- Each query reuses the map and must finish its focus transitions before the next.
          observations.push(await runQuery(index, expectsFeatures));
        }

        return { mapTargetId: target.id, queries, observations };
      },
      (test, result): void => {
        Test.assertIsEqual(result.queries.length, result.observations.length);
        result.observations.forEach((observation, index): void => {
          test.addStep(`Query ${index + 1}: verifying Ctrl+M closes Details and focuses the active crosshair without querying...`);
          Test.assertIsEqual(observation.shortcutFocusId, result.mapTargetId);
          Test.assertIsEqual(observation.shortcutCrosshairActive, true);
          Test.assertIsEqual(observation.detailsClosedAfterShortcut, true);
          Test.assertIsEqual(observation.queryCountAfterShortcut, index);

          test.addStep(
            `Query ${index + 1}: verifying exact main Close focus and the open ${observation.expectsFeatures ? 'features' : 'guide'}...`
          );
          Test.assertIsEqual(observation.focusAfterQuery, observation.mainCloseId);
          Test.assertIsEqual(observation.focusDepartures.join(', '), '');
          Test.assertIsEqual(observation.detailsOpenAfterQuery, true);
          Test.assertIsEqual(observation.crosshairInactiveAfterQuery, true);
          Test.assertIsEqual(observation.subPanelVisible, true);
          Test.assertIsEqual(observation.featuresVisible, observation.expectsFeatures);
          Test.assertIsEqual(observation.guideVisible, !observation.expectsFeatures);
          if (observation.subPanelClosedBeforeQuery !== undefined) Test.assertIsEqual(observation.subPanelClosedBeforeQuery, true);
          result.queries[index].forEach((value, axis): void => {
            Test.assertIsEqualWithinTolerance(value, observation.expectedCoordinate[axis], 1e-9);
          });
          if (observation.escape) {
            test.addStep(`Query ${index + 1}: verifying one Escape closes Details and returns to the active crosshair...`);
            Test.assertIsEqual(observation.escape.detailsClosed, true);
            Test.assertIsEqual(observation.escape.focusId, result.mapTargetId);
            Test.assertIsEqual(observation.escape.crosshairActive, true);
          }
        });
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
   * Tests reopening Details preserves its feature sub-panel after app-bar and Ctrl+M dismissal.
   *
   * @returns A promise that resolves with the remembered sub-panel and feature observations
   */
  testDetailsSubPanelReopensAfterDismissal(): Promise<Test<TypeDetailsReopenResult[]>> {
    const mapId = this.getMapId();
    const viewer = this.getMapViewer();
    const view = viewer.getView();
    const { mapController, uiController, detailsController, layerSetController } = this.getControllersRegistry();
    const originalFocus = DomHelper.getActiveElement();
    const originalMode = getStoreUIActiveTrapGeoView(mapId);
    const originalCrosshair = getStoreAppIsCrosshairsActive(mapId);
    const originalFocusItem = getStoreUIFocusItem(mapId);
    const originalAppBar = getStoreUIActiveAppBarTab(mapId);
    const originalCenter = view.getCenter()?.slice();
    const originalResolution = view.getResolution();
    const originalPointer = getStoreMapPointerPosition(mapId);
    const originalLayerPath = getStoreDetailsSelectedLayerPath(mapId);
    const originalFeatureIndex = getStoreDetailsCurrentFeatureIndex(mapId);

    return this.test(
      'Test reopening Details preserves its feature sub-panel after app-bar and Ctrl+M dismissal',
      async (test): Promise<TypeDetailsReopenResult[]> => {
        const target = DomHelper.getMapTargetElement(mapId);
        const detailsButton = DomHelper.getAppBarButton(mapId, 'details');
        const detailsPanel = DomHelper.getAppBarPanel(mapId, 'details');
        if (!target || !detailsButton || !detailsPanel) throw new TestError('The map target and Details controls must be mounted');
        if (!target.ownerDocument.hasFocus()) throw new TestError('Keyboard focus tests require the browser page to be in the foreground');

        test.addStep('Opening Details with a pointer-origin query on the existing polygon layer...');
        await layerSetController.featureInfoLayerSet.waitForLayerToGetRegistered('geojsonLYR5/polygons.json');
        uiController.setCrosshairActive(false);
        uiController.setActiveAppBarTab(undefined, false, false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(true);
        detailsController.setSelectedLayerPath('');
        await mapController.zoomToLonLatExtentOrCoordinate(MULTI_FEATURE_QUERY_EXTENT, false);
        viewer.map.renderSync();
        await DomHelper.waitForReactIdle();
        const queryPosition = mapController.getViewportCenterPosition();
        if (!queryPosition) throw new TestError('The existing map must expose a query position');
        await mapController.performMapClickAction(queryPosition);
        await GVAbstractTester.waitForBatchedQueryPropagation(test);
        await whenThisThen(() => {
          const nextButton = detailsPanel.querySelector<HTMLButtonElement>(
            '[role="group"][aria-label="Feature navigation"] button[aria-label="Next feature"]'
          );
          return !!nextButton && nextButton.getAttribute('aria-disabled') !== 'true';
        }, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        const nextButton = detailsPanel.querySelector<HTMLButtonElement>(
          '[role="group"][aria-label="Feature navigation"] button[aria-label="Next feature"]'
        );
        const subPanel = nextButton?.closest<HTMLElement>('.responsive-layout-right-main');
        const layerButton = detailsPanel.querySelector<HTMLButtonElement>('ul button');
        if (!nextButton || !subPanel || !layerButton)
          throw new TestError('Details must expose its feature sub-panel and parent layer item');
        /** Closes the outer panel and reopens it without issuing another feature query. */
        const closeAndReopen = async (dismissal: 'app-bar button' | 'Ctrl+M'): Promise<TypeDetailsReopenResult> => {
          test.addStep(`Closing Details with ${dismissal} while its feature sub-panel is open...`);
          layerButton.click();
          await DomHelper.waitForReactIdle();
          nextButton.click();
          await DomHelper.waitForReactIdle();
          const selectedLayerPath = getStoreDetailsSelectedLayerPath(mapId);
          const featureIndex = getStoreDetailsCurrentFeatureIndex(mapId);
          const subPanelOpenBefore = subPanel.getClientRects().length > 0;
          if (dismissal === 'app-bar button') {
            detailsButton.focus();
            detailsButton.click();
          } else {
            nextButton.focus();
            nextButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', ctrlKey: true, bubbles: true, cancelable: true }));
          }
          await DomHelper.waitForReactIdle();
          const detailsClosed = !getStoreUIActiveAppBarTab(mapId).isOpen;
          const subPanelHiddenWithDetails = subPanel.getClientRects().length === 0;

          test.addStep(`Reopening Details from its app-bar button after ${dismissal} without a new query...`);
          detailsButton.focus();
          detailsButton.click();
          await DomHelper.waitForReactIdle();
          return {
            dismissal,
            subPanelOpenBefore,
            detailsClosed,
            subPanelHiddenWithDetails,
            detailsReopened: getStoreUIActiveAppBarTab(mapId).isOpen,
            subPanelReopened: subPanel.getClientRects().length > 0,
            selectedLayerPath,
            reopenedLayerPath: getStoreDetailsSelectedLayerPath(mapId),
            featureIndex,
            reopenedFeatureIndex: getStoreDetailsCurrentFeatureIndex(mapId),
          };
        };
        return [await closeAndReopen('app-bar button'), await closeAndReopen('Ctrl+M')];
      },
      (test, results): void => {
        results.forEach((result): void => {
          test.addStep(`Verifying the feature sub-panel was open before ${result.dismissal}...`);
          Test.assertIsEqual(result.subPanelOpenBefore, true);
          test.addStep(`Verifying ${result.dismissal} hides both Details levels...`);
          Test.assertIsEqual(result.detailsClosed, true);
          Test.assertIsEqual(result.subPanelHiddenWithDetails, true);
          test.addStep(`Verifying the Details app-bar button reopens Details after ${result.dismissal}...`);
          Test.assertIsEqual(result.detailsReopened, true);
          test.addStep(`Verifying the remembered feature sub-panel reopens after ${result.dismissal}...`);
          Test.assertIsEqual(result.subPanelReopened, true);
          test.addStep(`Verifying the same layer and feature remain selected after ${result.dismissal}...`);
          Test.assertIsEqual(result.reopenedLayerPath, result.selectedLayerPath);
          Test.assertIsEqual(result.reopenedFeatureIndex, result.featureIndex);
        });
      },
      async (): Promise<void> => {
        uiController.setCrosshairActive(false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(false);
        uiController.setActiveAppBarTab(originalAppBar.tabId, originalAppBar.isOpen, originalAppBar.isFocusTrapped ?? false);
        detailsController.setSelectedLayerPath(originalLayerPath);
        detailsController.setCurrentFeatureIndex(originalFeatureIndex);
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

    const shortcutPrevented: boolean[] = [];

    /** Dispatches Ctrl+M from the element that currently owns focus in this map and records whether its default was prevented. */
    const pressCtrlM = (): void => {
      const activeElement = DomHelper.getActiveElementWithinMap(mapId);
      if (!activeElement) throw new TestError('Ctrl+M panel test requires focus inside its existing map');
      shortcutPrevented.push(
        !activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', ctrlKey: true, bubbles: true, cancelable: true }))
      );
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
          shortcutPrevented: [...shortcutPrevented],
        };
      },
      (test, result): void => {
        test.addStep('Verifying every acting Ctrl+M prevents the browser default...');
        Test.assertIsArrayEqual(result.shortcutPrevented, [true, true, true, true]);
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
   * Tests that focus can leave query-opened Details' feature sub-panel and cancel its Escape focus return.
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
        const detailsPanel = DomHelper.getAppBarPanel(mapId, 'details');
        const layersButton = DomHelper.getAppBarButton(mapId, 'layers');
        if (!target || !detailsPanel || !layersButton) throw new TestError('Map, Details, and Layers controls must be mounted');
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

        test.addStep('Querying from the active crosshair and focusing the Details feature sub-panel...');
        await DomHelper.waitForReactIdle();
        pressKey('Enter');
        await whenThisThen(() => queries.length === 1, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        await GVAbstractTester.waitForBatchedQueryPropagation(test);
        await DomHelper.waitForReactIdle();
        const layerButton = detailsPanel.querySelector<HTMLButtonElement>('ul button');
        if (!layerButton) throw new TestError('The query-opened Details panel must list the available result layer');
        layerButton.click();
        await DomHelper.waitForReactIdle();
        const nextFeatureButton = detailsPanel.querySelector<HTMLButtonElement>(
          '[role="group"][aria-label="Feature navigation"] button[aria-label="Next feature"]'
        );
        const subPanel = nextFeatureButton?.closest<HTMLElement>('.responsive-layout-right-main-content');
        if (!nextFeatureButton || !subPanel?.getClientRects().length)
          throw new TestError('Details must expose its feature sub-panel and navigation controls');
        nextFeatureButton.focus();
        await DomHelper.waitForReactIdle();
        const subPanelFocusedBeforeLeaving = DomHelper.getActiveElement() === nextFeatureButton;

        test.addStep('Moving focus from the feature sub-panel to Layers and waiting for focus effects...');
        layersButton.focus();
        await DomHelper.waitForReactIdle();
        const focusAfterLeaving = DomHelper.getActiveElement()?.id;

        test.addStep('Pressing Escape after leaving the Details feature sub-panel...');
        pressKey('Escape');
        await DomHelper.waitForReactIdle();
        const focusAfterEscape = DomHelper.getActiveElement();

        return {
          subPanelFocusedBeforeLeaving,
          focusAfterLeaving,
          outsideControlId: layersButton.id,
          focusReturnedToMapAfterEscape: focusAfterEscape === target,
          focusRemainsOnLayersButton: focusAfterEscape === layersButton,
          crosshairInactiveAfterEscape: !getStoreAppIsCrosshairsActive(mapId),
        };
      },
      (test, result): void => {
        test.addStep('Verifying focus started inside the Details feature sub-panel...');
        Test.assertIsEqual(result.subPanelFocusedBeforeLeaving, true);
        test.addStep('Verifying focus stays on Layers instead of being pulled back into Details...');
        Test.assertIsEqual(result.focusAfterLeaving, result.outsideControlId);
        test.addStep('Verifying Escape keeps focus on Layers after leaving Details...');
        Test.assertIsEqual(result.focusRemainsOnLayersButton, true);
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
    const keyboardEvents: KeyboardEvent[] = [];
    let exportDialog: HTMLElement | undefined;
    let formatDropdown: HTMLElement | undefined;
    let formatSelect: HTMLElement | undefined;

    /** Dispatches a key from the currently focused element, whether inside or outside the viewer root, and returns whether its default was prevented. */
    const pressActiveKey = (key: string, ctrlKey = false): boolean => {
      const activeElement = DomHelper.getActiveElement();
      if (!activeElement) throw new TestError('Export modal keyboard test requires an active element');
      return !activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey, bubbles: true, cancelable: true }));
    };

    const keyboardEventDelegate = viewer.onMapKeyboardEvent((_sender, event) => {
      keyboardEvents.push(event.keyboardEvent);
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
        const exportShortcutPrevented = pressActiveKey('m', true);
        await DomHelper.waitForReactIdle();
        const exportOpenAfterShortcut = getStoreUIFocusItem(mapId).activeElementId === 'export';
        const exportFocusAfter = DomHelper.getActiveElement();
        const exportFocusStayedInModal = !!exportDialog && !!exportFocusAfter && exportDialog.contains(exportFocusAfter);
        const exportShortcutNotifications = keyboardEvents.filter(
          (event) => (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'm'
        ).length;
        const crosshairAfterExportShortcut = getStoreAppIsCrosshairsActive(mapId);

        return {
          exportOpenBeforeShortcut,
          exportOpenAfterShortcut,
          exportFocusStayedInModal,
          exportShortcutNotifications,
          exportShortcutPrevented,
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
        Test.assertIsEqual(result.exportShortcutNotifications, 0);
        test.addStep('Verifying Ctrl+M prevents the browser default...');
        Test.assertIsEqual(result.exportShortcutPrevented, true);
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
    const keyboardEvents: KeyboardEvent[] = [];
    let shareDialog: HTMLElement | undefined;

    /** Dispatches a key from the currently focused element outside the viewer root and returns whether its default was prevented. */
    const pressActiveKey = (key: string, ctrlKey = false): boolean => {
      const activeElement = DomHelper.getActiveElement();
      if (!activeElement) throw new TestError('Share modal keyboard test requires an active element');
      return !activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey, bubbles: true, cancelable: true }));
    };

    const keyboardEventDelegate = viewer.onMapKeyboardEvent((_sender, event) => {
      keyboardEvents.push(event.keyboardEvent);
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
        const shareShortcutPrevented = pressActiveKey('m', true);
        await DomHelper.waitForReactIdle();
        const shareFocusAfter = DomHelper.getActiveElement();
        const shareDialogOpenAfterShortcut = openedShareDialog.getAttribute('aria-modal') === 'true';

        return {
          shareDialogOpenBeforeShortcut,
          shareDialogOpenAfterShortcut,
          shareFocusStayedInModal:
            !!shareFocusBefore && shareFocusAfter === shareFocusBefore && openedShareDialog.contains(shareFocusAfter),
          shareActiveElementOutsideMap,
          shareShortcutPrevented,
          shareShortcutNotifications: keyboardEvents.filter((event) => (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'm')
            .length,
          crosshairRemainsInactive: !getStoreAppIsCrosshairsActive(mapId),
        };
      },
      (test, result): void => {
        test.addStep('Verifying Share remains open and focused, without notifying this map...');
        Test.assertIsEqual(result.shareDialogOpenBeforeShortcut, true);
        Test.assertIsEqual(result.shareDialogOpenAfterShortcut, true);
        Test.assertIsEqual(result.shareFocusStayedInModal, true);
        Test.assertIsEqual(result.shareActiveElementOutsideMap, true);
        // Share is outside the viewer root, so this viewer must leave the browser default alone.
        Test.assertIsEqual(result.shareShortcutPrevented, false);
        Test.assertIsEqual(result.shareShortcutNotifications, 0);
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

  /**
   * Tests Ctrl+M while an overlay is open over an app-bar panel.
   *
   * @param kind - The modal to open
   * @returns A promise that resolves with modal and shortcut observations
   */
  testKeyboardShortcutIgnoredForOverlay(kind: TypeOverlayKind): Promise<Test<TypeOverlayShortcutResult>> {
    const mapId = kind === 'legend fullscreen' || kind === 'basic table' ? 'map14' : this.getMapId();
    const viewer = this.getApi().getMapViewer(mapId);
    const { uiController } = viewer.controllers;
    const originalFocus = DomHelper.getActiveElement();
    const originalMode = getStoreUIActiveTrapGeoView(mapId);
    const originalCrosshair = getStoreAppIsCrosshairsActive(mapId);
    const originalFocusItem = getStoreUIFocusItem(mapId);
    const originalAppBar = getStoreUIActiveAppBarTab(mapId);
    const originalFooterBar = getStoreUIActiveFooterBarTab(mapId);
    const keyboardEvents: KeyboardEvent[] = [];
    let dialog: HTMLElement | undefined;
    let closeButton: HTMLButtonElement | undefined;

    const keyboardEventDelegate = viewer.onMapKeyboardEvent((_sender, event) => {
      keyboardEvents.push(event.keyboardEvent);
    });

    return this.test(
      `Test Ctrl+M does nothing while ${kind} is open`,
      async (test): Promise<TypeOverlayShortcutResult> => {
        const panelId = kind === 'legend fullscreen' ? 'legend' : 'layers';
        const panelButton = DomHelper.getAppBarButton(mapId, panelId);
        const mapTarget = DomHelper.getMapTargetElement(mapId);
        if (!panelButton || !mapTarget) throw new TestError('The app-bar and map controls must be mounted');
        if (!mapTarget.ownerDocument.hasFocus())
          throw new TestError('Keyboard focus tests require the browser page to be in the foreground');

        test.addStep('Preparing the viewer and its app-bar panel...');
        uiController.closeMapPopovers();
        uiController.setCrosshairActive(false);
        uiController.setActiveAppBarTab(undefined, false, false);
        uiController.disableFocusTrap('no-focus');
        uiController.setActiveTrapGeoView(false);
        if (kind === 'lightbox' || kind === 'feature detail') {
          uiController.setActiveFooterBarTab('data-table');
          await DomHelper.waitForReactIdle();
          const layerButton = DomHelper.getGVElementById<HTMLButtonElement>(mapId, 'footerBar-data-table-geojsonLYR5/polygons.json');
          if (!layerButton) throw new TestError('The Polygons Data Table layer must be mounted');
          await whenThisThen(() => !layerButton.disabled, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
          layerButton.click();
        }
        await DomHelper.waitForReactIdle();
        panelButton.click();
        await whenThisThen(
          () => getStoreUIActiveAppBarTab(mapId).isOpen && getStoreUIActiveAppBarTab(mapId).tabId === panelId,
          GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS
        );
        await DomHelper.waitForReactIdle();
        const panelClose = DomHelper.getGVElementById(mapId, `appBar-${panelId}-panel-close-btn`);
        if (!panelClose) throw new TestError('The app-bar panel close button must be mounted');
        // The panel focuses its close button after opening; let that finish before opening the dialog.
        await whenThisThen(() => DomHelper.getActiveElement() === panelClose, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        test.addStep(`Opening the ${kind} dialog...`);
        let openButton: HTMLElement | undefined;
        if (kind === 'basic table') {
          const layer = DomHelper.getGVElementById<HTMLElement>(mapId, 'appBar-layers-geojsonLYR5/polygons.json');
          if (!layer) throw new TestError('The companion Polygons layer must be mounted');
          layer.click();
          await whenThisThen(() => {
            const tableButton = DomHelper.getGVElementById<HTMLButtonElement>(mapId, 'appBar-table-details');
            openButton = tableButton;
            return !!tableButton && !tableButton.disabled;
          }, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        } else if (kind === 'fullscreen' || kind === 'legend fullscreen') {
          const panel = DomHelper.getAppBarPanel(mapId, panelId);
          openButton =
            panel?.querySelector<HTMLButtonElement>(
              kind === 'fullscreen' ? 'button[aria-label^="Full screen,"]' : 'button[aria-label="Ouvrir en plein écran"]'
            ) ?? undefined;
        } else if (kind === 'export') {
          openButton = DomHelper.getGVElementById<HTMLButtonElement>(mapId, 'appBar-export-modal-btn');
        } else {
          await whenThisThen(() => {
            openButton =
              kind === 'lightbox'
                ? DomHelper.queryGVSelector<HTMLButtonElement>(mapId, 'button[id$="_myImages"]')
                : DomHelper.getGVElementById<HTMLButtonElement>(mapId, 'footerBar-table-details-btn-0');
            return !!openButton;
          }, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        }
        if (!openButton) throw new TestError(`The ${kind} opening button must be mounted`);
        openButton.click();
        await whenThisThen(() => {
          dialog = DomHelper.queryGVSelector<HTMLElement>(
            mapId,
            kind === 'lightbox' ? '.yarl__root[role="dialog"][aria-modal="true"]' : '[role="dialog"][aria-modal="true"]'
          );
          closeButton =
            dialog?.querySelector<HTMLButtonElement>(kind === 'lightbox' ? 'button[aria-label="Close"]' : 'button') ?? undefined;
          return !!dialog && !!closeButton;
        }, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        if (!dialog || !closeButton) throw new TestError('The overlay and its close button must be mounted');
        await whenThisThen(() => {
          const settledFocus =
            kind === 'export' ? dialog?.querySelector<HTMLInputElement>(`#${CSS.escape(`${mapId}-export-title-input`)}`) : closeButton;
          return !!settledFocus && DomHelper.getActiveElement() === settledFocus;
        }, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        if (kind === 'lightbox') await delay(MODAL_FOCUS_SETTLE_MS);

        test.addStep('Pressing Ctrl+M from where focus lands after opening...');
        const landingFocus = DomHelper.getActiveElement();
        if (!landingFocus || !dialog.contains(landingFocus)) throw new TestError('Focus must land inside the dialog after opening');
        const landingPrevented = !landingFocus.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'm', ctrlKey: true, bubbles: true, cancelable: true })
        );
        await DomHelper.waitForReactIdle();
        const landingFocusUnchanged = DomHelper.getActiveElement() === landingFocus;
        const landingDialogOpen = dialog.isConnected && dialog.getAttribute('aria-modal') === 'true';

        const escapedFocus = kind === 'lightbox' ? DomHelper.getGVElementById<HTMLElement>(mapId, 'wcag-toplink') : dialog.parentElement;
        if (!escapedFocus || dialog.contains(escapedFocus)) throw new TestError('The escaped-focus target must be outside the dialog');
        escapedFocus.focus({ preventScroll: true });
        await delay(MODAL_FOCUS_SETTLE_MS);

        const focusBefore = DomHelper.getActiveElement();
        const appBarBefore = getStoreUIActiveAppBarTab(mapId);
        const footerBefore = getStoreUIActiveFooterBarTab(mapId);
        const crosshairBefore = getStoreAppIsCrosshairsActive(mapId);
        if (focusBefore !== escapedFocus)
          throw new TestError(`Focus must be on the escaped-focus target before Ctrl+M (observed ${focusBefore?.outerHTML.slice(0, 180)})`);
        const dialogOpenBefore = dialog.isConnected && dialog.getAttribute('aria-modal') === 'true';
        test.addStep('Pressing Ctrl+M from outside the dialog paper...');
        focusBefore.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control', ctrlKey: true, bubbles: true, cancelable: true }));
        const escapedPrevented = !focusBefore.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'm', ctrlKey: true, bubbles: true, cancelable: true })
        );
        await DomHelper.waitForReactIdle();
        const appBarAfter = getStoreUIActiveAppBarTab(mapId);
        const footerAfter = getStoreUIActiveFooterBarTab(mapId);
        const focusUnchanged = DomHelper.getActiveElement() === focusBefore;
        const crosshairAfter = getStoreAppIsCrosshairsActive(mapId);
        return {
          landingPrevented,
          landingFocusUnchanged,
          landingDialogOpen,
          escapedPrevented,
          dialogOpenBefore,
          dialogOpenAfter: dialog.isConnected && dialog.getAttribute('aria-modal') === 'true',
          focusUnchanged,
          appBarOpenBefore: appBarBefore.isOpen && appBarBefore.tabId === panelId,
          appBarOpenAfter: appBarAfter.isOpen && appBarAfter.tabId === panelId,
          footerUnchanged: footerBefore.isOpen === footerAfter.isOpen && footerBefore.tabId === footerAfter.tabId,
          crosshairBefore,
          crosshairAfter,
          modifierNotifications: keyboardEvents.filter((event) => event.key === 'Control').length,
          shortcutNotifications: keyboardEvents.filter((event) => (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'm')
            .length,
        };
      },
      (test, result): void => {
        test.addStep('Verifying Ctrl+M from the landing focus keeps the dialog and focus, and prevents the browser default...');
        Test.assertIsEqual(result.landingDialogOpen, true);
        Test.assertIsEqual(result.landingFocusUnchanged, true);
        Test.assertIsEqual(result.landingPrevented, true);
        test.addStep('Verifying Ctrl+M from the escaped focus prevents the browser default...');
        Test.assertIsEqual(result.escapedPrevented, true);
        test.addStep('Verifying the dialog remains open...');
        Test.assertIsEqual(result.dialogOpenBefore, true);
        Test.assertIsEqual(result.dialogOpenAfter, true);
        test.addStep('Verifying focus remains unchanged...');
        Test.assertIsEqual(result.focusUnchanged, true);
        test.addStep('Verifying the app-bar panel remains open...');
        Test.assertIsEqual(result.appBarOpenBefore, true);
        Test.assertIsEqual(result.appBarOpenAfter, true);
        test.addStep('Verifying the footer and crosshair are unchanged, and only the modifier key is notified...');
        Test.assertIsEqual(result.footerUnchanged, true);
        Test.assertIsEqual(result.crosshairBefore, false);
        Test.assertIsEqual(result.crosshairAfter, false);
        Test.assertIsEqual(result.modifierNotifications, 1);
        Test.assertIsEqual(result.shortcutNotifications, 0);
      },
      async (): Promise<void> => {
        viewer.offMapKeyboardEvent(keyboardEventDelegate);
        if (dialog?.isConnected && closeButton) {
          closeButton.click();
          await whenThisThen(() => !dialog?.isConnected, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        }
        uiController.setCrosshairActive(false);
        uiController.setActiveAppBarTab(originalAppBar.tabId, originalAppBar.isOpen, originalAppBar.isFocusTrapped ?? false);
        uiController.setActiveFooterBarTab(originalFooterBar.tabId || undefined, originalFooterBar.isOpen);
        uiController.setFooterBarIsOpen(originalFooterBar.isOpen);
        uiController.setActiveTrapGeoView(originalMode);
        uiController.enableFocusTrap(originalFocusItem);
        await DomHelper.waitForReactIdle();
        await delay(MODAL_FOCUS_SETTLE_MS);
        if (originalFocus instanceof HTMLElement && originalFocus.isConnected) originalFocus.focus({ preventScroll: true });
        uiController.setCrosshairActive(originalCrosshair);
        await DomHelper.waitForReactIdle();
      }
    );
  }

  /**
   * Tests that a companion viewer's modal does not block this viewer's shortcut.
   *
   * @returns A promise that resolves with the two-viewer observations
   */
  testModalShortcutViewerIsolation(): Promise<Test<TypeModalIsolationResult>> {
    const mapId = this.getMapId();
    const companionId = 'map14';
    const viewer = this.getMapViewer();
    const companion = this.getApi().getMapViewer(companionId);
    const ui = viewer.controllers.uiController;
    const companionUI = companion.controllers.uiController;
    const originalFocus = DomHelper.getActiveElement();
    const originalState = [mapId, companionId].map((id) => ({
      id,
      appBar: getStoreUIActiveAppBarTab(id),
      focusItem: getStoreUIFocusItem(id),
      mode: getStoreUIActiveTrapGeoView(id),
      crosshair: getStoreAppIsCrosshairsActive(id),
    }));
    let dialog: HTMLElement | undefined;
    let notifications = 0;
    const delegate = viewer.onMapKeyboardEvent((_sender, event) => {
      if ((event.keyboardEvent.ctrlKey || event.keyboardEvent.metaKey) && event.keyboardEvent.key.toLowerCase() === 'm') notifications += 1;
    });

    return this.test(
      'Test a companion modal does not block Ctrl+M in this viewer',
      async (test): Promise<TypeModalIsolationResult> => {
        const layers = DomHelper.getAppBarButton(mapId, 'layers');
        const legend = DomHelper.getAppBarButton(companionId, 'legend');
        const target = DomHelper.getMapTargetElement(mapId);
        if (!layers || !legend || !target || !target.ownerDocument.hasFocus()) {
          throw new TestError('Both viewers and the foreground page are required for modal isolation');
        }
        ui.disableFocusTrap('no-focus');
        companionUI.disableFocusTrap('no-focus');
        ui.setActiveAppBarTab(undefined, false, false);
        companionUI.setActiveAppBarTab(undefined, false, false);
        ui.setCrosshairActive(false);
        companionUI.setCrosshairActive(false);
        ui.setActiveTrapGeoView(false);
        companionUI.setActiveTrapGeoView(false);
        await DomHelper.waitForReactIdle();
        layers.click();
        await DomHelper.waitForReactIdle();
        const layersClose = DomHelper.getGVElementById(mapId, 'appBar-layers-panel-close-btn');
        if (!layersClose) throw new TestError('The Layers close button must be mounted');
        await whenThisThen(() => DomHelper.getActiveElement() === layersClose, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        legend.click();
        await DomHelper.waitForReactIdle();
        const legendClose = DomHelper.getGVElementById(companionId, 'appBar-legend-panel-close-btn');
        if (!legendClose) throw new TestError('The companion Legend close button must be mounted');
        await whenThisThen(() => DomHelper.getActiveElement() === legendClose, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        const button = DomHelper.getAppBarPanel(companionId, 'legend')?.querySelector<HTMLButtonElement>(
          'button[aria-label="Ouvrir en plein écran"]'
        );
        if (!button) throw new TestError('The companion Legend fullscreen button must be mounted');
        test.addStep('Opening the companion Legend and immediately pressing Ctrl+M in the first viewer...');
        button.click();
        await whenThisThen(
          () => {
            dialog = DomHelper.queryGVSelector<HTMLElement>(companionId, '[role="dialog"][aria-modal="true"]');
            return !!dialog;
          },
          GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS,
          10
        );
        layers.focus({ preventScroll: true });
        if (DomHelper.getActiveElement() !== layers) throw new TestError('The first viewer must have focus before Ctrl+M');
        const companionDialogOpen = !!dialog?.isConnected;
        const shortcutPrevented = !layers.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'm', ctrlKey: true, bubbles: true, cancelable: true })
        );
        return {
          companionDialogOpen,
          shortcutPrevented,
          mainPanelClosed: !getStoreUIActiveAppBarTab(mapId).isOpen,
          companionPanelOpen: getStoreUIActiveAppBarTab(companionId).isOpen,
          mainCrosshair: getStoreAppIsCrosshairsActive(mapId),
          notifications,
        };
      },
      (test, result): void => {
        test.addStep('Verifying the shortcut affects only the focused viewer while the companion modal is open...');
        Test.assertIsEqual(result.companionDialogOpen, true);
        Test.assertIsEqual(result.mainPanelClosed, true);
        Test.assertIsEqual(result.companionPanelOpen, true);
        Test.assertIsEqual(result.mainCrosshair, true);
        Test.assertIsEqual(result.notifications, 1);
        Test.assertIsEqual(result.shortcutPrevented, true);
      },
      async (): Promise<void> => {
        viewer.offMapKeyboardEvent(delegate);
        if (dialog?.isConnected) {
          dialog.querySelector<HTMLButtonElement>('button')?.click();
          await whenThisThen(() => !dialog?.isConnected, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        }
        originalState.forEach(({ id, appBar, focusItem, mode }) => {
          const controller = this.getApi().getMapViewer(id).controllers.uiController;
          controller.setActiveAppBarTab(appBar.tabId, appBar.isOpen, appBar.isFocusTrapped ?? false);
          controller.setActiveTrapGeoView(mode);
          controller.enableFocusTrap(focusItem);
        });
        await DomHelper.waitForReactIdle();
        if (originalFocus instanceof HTMLElement && originalFocus.isConnected) originalFocus.focus({ preventScroll: true });
        originalState.forEach(({ id, crosshair }) => this.getApi().getMapViewer(id).controllers.uiController.setCrosshairActive(crosshair));
      }
    );
  }
}

// #region TYPES AND INTERFACES

/** Details sub-panel and selected-feature observations across outer-panel dismissal and reopening. */
interface TypeDetailsReopenResult {
  dismissal: string;
  subPanelOpenBefore: boolean;
  detailsClosed: boolean;
  subPanelHiddenWithDetails: boolean;
  detailsReopened: boolean;
  subPanelReopened: boolean;
  selectedLayerPath: string;
  reopenedLayerPath: string;
  featureIndex: number;
  reopenedFeatureIndex: number;
}

/** Observations before and after returning from Details to the map with Ctrl+M. */
interface TypeKeyboardQueryFocusResult {
  mapTargetId: string;
  queries: Coordinate[];
  observations: {
    expectsFeatures: boolean;
    expectedCoordinate: Coordinate;
    shortcutFocusId: string | undefined;
    shortcutCrosshairActive: boolean;
    detailsClosedAfterShortcut: boolean;
    queryCountAfterShortcut: number;
    focusAfterQuery: string | undefined;
    mainCloseId: string;
    focusDepartures: string[];
    detailsOpenAfterQuery: boolean;
    crosshairInactiveAfterQuery: boolean;
    subPanelVisible: boolean;
    featuresVisible: boolean;
    guideVisible: boolean;
    subPanelClosedBeforeQuery: boolean | undefined;
    escape?: { detailsClosed: boolean; focusId: string | undefined; crosshairActive: boolean };
  }[];
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
  shortcutPrevented: boolean[];
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
  subPanelFocusedBeforeLeaving: boolean;
  focusAfterLeaving: string | undefined;
  outsideControlId: string;
  focusReturnedToMapAfterEscape: boolean;
  focusRemainsOnLayersButton: boolean;
  crosshairInactiveAfterEscape: boolean;
}

/** Export modal and map keyboard notification observations after Ctrl+M. */
interface TypeExportModalShortcutResult {
  exportOpenBeforeShortcut: boolean;
  exportOpenAfterShortcut: boolean;
  exportFocusStayedInModal: boolean;
  exportShortcutNotifications: number;
  exportShortcutPrevented: boolean;
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
  shareShortcutPrevented: boolean;
  shareShortcutNotifications: number;
  crosshairRemainsInactive: boolean;
}

type TypeOverlayKind = 'fullscreen' | 'legend fullscreen' | 'lightbox' | 'export' | 'basic table' | 'feature detail';

/** Overlay observations before and after Ctrl+M. */
interface TypeOverlayShortcutResult {
  landingPrevented: boolean;
  landingFocusUnchanged: boolean;
  landingDialogOpen: boolean;
  escapedPrevented: boolean;
  dialogOpenBefore: boolean;
  dialogOpenAfter: boolean;
  focusUnchanged: boolean;
  appBarOpenBefore: boolean;
  appBarOpenAfter: boolean;
  footerUnchanged: boolean;
  crosshairBefore: boolean;
  crosshairAfter: boolean;
  modifierNotifications: number;
  shortcutNotifications: number;
}

/** Observations when another viewer has a modal open. */
interface TypeModalIsolationResult {
  companionDialogOpen: boolean;
  shortcutPrevented: boolean;
  mainPanelClosed: boolean;
  companionPanelOpen: boolean;
  mainCrosshair: boolean;
  notifications: number;
}

// #endregion TYPES AND INTERFACES
