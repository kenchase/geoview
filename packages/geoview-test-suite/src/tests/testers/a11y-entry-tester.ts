import { getStoreAppIsCrosshairsActive } from 'geoview-core/core/stores/states/app-state';
import { getStoreUIActiveTrapGeoView } from 'geoview-core/core/stores/states/ui-state';
import { DomHelper } from 'geoview-core/core/utils/dom-helper';
import { whenThisThen } from 'geoview-core/core/utils/utilities';
import { TestError, TestSkippedError } from '../core/exceptions';
import { Test } from '../core/test';
import { GVAbstractTester } from './abstract-gv-tester';

const COMPANION_ID = 'map14';
const PROMPT_IDS = ['wcag-dialog-title', 'wcag-dialog-description', 'enable-focus', 'skip-focus'];
const VIEWER_IDS = ['wcag-toplink', 'wcag-bottomlink', 'wcag-link-to-map', 'mapTargetElement', 'appBar-settings-btn'];
const SETTINGS_SWITCH = 'appBar-settings-panel-keyboard-navigation';

/** Exercises keyboard entry handlers on the two Group 6 viewers. */
export class A11yEntryTester extends GVAbstractTester {
  /** @returns The tester name shown in Group 6 results */
  override getName(): string {
    return 'A11yEntryTester';
  }

