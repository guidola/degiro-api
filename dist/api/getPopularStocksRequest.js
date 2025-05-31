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
exports.getPopularStocksRequest = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var https_proxy_agent_1 = require("https-proxy-agent");
// Import debug console log
var utils_1 = require("../utils");
// Importamos constantes
var enums_1 = require("../enums");
var STOCKS_SEARCH_PATH = enums_1.DEGIRO_API_PATHS.STOCKS_SEARCH_PATH;
// tslint:disable-next-line: max-line-length
function getPopularStocksRequest(accountData, accountConfig, config) {
    return new Promise(function (resolve, reject) {
        // Create fetch request options
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
        // Create params to reach popular stocks
        var _a = config.popularOnly, popularOnly = _a === void 0 ? true : _a, _b = config.requireTotal, requireTotal = _b === void 0 ? false : _b, _c = config.limit, limit = _c === void 0 ? 9 : _c, _d = config.offset, offset = _d === void 0 ? 0 : _d;
        var params = '';
        params += "popularOnly=".concat(popularOnly, "&");
        params += "requireTotal=".concat(requireTotal, "&");
        params += "offset=".concat(offset, "&");
        params += "limit=".concat(limit, "&");
        params += "intAccount=".concat(accountData.data.intAccount, "&");
        params += "sessionId=".concat(accountConfig.data.sessionId);
        // Do the request to get a account config data
        var url = "".concat(accountConfig.data.productSearchUrl).concat(STOCKS_SEARCH_PATH, "?").concat(params);
        (0, utils_1.debug)("Making request to ".concat(url, " with params: \n").concat(finalRequestOptions));
        (0, node_fetch_1.default)(url, finalRequestOptions)
            .then(function (res) { return res.json(); })
            .then(function (res) {
            resolve(res.products);
        })
            .catch(reject);
    });
}
exports.getPopularStocksRequest = getPopularStocksRequest;
//# sourceMappingURL=getPopularStocksRequest.js.map