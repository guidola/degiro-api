import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { AccountConfigType, AccountDataType, AccountReportsType } from '../types'

// Import debug console log
import { debug } from '../utils'

// Import utils functions
import { generateReportURIFromID } from '../utils/generateReportURIFromID'

// Importamos constantes
import { DEGIRO_API_PATHS } from '../enums'
const { GET_ACCOUNT_REPORTS_PATH } = DEGIRO_API_PATHS

export function getAccountReportsRequest(accountData: AccountDataType, accountConfig: AccountConfigType): Promise<AccountReportsType> {
  return new Promise((resolve, reject) => {

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
    const uri = `${accountConfig.data.paUrl}${GET_ACCOUNT_REPORTS_PATH}?intAccount=${accountData.data.intAccount}&sessionId=${accountConfig.data.sessionId}`
    debug(`Making request to ${uri}`)
    fetch(uri, finalRequestOptions)
      .then(res => res.json())
      .then((res) => {
        debug('Response:\n', JSON.stringify(res, null, 2))
        let data: AccountReportsType = res.data

        // Añadimos la URL de descarga del archivo para que sea más facil en cliente
        data = data.map(report => ({
          ...report,
          uri: generateReportURIFromID(report.id, accountData, accountConfig),
        }))
        resolve(data)
      })
      .catch(reject)

  })
}