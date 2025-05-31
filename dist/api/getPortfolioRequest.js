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
exports.getPortfolioRequest = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var https_proxy_agent_1 = require("https-proxy-agent");
// Import debug console log
var utils_1 = require("../utils");
// tslint:disable-next-line: max-line-length
function getPortfolioRequest(accountData, accountConfig, config) {
    return new Promise(function (resolve, reject) {
        // Create params to reach portfolio
        var params = '&portfolio=0';
        var baseRequestOptions = {}; // Add any common headers if needed
        var finalRequestOptions = __assign({}, baseRequestOptions);
        var proxyUrl = process.env.HTTP_PROXY;
        if (proxyUrl) {
            var agent = new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
            finalRequestOptions = __assign(__assign({}, finalRequestOptions), { agent: agent });
        }
        // Do the request to get a account config data
        (0, utils_1.debug)("Making request to ".concat(accountConfig.data.tradingUrl, "v5/update/").concat(accountData.data.intAccount, ";jsessionid=").concat(accountConfig.data.sessionId, "?").concat(params, "}"));
        (0, node_fetch_1.default)("".concat(accountConfig.data.tradingUrl, "v5/update/").concat(accountData.data.intAccount, ";jsessionid=").concat(accountConfig.data.sessionId, "?").concat(params), finalRequestOptions)
            .then(function (res) { return res.json(); })
            .then(function (res) {
            var portfolio = res.portfolio.value;
            var positions = (0, utils_1.processPortfolio)(portfolio, config);
            resolve(positions);
        })
            .catch(reject);
    });
}
exports.getPortfolioRequest = getPortfolioRequest;
//# sourceMappingURL=getPortfolioRequest.js.map