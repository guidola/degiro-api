import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { AccountDataType, AccountConfigType } from '../types'

// Import debug console log
import { debug } from '../utils'

export function getAccountDataRequest(accountConfig: AccountConfigType): Promise<AccountDataType> {
  return new Promise((resolve, reject) => {

    const baseRequestOptions: RequestInit = {
      headers: {
        Cookie: `JSESSIONID=${accountConfig.data.sessionId};`,
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
    debug(`Making request to ${accountConfig.data.paUrl}client?sessionId=${accountConfig.data.sessionId}`)
    fetch(`${accountConfig.data.paUrl}client?sessionId=${accountConfig.data.sessionId}`, finalRequestOptions)
      .then(res => res.json())
      .then((res: AccountDataType) => {
        debug('Response:\n', JSON.stringify(res, null, 2))
        resolve(res)
      })
      .catch(reject)
  })
}