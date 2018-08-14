/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The Ontology Wallet&ID.
 *
 * The The Ontology Wallet&ID is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Ontology Wallet&ID is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The Ontology Wallet&ID.  If not, see <http://www.gnu.org/licenses/>.
 */
import { browser } from 'webextension-polyfill-ts';

const width = 350;
const height = 430 + 22;
let popupId: number | undefined;

export async function sendMessageToPopup(msg: any) {
  return browser.runtime.sendMessage(msg);
}

export async function showPopup() {
  let popup = await findPopup();

  if (popup !== null) {
    browser.windows.update(popup.id!, { focused: true });
  } else {
    popup = await browser.windows.create({
      height,
      type: 'popup',
      url: 'popup.html',
      width,
    });
    popupId = popup.id;
  }
}

async function findPopup() {
  const windows = await browser.windows.getAll({
    windowTypes: ['popup']
  });

  const ownWindows = windows.filter(w => w.id === popupId);

  if (ownWindows.length > 0) {
    return ownWindows[0];
  } else {
    return null;
  }
}
