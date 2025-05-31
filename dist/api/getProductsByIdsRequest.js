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
exports.getProductsByIdsRequest = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var https_proxy_agent_1 = require("https-proxy-agent");
// tslint:disable-next-line: max-line-length
function getProductsByIdsRequest(ids, accountData, accountConfig) {
    return new Promise(function (resolve, reject) {
        var baseRequestOptions = {
            method: 'POST',
            body: JSON.stringify(ids.map(function (id) { return id.toString(); })),
            headers: {
                'Content-Type': 'application/json',
                Referer: 'https://trader.degiro.nl/trader/',
            },
        };
        var finalRequestOptions = __assign({}, baseRequestOptions);
        var proxyUrl = process.env.HTTP_PROXY;
        if (proxyUrl) {
            var agent = new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
            finalRequestOptions = __assign(__assign({}, finalRequestOptions), { agent: agent });
        }
        (0, node_fetch_1.default)("".concat(accountConfig.data.productSearchUrl, "v5/products/info?intAccount=").concat(accountData.data.intAccount, "&sessionId=").concat(accountConfig.data.sessionId), finalRequestOptions)
            .then(function (res) { return res.json(); })
            .then(function (res) { return resolve(res.data); })
            .catch(reject);
    });
}
exports.getProductsByIdsRequest = getProductsByIdsRequest;
//# sourceMappingURL=getProductsByIdsRequest.js.map