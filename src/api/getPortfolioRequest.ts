import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
// Import types
import { AccountConfigType, AccountDataType, GetPorfolioConfigType } from '../types'

// Import debug console log
import { debug, processPortfolio } from '../utils'

// tslint:disable-next-line: max-line-length
export function getPortfolioRequest(accountData: AccountDataType, accountConfig: AccountConfigType, config: GetPorfolioConfigType): Promise<any[]> {
  return new Promise((resolve, reject) => {
    // Create params to reach portfolio
    const params = '&portfolio=0'

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

    // Do the request to get a account config data
    debug(`Making request to ${accountConfig.data.tradingUrl}v5/update/${accountData.data.intAccount};jsessionid=${accountConfig.data.sessionId}?${params}}`)
    fetch(`${accountConfig.data.tradingUrl}v5/update/${accountData.data.intAccount};jsessionid=${accountConfig.data.sessionId}?${params}`, finalRequestOptions)
      .then(res => res.json())
      .then((res) => {
        const portfolio: any[] = res.portfolio.value
        const positions = processPortfolio(portfolio, config)
        resolve(positions)
      })
      .catch(reject)
  })
}