  /** @returns The first-entry guard and Settings switch observations */
  testSettingsEntryGuard(): Promise<Test<EntryCheck[]>> {
    return this.#runEntryTest(
      'Test Settings and the first-entry guard on a fresh companion viewer',
      async (entry) => {
        const b = COMPANION_ID;
        const a = this.getMapId();
        const trigger = A11yEntryTester.#requireControl(b, 'appBar-settings-btn');
        await entry.activate(trigger, 'Open Settings in the companion viewer');
        const toggle = A11yEntryTester.#requireControl(b, SETTINGS_SWITCH);
        await whenThisThen(() => DomHelper.getActiveElement() === toggle, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
        entry.focus(b, SETTINGS_SWITCH);
        entry.ids(b, SETTINGS_SWITCH);
        entry.mode(b, false);
        entry.prompt();

        entry.check(
          'The off switch Tab was intercepted',
          await entry.pressKey('Tab', 'Check the first-entry guard from the off switch'),
          true
        );
        entry.focus(b, 'wcag-toplink');
        await entry.activate(toggle, 'Enable the companion mode via Settings');
        entry.focus(b, SETTINGS_SWITCH);
        entry.mode(b, true);
        entry.mode(a, false);
        entry.prompt();
        entry.check(
          'Reverse Tab was not intercepted while the mode was on',
          await entry.pressKey('Tab', 'Check the guard while the mode is on', { shiftKey: true }),
          false
        );

        await entry.activate(toggle, 'Turn the companion mode off before showing the prompt');
        entry.focus(b, SETTINGS_SWITCH);
        entry.mode(b, false);
        entry.check(
          'Reverse Tab was intercepted after turning the mode off',
          await entry.pressKey('Tab', 'Check that reverse Tab redirects to the top link', { shiftKey: true }),
          true
        );
        entry.focus(b, 'wcag-toplink');
        await A11yEntryTester.#openPrompt(entry, b);
        await entry.activate(A11yEntryTester.#requireControl(b, 'enable-focus'), 'Enable from the prompt');
        entry.focus(b, 'wcag-link-to-map');
        await entry.pressKey('q', 'Turn the mode off and close Settings', { ctrlKey: true });
        entry.focus(b, 'wcag-toplink');
        entry.mode(b, false);
        A11yEntryTester.#requireControl(b, 'mapTargetElement').focus({ preventScroll: true });
        entry.check(
          'The first-entry guard did not intercept Tab after showing the prompt',
          await entry.pressKey('Tab', 'Check the guard after the prompt has been shown'),
          false
        );
        entry.focus(b, 'mapTargetElement');
        entry.prompt();

        await A11yEntryTester.#openPrompt(entry, b);
      },
      true
    );
  }

  /** @returns The forward entry, Enable and inner skip link observations */
  testForwardEntryEnable(): Promise<Test<EntryCheck[]>> {
    return this.#runEntryTest('Test opening the prompt from the top link, Enable, and focus the map', async (entry) => {
      const a = this.getMapId();
      entry.prompt();
      await A11yEntryTester.#openPrompt(entry, a);
      await entry.activate(A11yEntryTester.#requireControl(a, 'enable-focus'), 'Enable keyboard navigation');
      entry.focus(a, 'wcag-link-to-map');
      entry.mode(a, true);
      entry.mode(COMPANION_ID, false);
      entry.crosshair(a, false);
      await entry.activate(A11yEntryTester.#requireControl(a, 'wcag-link-to-map'), 'Activate the inner map skip link');
      entry.focus(a, 'mapTargetElement');
      entry.crosshair(a, true);
      entry.crosshair(COMPANION_ID, false);
      entry.prompt();
    });
  }

  /** @returns The reverse and forward Skip destinations */
  testForwardAndReverseEntrySkip(): Promise<Test<EntryCheck[]>> {
    return this.#runEntryTest('Test Skip returns to the opposite outer link for reverse and forward entry', async (entry) => {
      const b = COMPANION_ID;
      const a = this.getMapId();
      await A11yEntryTester.#openPrompt(entry, b, true);
      await this.#skipPrompt(entry, b, 'wcag-toplink');

      await A11yEntryTester.#openPrompt(entry, a);
      await this.#skipPrompt(entry, a, 'wcag-bottomlink');
    });
  }

  /** @returns The crosshair and Ctrl+M / Ctrl+Q isolation observations */
  testTwoMapKeyboardShortcuts(): Promise<Test<EntryCheck[]>> {
    return this.#runEntryTest('Test the crosshair and keyboard shortcuts are scoped to the focused viewer', async (entry) => {
      const a = this.getMapId();
      const b = COMPANION_ID;
      for (const id of [a, b]) {
        // eslint-disable-next-line no-await-in-loop -- The two viewers share browser focus.
        await A11yEntryTester.#openPrompt(entry, id);
        // eslint-disable-next-line no-await-in-loop -- Finish the current prompt before opening the next one.
        await entry.activate(A11yEntryTester.#requireControl(id, 'enable-focus'), `Enable keyboard navigation on ${id}`);
        entry.focus(id, 'wcag-link-to-map');
      }
      entry.mode(a, true);
      entry.mode(b, true);

      await entry.activate(A11yEntryTester.#requireControl(a, 'wcag-link-to-map'), 'Focus the first map and activate its crosshair');
      entry.focus(a, 'mapTargetElement');
      entry.crosshair(a, true);
      entry.crosshair(b, false);
      A11yEntryTester.#requireControl(b, 'wcag-link-to-map').focus();
      entry.crosshair(a, false);
      entry.mode(a, true);
      await entry.pressKey('m', 'Activate Ctrl+M in the companion viewer', { ctrlKey: true });
      entry.focus(b, 'mapTargetElement');
      entry.crosshair(b, true);
      entry.crosshair(a, false);
      await entry.pressKey('m', 'Repeat Ctrl+M without toggling the crosshair off', { ctrlKey: true });
      entry.focus(b, 'mapTargetElement');
      entry.crosshair(b, true);
      await entry.pressKey('q', 'Exit keyboard navigation in the companion viewer', { ctrlKey: true });
      entry.focus(b, 'wcag-toplink');
      entry.mode(b, false);
      entry.mode(a, true);
      entry.crosshair(b, false);
      entry.before.focus();
      await entry.pressKey('m', 'Verify Ctrl+M does nothing from the host page', { ctrlKey: true });
      entry.check('Host control retained focus', DomHelper.getActiveElement()?.id, entry.before.id);
      entry.crosshair(a, false);
      entry.crosshair(b, false);
      entry.prompt();
    });
  }

  /** @returns The effect of mouse movement on the overlay while the entry prompt awaits an answer */
  testUnansweredPromptStaysOpenOnMouseMove(): Promise<Test<EntryCheck[]>> {
    return this.#runEntryTest('Test mouse movement on the unanswered prompt overlay leaves it open', async (entry) => {
      const b = COMPANION_ID;
      const a = this.getMapId();
      await A11yEntryTester.#openPrompt(entry, b);
      const dialog = A11yEntryTester.#requireControl(b, 'wcag-dialog-title').closest('[role="dialog"]');
      const overlay = dialog?.parentElement;
      if (!overlay || !DomHelper.getGVRootElement(b).contains(overlay)) throw new TestError('Missing companion prompt overlay');

      // Target the overlay surrounding the dialog, not the map underneath it.
      overlay.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, movementX: 10 }));
      await DomHelper.waitForReactIdle();
      entry.prompt(b);
      entry.focus(b, 'enable-focus');
      entry.mode(b, false);
      entry.mode(a, false);
      await entry.activate(A11yEntryTester.#requireControl(b, 'enable-focus'), 'Enable after mouse movement');
      entry.focus(b, 'wcag-link-to-map');
      entry.mode(b, true);
    });
  }

  /** Invokes the boundary link's key handler without depending on native Tab traversal. */
  static async #openPrompt(entry: EntryTestContext, mapId: string, reverse = false): Promise<void> {
    const suffix = reverse ? 'wcag-bottomlink' : 'wcag-toplink';
    A11yEntryTester.#requireControl(mapId, suffix).focus({ preventScroll: true });
    entry.focus(mapId, suffix);
    const intercepted = await entry.pressKey('Tab', `Open ${mapId} prompt from the ${reverse ? 'bottom' : 'top'} link`, {
      shiftKey: reverse,
    });
    entry.check(`${mapId} boundary intercepted the entry key`, intercepted, true);
    entry.prompt(mapId);
  }

  /** Records the actual handoff after closing the prompt, even if the destination is missing. */
  async #skipPrompt(entry: EntryTestContext, mapId: string, suffix: string): Promise<void> {
    await entry.activate(A11yEntryTester.#requireControl(mapId, 'skip-focus'), `Skip ${mapId}`);
    entry.focus(mapId, suffix);
    entry.mode(this.getMapId(), false);
    entry.mode(COMPANION_ID, false);
    entry.prompt();
  }

  /** Resolves a fixture element without ever borrowing another map’s control. */
  static #requireControl(mapId: string, suffix: string): HTMLElement {
    const control = DomHelper.getGVElementById(mapId, suffix);
    if (!control) throw new TestError(`Missing ${mapId}-${suffix}`);
    return control;
  }

  /** Runs a case and restores both viewers and host focus afterward. */
  #runEntryTest(title: string, exercise: (entry: EntryTestContext) => Promise<void>, freshCompanion = false): Promise<Test<EntryCheck[]>> {
    const ownerId = this.getMapId();
    const mapIds = [ownerId, COMPANION_ID];
    const doc = DomHelper.getGVRootElement(ownerId).ownerDocument;
    let restore: (() => Promise<void>) | undefined;

    return this.test(
      title,
      async (test): Promise<EntryCheck[]> => {
        const before = doc.querySelector<HTMLElement>('#a11y-entry-before');
        if (!before || !this.getApi().hasMapViewer(COMPANION_ID)) {
          throw new TestSkippedError('Two-map entry tests require the Group 6 companion fixture');
        }
        if (
          mapIds.some((id) => !DomHelper.getGVRootElement(id).checkVisibility({ visibilityProperty: true })) ||
          doc.visibilityState !== 'visible' ||
          !doc.hasFocus()
        ) {
          throw new TestSkippedError('Two-map entry tests require both Group 6 viewers visible and the document in the foreground');
        }

        const originalFocus = DomHelper.getActiveElement();
        const originalState = mapIds.map((id) => ({
          id,
          mode: getStoreUIActiveTrapGeoView(id),
          crosshair: getStoreAppIsCrosshairsActive(id),
        }));
        restore = async (): Promise<void> => {
          for (const { id, mode, crosshair } of originalState) {
            const enable = DomHelper.getGVElementById(id, 'enable-focus');
            if (enable) {
              enable.click();
              // eslint-disable-next-line no-await-in-loop -- The next case must not observe a closing modal from this case.
              await whenThisThen(() => !enable.isConnected, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
            }
            const { uiController } = this.getApi().getMapViewer(id).controllers;
            uiController.closeMapPopovers();
            uiController.setActiveTrapGeoView(mode);
            uiController.setCrosshairActive(crosshair);
          }
          if (originalFocus instanceof HTMLElement && originalFocus.isConnected) originalFocus.focus({ preventScroll: true });
        };
        if (freshCompanion) {
          const companion = await this.getApi().reload(COMPANION_ID);
          await companion.waitForMapReady();
        }
        mapIds.forEach((id) => {
          const { uiController } = this.getApi().getMapViewer(id).controllers;
          uiController.setActiveTrapGeoView(false);
          uiController.setCrosshairActive(false);
        });
        await DomHelper.waitForReactIdle();

        const checks: EntryCheck[] = [];
        /** Records a named observation for the assertion callback. */
        const check: EntryTestContext['check'] = (label, actual, expected): void => {
          checks.push({ label, actual, expected });
        };
        /** Counts ID matches page-wide and verifies their ownership. */
        const ids = (id: string, suffix: string, present = true): void => {
          const fullId = DomHelper.buildGVElementId(id, suffix);
          // A scoped lookup alone cannot detect an ID duplicated in another viewer or in the host page.
          const matches = Array.from(doc.querySelectorAll(`#${CSS.escape(fullId)}`));
          check(`${fullId} count`, matches.length, present ? 1 : 0);
          if (present)
            check(`${fullId} belongs to ${id}`, matches.length === 1 && DomHelper.getGVRootElement(id).contains(matches[0]), true);
        };
        /** Records the actual focus ID and the expected target’s ownership. */
        const focus = (id: string, suffix: string): void => {
          check(
            `Focus destination for ${id}`,
            DomHelper.getActiveElement()?.id || DomHelper.getActiveElement()?.tagName,
            `${id}-${suffix}`
          );
          ids(id, suffix);
        };
        mapIds.forEach((id) => VIEWER_IDS.forEach((suffix) => ids(id, suffix)));
        await exercise({
          before,
          check,
          ids,
          focus,
          pressKey: async (key, label, modifiers): Promise<boolean> => {
            test.addStep(label);
            const active = DomHelper.getActiveElement();
            if (!active || active === doc.body) throw new TestError(`Cannot press ${key} without a focused control`);
            const event = new KeyboardEvent('keydown', {
              key,
              code: key === 'Tab' ? 'Tab' : `Key${key.toUpperCase()}`,
              bubbles: true,
              cancelable: true,
              ...modifiers,
            });
            active.dispatchEvent(event);
            await DomHelper.waitForReactIdle();
            return event.defaultPrevented;
          },
          activate: async (control, label): Promise<void> => {
            test.addStep(label);
            control.focus({ preventScroll: true });
            control.click();
            await DomHelper.waitForReactIdle();
            if (/-(enable|skip)-focus$/.test(control.id)) {
              await whenThisThen(() => !control.isConnected, GVAbstractTester.KEYBOARD_QUERY_TIMEOUT_MS);
            }
          },
          prompt: (id): void => {
            mapIds.forEach((viewerId) => PROMPT_IDS.forEach((suffix) => ids(viewerId, suffix, viewerId === id)));
            if (id) focus(id, 'enable-focus');
          },
          mode: (id, expected): void => check(`${id} keyboard navigation mode`, getStoreUIActiveTrapGeoView(id), expected),
          crosshair: (id, expected): void => check(`${id} crosshair`, getStoreAppIsCrosshairsActive(id), expected),
        });
        return checks;
      },
      (test, checks): void => {
        const mismatches = checks.filter(({ actual, expected }) => actual !== expected);
        const diagnostics = mismatches.map(({ label, actual, expected }) => `${label}: expected ${expected}, observed ${actual}`);
        diagnostics.forEach((message) => test.addStep(message));
        Test.assertIsEqual(diagnostics.join('; '), '');
      },
      async (): Promise<void> => {
        if (restore) await restore();
      }
    );
  }
}

// #region TYPES AND INTERFACES

type EntryValue = string | number | boolean | undefined;

interface EntryCheck {
  label: string;
  actual: EntryValue;
  expected: EntryValue;
}

interface EntryTestContext {
  before: HTMLElement;
  pressKey: (key: string, label: string, modifiers?: Pick<KeyboardEventInit, 'shiftKey' | 'ctrlKey'>) => Promise<boolean>;
  activate: (control: HTMLElement, label: string) => Promise<void>;
  check: (label: string, actual: EntryValue, expected: EntryValue) => void;
  ids: (id: string, suffix: string) => void;
  focus: (id: string, suffix: string) => void;
  prompt: (id?: string) => void;
  mode: (id: string, expected: boolean) => void;
  crosshair: (id: string, expected: boolean) => void;
}

// #endregion TYPES AND INTERFACES
