import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { AccountConfigType, AccountDataType, i18nMessagesType, GetNewsOptionsType, NewsType } from '../types'

// Import debug console log
import { debug } from '../utils'

// Import paths
import { DEGIRO_API_PATHS } from '../enums'
const { GET_LATESTS_NEWS_PATH, GET_TOP_NEWS_PATH } = DEGIRO_API_PATHS

export function getNewsRequest(options: GetNewsOptionsType, accountData: AccountDataType, accountConfig: AccountConfigType): Promise<NewsType> {
  return new Promise(async (resolve, reject) => {

    // Generate params
    const { latest, top, latestOffset = 0, latestLimit = 20, languages = 'es' } = options
    let params = ''
    params += `offset=${latestOffset}&`
    params += `limit=${latestLimit}&`
    params += `languages=${languages}&`
    params += `intAccount=${accountData.data.intAccount}&`
    params += `sessionId=${accountConfig.data.sessionId}`

    // Generate Request options
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

    // Generate de request URIs
    const latestNewsURI = `${accountConfig.data.companiesServiceUrl}${GET_LATESTS_NEWS_PATH}?${params}`
    const topNewsURI = `${accountConfig.data.companiesServiceUrl}${GET_TOP_NEWS_PATH}?${params}`

    // Create de default value
    const result: NewsType = {
      latest: {
        items: [],
      },
      top: {
        items: [],
      },
    }

    // Fetch the requested news
    try {

      // Check if latest requested
      if (latest) {
        const latestFetch = await fetch(latestNewsURI, finalRequestOptions)
        const { data } = await latestFetch.json()
        result.latest = data
      }

      // Check if top requested
      if (top) {
        const latestFetch = await fetch(topNewsURI, finalRequestOptions)
        const { data } = await latestFetch.json()
        result.top = data
      }
    } catch (error) {
      return reject(error)
    }

    // Return te result
    resolve(result)
  })
}