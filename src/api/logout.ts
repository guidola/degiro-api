import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { AccountDataType, AccountConfigType } from '../types'

// Import enums
import { DEGIRO_API_PATHS } from '../enums'
const { BASE_API_URL, LOGOUT_URL_PATH } = DEGIRO_API_PATHS

// Import debug console log
import { debug } from '../utils'

export function logoutRequest(accountData: AccountDataType, accountConfig: AccountConfigType): Promise<void> {
  return new Promise((resolve, reject) => {

    const baseRequestOptions: RequestInit = {}; // Add any common headers if needed, like in other files
    let finalRequestOptions = { ...baseRequestOptions };

    const proxyUrl = process.env.HTTP_PROXY;
    if (proxyUrl) {
      const agent = new HttpsProxyAgent(proxyUrl);
      finalRequestOptions = { ...finalRequestOptions, agent };
    }

    // Do the request to get a session
    const url = `${BASE_API_URL}${LOGOUT_URL_PATH};jsessionid=${accountConfig.data.sessionId}?intAccount=${accountData.data.intAccount}&sessionId=${accountConfig.data.sessionId}`
    debug(`Making request to ${url}`)
    fetch(url, finalRequestOptions)
      .then((res) => {
        if (res.status === 200) resolve()
        else reject(res.statusText || res.body)
      })
      .catch(reject)
  })
}