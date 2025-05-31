import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { LoginRequestParamsType, LoginRequestBodyType, LoginResponseType } from '../types'

// Import enums
import { DEGIRO_API_PATHS } from '../enums'
const { BASE_API_URL, LOGIN_URL_PATH } = DEGIRO_API_PATHS

// Import debug console log
import { debug } from '../utils'

export function loginRequest(params: LoginRequestParamsType): Promise<LoginResponseType> {
  return new Promise((resolve, reject) => {

    // Make the payload
    const payload: LoginRequestBodyType = {
      isPassCodeReset: false,
      isRedirectToMobile: false,
      password: params.pwd,
      username: params.username.toLowerCase().trim(),
      oneTimePassword: params.oneTimePassword,
      queryParams: {
        reason: 'session_expired',
      },
    }

    const baseRequestOptions: RequestInit = {
      method: 'POST',
      body: JSON.stringify(payload),
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

    // Do the request to get a session
    debug(`Making request to ${BASE_API_URL}${LOGIN_URL_PATH} with options:`)
    debug(JSON.stringify(finalRequestOptions, null, 2))
    fetch(`${BASE_API_URL}${LOGIN_URL_PATH}`, finalRequestOptions)
      .then((res) => {
        if (!payload.oneTimePassword) return res
        debug('Sending OTP')
        return fetch(`${BASE_API_URL}${LOGIN_URL_PATH}/totp`, finalRequestOptions);
      })
      .then(res => res.json())
      .then((res) => {
        if (!res.sessionId) return reject(res.statusText)
        debug('Login response: ', JSON.stringify(res, null, 2))
        resolve(res)
      })
      .catch(reject);
  })
}
