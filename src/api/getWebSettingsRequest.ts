import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { AccountConfigType, AccountDataType, WebSettingsType } from '../types'

// Import debug console log
import { debug } from '../utils'

// Importamos constantes
import { DEGIRO_API_PATHS } from '../enums'
const { GET_WEB_SETTINGS_PATH } = DEGIRO_API_PATHS

export function getWebSettingsRequest(accountData: AccountDataType, accountConfig: AccountConfigType): Promise<WebSettingsType> {
  return new Promise((resolve, reject) => {

    const baseRequestOptions: RequestInit = {
      headers: {
        Cookie: `JSESSIONID=${accountConfig.data.sessionId};`,
        Referer: 'https://trader.degiro.nl/trader/',
      },
    };

    let finalRequestOptions = { ...baseRequestOptions };

    const proxyUrl = process.env.HTTP_PROXY;
    if (proxyUrl) {
      const agent = new HttpsProxyAgent(proxyUrl);
      finalRequestOptions = { ...finalRequestOptions, agent };
    }

    // Do the request to get a account config data
    const uri = `${accountConfig.data.paUrl}${GET_WEB_SETTINGS_PATH}?intAccount=${accountData.data.intAccount}&sessionId=${accountConfig.data.sessionId}`
    debug(`Making request to ${uri}`)
    fetch(uri, finalRequestOptions)
      .then(res => res.json())
      .then((res) => {
        debug('Response:\n', JSON.stringify(res, null, 2))
        const data: WebSettingsType = res.data
        resolve(data)
      })
      .catch(reject)

  })
}