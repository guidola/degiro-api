import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { AccountConfigType, AccountDataType, AccountInfoType } from '../types'

// Import debug console log
import { debug } from '../utils'

// Importamos constantes
import { DEGIRO_API_PATHS } from '../enums'
const { GET_ACCOUNT_INFO_PATH } = DEGIRO_API_PATHS

export function getAccountInfoRequest(accountData: AccountDataType, accountConfig: AccountConfigType): Promise<AccountInfoType> {
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
    const uri = `${accountConfig.data.tradingUrl}${GET_ACCOUNT_INFO_PATH}${accountData.data.intAccount};jsessionid=${accountConfig.data.sessionId}`
    debug(`Making request to ${uri}`)
    fetch(uri, finalRequestOptions)
      .then(res => res.json())
      .then((res) => {
        debug('Response:\n', JSON.stringify(res, null, 2))
        const data: AccountInfoType = res.data
        resolve(data)
      })
      .catch(reject)

  })
}