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
exports.getAccountStateRequest = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var https_proxy_agent_1 = require("https-proxy-agent");
// Import debug console log
var utils_1 = require("../utils");
var DeGiroEnums_1 = require("../enums/DeGiroEnums");
var GET_ACCOUNT_STATE_PATH = DeGiroEnums_1.DEGIRO_API_PATHS.GET_ACCOUNT_STATE_PATH;
// tslint:disable-next-line: max-line-length
function getAccountStateRequest(accountData, accountConfig, config) {
    return new Promise(function (resolve, reject) {
        // Create params to get orders by types
        var from = config.from, to = config.to;
        var params = '';
        params += "fromDate=".concat(encodeURIComponent(from), "&");
        params += "toDate=".concat(encodeURIComponent(to), "&");
        params += "intAccount=".concat(accountData.data.intAccount, "&");
        params += "sessionId=".concat(accountConfig.data.sessionId);
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
        var uri = "".concat(accountConfig.data.reportingUrl).concat(GET_ACCOUNT_STATE_PATH, "?").concat(params);
        (0, utils_1.debug)("Making request to ".concat(uri));
        (0, node_fetch_1.default)(uri, finalRequestOptions)
            .then(function (res) { return res.json(); })
            .then(function (res) {
            if (!res.data || !res.data.cashMovements || !Array.isArray(res.data.cashMovements))
                return reject('DeGiro response does not match with know scheme');
            resolve(res.data.cashMovements);
        })
            .catch(reject);
    });
}
exports.getAccountStateRequest = getAccountStateRequest;
//# sourceMappingURL=getAccountStateRequest.js.map