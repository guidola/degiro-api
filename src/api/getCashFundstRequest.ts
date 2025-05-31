import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { AccountConfigType, AccountDataType, CashFoundType } from '../types'

// Import debug console log
import { debug, processGetCashFundsResultListObject } from '../utils'
import { DEGIRO_API_PATHS } from '../enums/DeGiroEnums'
const { GET_GENERIC_DATA_PATH } = DEGIRO_API_PATHS

// tslint:disable-next-line: max-line-length
export function getCashFundstRequest(accountData: AccountDataType, accountConfig: AccountConfigType): Promise<CashFoundType[]> {
  return new Promise((resolve, reject) => {

    let params = ''
    params += 'cashFunds=0&'
    params += 'limit=100'

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
    const uri = `${accountConfig.data.tradingUrl}${GET_GENERIC_DATA_PATH}${accountData.data.intAccount};jsessionid=${accountConfig.data.sessionId}?${params}`
    debug(`Making request to ${uri}`)
    fetch(uri, finalRequestOptions)
      .then(res => res.json())
      .then((res) => {
        if (!res.cashFunds || !res.cashFunds.value || !Array.isArray(res.cashFunds.value)) {
          return reject('Invalid response format')
        }
        const data = res.cashFunds.value
        debug('Response:\n', JSON.stringify(res, null, 2))
        resolve(data.map(processGetCashFundsResultListObject))
      })
      .catch(reject)
  })
}