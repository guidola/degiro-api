import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { AccountConfigType, AccountDataType, StockType, GetPopularStocksConfigType } from '../types'

// Import debug console log
import { debug } from '../utils'

// Importamos constantes
import { DEGIRO_API_PATHS } from '../enums'
const { STOCKS_SEARCH_PATH } = DEGIRO_API_PATHS

// tslint:disable-next-line: max-line-length
export function getPopularStocksRequest(accountData: AccountDataType, accountConfig: AccountConfigType, config: GetPopularStocksConfigType): Promise<StockType[]> {
  return new Promise((resolve, reject) => {

    // Create fetch request options
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

    // Create params to reach popular stocks
    const { popularOnly = true, requireTotal = false, limit = 9, offset = 0 } = config
    let params = ''
    params += `popularOnly=${popularOnly}&`
    params += `requireTotal=${requireTotal}&`
    params += `offset=${offset}&`
    params += `limit=${limit}&`
    params += `intAccount=${accountData.data.intAccount}&`
    params += `sessionId=${accountConfig.data.sessionId}`

    // Do the request to get a account config data
    const url = `${accountConfig.data.productSearchUrl}${STOCKS_SEARCH_PATH}?${params}`
    debug(`Making request to ${url} with params: \n${finalRequestOptions}`)
    fetch(url, finalRequestOptions)
      .then(res => res.json())
      .then((res) => {
        resolve(res.products)
      })
      .catch(reject)
  })
}