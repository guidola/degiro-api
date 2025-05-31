import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { DEGIRO_API_PATHS } from '../enums';
import { AccountConfigType, AccountDataType, GetTransactionsOptionsType, TransactionType } from '../types'
import { debug } from '../utils';

const { GET_TRANSACTIONS_PATH } = DEGIRO_API_PATHS;

export function getTransactionsRequest(accountData: AccountDataType, accountConfig: AccountConfigType, config: GetTransactionsOptionsType): Promise<TransactionType[]> {
  return new Promise((resolve, reject) => {
    // Create params to get orders by types
    let params = ''
    params += `fromDate=${encodeURIComponent(config.fromDate)}&`
    params += `toDate=${encodeURIComponent(config.toDate)}&`
    params += `groupTransactionsByOrder=${encodeURIComponent(config.groupTransactionsByOrder)}&` 
    params += `&intAccount=${accountData.data.intAccount}&` // Assuming '&' was intended before intAccount
    params += `sessionId=${accountConfig.data.sessionId}`

    const baseRequestOptions: RequestInit = {
      headers: {
        Cookie: `JSESSIONID=${accountConfig.data.sessionId};`,
        Referer: 'https://trader.degiro.nl/trader/', // Standard Referer header
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      },
    };

    let finalRequestOptions = { ...baseRequestOptions };

    const proxyUrl = process.env.HTTP_PROXY;
    if (proxyUrl) {
      const agent = new HttpsProxyAgent(proxyUrl);
      finalRequestOptions = { ...finalRequestOptions, agent };
    }

    // The requestOptions above are standard and do not include any settings
    // that would explicitly bypass environment/system-configured proxies.
    // Fetch API by default respects proxy settings (e.g., HTTP_PROXY/HTTPS_PROXY env vars in Node.js,
    // or browser settings).

    const uri = `${accountConfig.data.reportingUrl}${GET_TRANSACTIONS_PATH}?${params}`;
    debug(`Making request to ${uri}`);

    fetch(uri, finalRequestOptions)
      .then(async (response) => { // Use async to allow awaiting response.text()
        if (!response.ok) {
          // Attempt to read the response body for more detailed error information
          let responseBody = '';
          try {
            responseBody = await response.text();
          } catch (textError) {
            responseBody = 'Could not read error response body.';
          }
          // Throw an error that includes status, status text, and response body
          const error = new Error(
            `API request to ${uri} failed with status ${response.status} (${response.statusText}). Response: ${responseBody}`
          );
          // Optionally, attach status or other info to the error object
          // (error as any).status = response.status;
          throw error;
        }
        // If response is OK, parse it as JSON
        return response.json();
      })
      .then((parsedJsonResponse: any) => { // Process the parsed JSON response
        debug('Response JSON:\n', JSON.stringify(parsedJsonResponse, null, 2));

        // Expecting the response to be an object with a 'data' property containing an array of transactions.
        if (parsedJsonResponse && typeof parsedJsonResponse === 'object' && parsedJsonResponse.hasOwnProperty('data')) {
          if (Array.isArray(parsedJsonResponse.data)) {
            resolve(parsedJsonResponse.data as TransactionType[]);
          } else if (parsedJsonResponse.data === null) {
            // If 'data' is explicitly null (e.g., no transactions),
            // resolve with an empty array to match Promise<TransactionType[]> signature.
            resolve([]);
          } else {
            // 'data' property exists but is not an array or null.
            reject(new Error(`Invalid API response structure: 'data' field is present but not an array or null. Received type: ${typeof parsedJsonResponse.data}`));
          }
        } else {
          // The response JSON is not an object or does not have the 'data' property.
          // This could happen if the API changes or if a proxy returns a custom error JSON.
          reject(new Error('Invalid API response structure: "data" field missing or response is not a JSON object.'));
        }
      })
      .catch(error => {
        // Log and reject with the error from any stage of the fetch promise chain.
        debug(`Error during getTransactionsRequest for ${uri}:`, error.message);
        reject(error);
      });
  })
}