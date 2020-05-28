/*
 * Copyright (C) 2018 ontio
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
import DirectWebSDK from '@toruslabs/torus-direct-web-sdk'

let torus: any;
export function initTorusProvider() {
     torus = new DirectWebSDK({
        DISCORD_CLIENT_ID: '714739402257072190',
        FACEBOOK_CLIENT_ID: '2554219104599979',
        GOOGLE_CLIENT_ID: '103942065306-jufn24m5e435r3jhglphbh5etbgqnvr1.apps.googleusercontent.com',
        REDDIT_CLIENT_ID: 'dcQJYPaG481XyQ',
        TWITCH_CLIENT_ID: 'tfppratfiloo53g1x133ofa4rc29px',
        baseUrl: 'https://localhost:3000/serviceworker',
        network: 'ropsten',
        proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183',
        redirectToOpener: true,
      })
    torus.init()
}
 
export function getTorusSdk() {
    return torus;
}