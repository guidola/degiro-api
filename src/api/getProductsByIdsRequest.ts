import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { AccountConfigType, AccountDataType, ProductDetailsType } from '../types'

// Import debug console log
import { debug } from '../utils'

// tslint:disable-next-line: max-line-length
export function getProductsByIdsRequest(ids: string[], accountData: AccountDataType, accountConfig: AccountConfigType): Promise<ProductDetailsType[]> {
  return new Promise((resolve, reject) => {

    const baseRequestOptions: RequestInit = {
      method: 'POST',
      body: JSON.stringify(ids.map(id => id.toString())),
      headers: {
        'Content-Type': 'application/json',
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

    fetch(`${accountConfig.data.productSearchUrl}v5/products/info?intAccount=${accountData.data.intAccount}&sessionId=${accountConfig.data.sessionId}`, finalRequestOptions)
      .then(res => res.json())
      .then(res => {
        // The response has a top-level 'data' object which contains product IDs as keys.
        // We need to extract the values (product details) from this object.
        if (res && res.data && typeof res.data === 'object') {
          const productDetailsArray: ProductDetailsType[] = Object.values(res.data);
          resolve(productDetailsArray);
        } else {
          // Handle cases where the response structure is not as expected
          debug('Unexpected response structure from getProductsByIdsRequest:', res);
          resolve([]); // Resolve with an empty array or reject, based on desired error handling
        }
      })
      .catch(reject)
  })
}