import { browser } from 'webextension-polyfill-ts';
import { popupManager } from './popUpManager';

export function initBrowserAction() {
  browser.browserAction.onClicked.addListener(popupManager.show);
}
