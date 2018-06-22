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
let storageGet: (key: string) => Promise<string | null>;
let storageSet: (key: string, value: string) => Promise<void>;
let storageClear: (key: string) => Promise<void>;

if (typeof browser === 'undefined') {
  storageGet = (key) => {
    const value = localStorage.getItem(key);
    return Promise.resolve(value);
  };

  storageSet = (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  };

  storageClear = (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  };
} else {
  storageGet = async (key) => {
    const result = await browser.storage.local.get(key);
    return result[key] as string | null;
  };

  storageSet = async (key, value) => {
    const current = await browser.storage.local.get();
    await browser.storage.local.set({...current, [key]: value});
    return Promise.resolve();
  };

  storageClear = async (key) => {
    await browser.storage.local.remove(key);
    return Promise.resolve();
  };
}

export {
    storageSet,
    storageGet,
    storageClear
};
