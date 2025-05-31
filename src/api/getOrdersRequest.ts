import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { AccountConfigType, AccountDataType, GetOrdersConfigType, GetOrdersResultType } from '../types'

// Import debug console log
import { debug } from '../utils'
import { GET_ORDERS_TYPES } from '../enums/DeGiroEnums'
import { processGetOrdersResultListObject } from '../utils/'

// tslint:disable-next-line: max-line-length
export function getOrdersRequest(accountData: AccountDataType, accountConfig: AccountConfigType, config: GetOrdersConfigType): Promise<GetOrdersResultType> {
  return new Promise((resolve, reject) => {
    // Create params to get orders by types
    const { active, lastTransactions } = config
    let params = ''
    if (active) params += `${GET_ORDERS_TYPES.ACTIVE}=0&`
    if (lastTransactions) params += `${GET_ORDERS_TYPES.TRANSACTIONS}=0&`

    const baseRequestOptions: RequestInit = {
      headers: {
        Referer: 'https://trader.degiro.nl/trader/',
      }
    };

    let finalRequestOptions = { ...baseRequestOptions };

    const proxyUrl = process.env.HTTP_PROXY;
    if (proxyUrl) {
      const agent = new HttpsProxyAgent(proxyUrl);
      finalRequestOptions = { ...finalRequestOptions, agent };
    }

    // Do the request to get a account config data
    const uri = `${accountConfig.data.tradingUrl}v5/update/${accountData.data.intAccount};jsessionid=${accountConfig.data.sessionId}?${params}`
    debug(`Making request to ${uri}`)
    fetch(uri, finalRequestOptions)
      .then(res => res.json())
      .then((res) => {
        const result: GetOrdersResultType = {
          orders: res.orders ? res.orders.value.map(processGetOrdersResultListObject) : [],
          lastTransactions: res.transactions ? res.transactions.value.map(processGetOrdersResultListObject) : [],
        }
        resolve(result)
      })
      .catch(reject)
  })
}