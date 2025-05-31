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
exports.createOrderRequest = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var https_proxy_agent_1 = require("https-proxy-agent");
// Import Consts
var enums_1 = require("../enums");
var CREATE_ORDER_PATH = enums_1.DEGIRO_API_PATHS.CREATE_ORDER_PATH;
// Import debug console log
var utils_1 = require("../utils");
function createOrderRequest(order, accountData, accountConfig) {
    return new Promise(function (resolve, reject) {
        var baseRequestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                Referer: 'https://trader.degiro.nl/trader/',
            },
            body: JSON.stringify(order),
        };
        var finalRequestOptions = __assign({}, baseRequestOptions);
        var proxyUrl = process.env.HTTP_PROXY;
        if (proxyUrl) {
            var agent = new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
            finalRequestOptions = __assign(__assign({}, finalRequestOptions), { agent: agent });
        }
        var uri = "".concat(accountConfig.data.tradingUrl).concat(CREATE_ORDER_PATH, ";jsessionid=").concat(accountConfig.data.sessionId, "?intAccount=").concat(accountData.data.intAccount, "&sessionId=").concat(accountConfig.data.sessionId);
        (0, utils_1.debug)(uri, finalRequestOptions);
        (0, node_fetch_1.default)(uri, finalRequestOptions)
            .then(function (res) { return res.json(); })
            .then(function (res) {
            if (res.errors)
                return reject(res.errors);
            resolve(res.data);
        })
            .catch(reject);
    });
}
exports.createOrderRequest = createOrderRequest;
//# sourceMappingURL=createOrderRequest.js.map