import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { OrderType, AccountDataType, AccountConfigType, CreateOrderResultType } from '../types'

// Import debug console log
import { debug } from '../utils'

export function executeOrderRequest(order: OrderType, executeId: String, accountData: AccountDataType, accountConfig: AccountConfigType): Promise<String> {
  return new Promise((resolve, reject) => {

    const baseRequestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Referer: 'https://trader.degiro.nl/trader/',
      },
      body: JSON.stringify(order),
    };

    let finalRequestOptions = { ...baseRequestOptions };

    const proxyUrl = process.env.HTTP_PROXY;
    if (proxyUrl) {
      const agent = new HttpsProxyAgent(proxyUrl);
      finalRequestOptions = { ...finalRequestOptions, agent };
    }

    // tslint:disable-next-line: max-line-length
    const uri = `https://trader.degiro.nl/trading/secure/v5/order/${executeId};jsessionid=${accountConfig.data.sessionId}?intAccount=${accountData.data.intAccount}&sessionId=${accountConfig.data.sessionId}`
    debug(uri, finalRequestOptions)
    fetch(uri, finalRequestOptions)
      .then(res => res.json())
      .then((res) => {
        if (res.errors) return reject(res.errors)
        resolve(res.data.orderId)
      })
      .catch(reject)

  })
}