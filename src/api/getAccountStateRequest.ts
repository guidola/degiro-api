import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { AccountConfigType, AccountDataType, GetAccountStateOptionsType } from '../types'

// Import debug console log
import { debug } from '../utils'
import { DEGIRO_API_PATHS } from '../enums/DeGiroEnums'
const { GET_ACCOUNT_STATE_PATH } = DEGIRO_API_PATHS

// tslint:disable-next-line: max-line-length
export function getAccountStateRequest(accountData: AccountDataType, accountConfig: AccountConfigType, config: GetAccountStateOptionsType): Promise<any[]> {
  return new Promise((resolve, reject) => {
    // Create params to get orders by types
    const { from, to } = config
    let params = ''
    params += `fromDate=${encodeURIComponent(from)}&`
    params += `toDate=${encodeURIComponent(to)}&`
    params += `intAccount=${accountData.data.intAccount}&`
    params += `sessionId=${accountConfig.data.sessionId}`

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
    const uri = `${accountConfig.data.reportingUrl}${GET_ACCOUNT_STATE_PATH}?${params}`
    debug(`Making request to ${uri}`)
    fetch(uri, finalRequestOptions)
      .then(res => res.json())
      .then((res) => {
        if (!res.data || !res.data.cashMovements || !Array.isArray(res.data.cashMovements)) return reject('DeGiro response does not match with know scheme')
        resolve(res.data.cashMovements)
      })
      .catch(reject)
  })
}