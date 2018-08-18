import { browser } from 'webextension-polyfill-ts';
import { PopupManager } from './popUpManager';

export function initBrowserAction(popupManager: PopupManager) {
  browser.browserAction.onClicked.addListener(popupManager.show);
}
