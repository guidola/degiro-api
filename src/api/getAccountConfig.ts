import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { AccountConfigType } from '../types'

// Import enums
import { DEGIRO_API_PATHS } from '../enums'
const { BASE_API_URL, GET_ACCOUNT_CONFIG_PATH } = DEGIRO_API_PATHS

// Import debug console log
import { debug } from '../utils'

export function getAccountConfigRequest(sessionId: string): Promise<AccountConfigType> {
  return new Promise((resolve, reject) => {

    const baseRequestOptions: RequestInit = {
      headers: {
        Cookie: `JSESSIONID=${sessionId};`,
        Referer: 'https://trader.degiro.nl/trader/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      },
    };

    let finalRequestOptions = { ...baseRequestOptions };

    const proxyUrl = process.env.HTTP_PROXY;
    if (proxyUrl) {
      const agent = new HttpsProxyAgent(proxyUrl);
      finalRequestOptions = { ...finalRequestOptions, agent };
    }

    // Do the request to get a account config data
    debug(`Making request to ${BASE_API_URL}${GET_ACCOUNT_CONFIG_PATH} with JSESSIONID: ${sessionId}`)
    fetch(BASE_API_URL + GET_ACCOUNT_CONFIG_PATH, finalRequestOptions)
      .then((res) => {
        if (!res.ok) { reject(res.statusText) }
        return res.json()
      })
      .then((res: AccountConfigType) => {
        debug('Response:\n', JSON.stringify(res, null, 2))
        resolve(res)
      })
      .catch(reject)

  })
}
