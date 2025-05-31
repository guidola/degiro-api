"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCashFundstRequest = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var https_proxy_agent_1 = require("https-proxy-agent");
// Import debug console log
var utils_1 = require("../utils");
var DeGiroEnums_1 = require("../enums/DeGiroEnums");
var GET_GENERIC_DATA_PATH = DeGiroEnums_1.DEGIRO_API_PATHS.GET_GENERIC_DATA_PATH;
// tslint:disable-next-line: max-line-length
function getCashFundstRequest(accountData, accountConfig) {
    return new Promise(function (resolve, reject) {
        var params = '';
        params += 'cashFunds=0&';
        params += 'limit=100';
        var baseRequestOptions = {
            headers: {
                Cookie: "JSESSIONID=".concat(accountConfig.data.sessionId, ";"),
                Referer: 'https://trader.degiro.nl/trader/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            },
        };
        var finalRequestOptions = __assign({}, baseRequestOptions);
        var proxyUrl = process.env.HTTP_PROXY;
        if (proxyUrl) {
            var agent = new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
            finalRequestOptions = __assign(__assign({}, finalRequestOptions), { agent: agent });
        }
        // Do the request to get a account config data
        var uri = "".concat(accountConfig.data.tradingUrl).concat(GET_GENERIC_DATA_PATH).concat(accountData.data.intAccount, ";jsessionid=").concat(accountConfig.data.sessionId, "?").concat(params);
        (0, utils_1.debug)("Making request to ".concat(uri));
        (0, node_fetch_1.default)(uri, finalRequestOptions)
            .then(function (res) { return res.json(); })
            .then(function (res) {
            if (!res.cashFunds || !res.cashFunds.value || !Array.isArray(res.cashFunds.value)) {
                return reject('Invalid response format');
            }
            var data = res.cashFunds.value;
            (0, utils_1.debug)('Response:\n', JSON.stringify(res, null, 2));
            resolve(data.map(utils_1.processGetCashFundsResultListObject));
        })
            .catch(reject);
    });
}
exports.getCashFundstRequest = getCashFundstRequest;
//# sourceMappingURL=getCashFundstRequest.js.map