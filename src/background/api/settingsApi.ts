import { TokenState } from 'src/redux/settings';
/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of Cyano Wallet.
 *
 * Cyano Wallet is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Cyano Wallet is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cyano Wallet.  If not, see <http://www.gnu.org/licenses/>.
 */
import { SettingsState } from '../../redux/settings';
import { storageGet, storageSet } from './storageApi';

export async function saveSettings(settings: SettingsState) {
  storageSet('settings', JSON.stringify(settings))
}

const DEFAULT_OEP4S: TokenState[] = [
    {
        contract: '061a07cd393aac289b8ecfda2c3784b637a2fb33',
        decimals: 6,
        name: 'pUSDC',
        specification: 'OEP-4',
        symbol: 'pUSDC',
        vmType: 'NEOVM'
    },
    {
        contract: '8037dd7161401417d3571b92b86846d34309129a',
        decimals: 8,
        name: 'pWBTC',
        specification: 'OEP-4',
        symbol: 'pWBTC',
        vmType: 'NEOVM'
    },
    {
        contract: '46c3051c553aaeb3724ea69336ec483f39fa91b1',
        decimals: 8,
        name: 'prenBTC',
        specification: 'OEP-4',
        symbol: 'prenBTC',
        vmType: 'NEOVM'
    },
    {
        contract: '33ae7eae016193ba0fe238b223623bc78faac158',
        decimals: 9,
        name: 'ONTd',
        specification: 'OEP-4',
        symbol: 'ONTd',
        vmType: 'NEOVM'
    },
    {
        contract: '00c59fcd27a562d6397883eab1f2fff56e58ef80',
        decimals: 9,
        name: 'Wing Token',
        specification: 'OEP-4',
        symbol: 'WING',
        vmType: 'NEOVM'
    }
]

export async function loadSettings(): Promise<SettingsState | null> {
  const settings = await storageGet('settings');

  if (settings === null) {
    return null;
  }

    try {
      const settingObj = JSON.parse(settings) as SettingsState;
      const oep4s = [...settingObj.tokens]
      for (const oep4 of DEFAULT_OEP4S) {
          if (!oep4s.find(item => item.contract === oep4.contract)) {
              oep4s.push(oep4)
          }
      }
      settingObj.tokens = oep4s
      saveSettings(settingObj)
      return settingObj
  } catch (e) {
    return null;
  }
}
