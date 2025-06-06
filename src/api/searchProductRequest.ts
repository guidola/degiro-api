import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { SearchProductOptionsType, AccountConfigType, AccountDataType, SearchProductResultType } from '../types'

// Import debug console log
import { debug } from '../utils'

const createURLQuery = (options: SearchProductOptionsType): string => {
  // Destructure the options parameter
  const { text, type = undefined, sortColumn = undefined, sortType = undefined, limit = 10, offset = 0 } = options

  // Create the query
  let res = `&searchText=${encodeURIComponent(text)}`

  if (type) res += `&type=${encodeURIComponent(type)}`
  if (sortColumn) res += `&sortColumn=${encodeURIComponent(sortColumn)}`
  if (sortType) res += `&sortType=${encodeURIComponent(sortType)}`
  if (limit) res += `&limit=${encodeURIComponent(limit)}`
  if (offset) res += `&offset=${encodeURIComponent(offset)}`

  return res
}

export function searchProductRequest(options: SearchProductOptionsType, accountData: AccountDataType, accountConfig: AccountConfigType): Promise<SearchProductResultType[]> {
  return new Promise((resolve, reject) => {
    // Preparae de request
    const params = createURLQuery(options)

    const baseRequestOptions: RequestInit = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      }
    };
    let finalRequestOptions = { ...baseRequestOptions };

    const proxyUrl = process.env.HTTP_PROXY;
    if (proxyUrl) {
      const agent = new HttpsProxyAgent(proxyUrl);
      finalRequestOptions = { ...finalRequestOptions, agent };
    }

    // Do de request
    debug(`Making a search request to url: ${accountConfig.data.productSearchUrl}v5/products/lookup?intAccount=${accountData.data.intAccount}&sessionId=${accountData.data.id}&${params}}`)
    fetch(`${accountConfig.data.productSearchUrl}v5/products/lookup?intAccount=${accountData.data.intAccount}&sessionId=${accountConfig.data.sessionId}&${params}`, finalRequestOptions)
      .then(res => res.json())
      .then(({ products }) => resolve(products || []))
      .catch(reject)
  })
}
