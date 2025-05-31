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
exports.getAccountConfigRequest = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var https_proxy_agent_1 = require("https-proxy-agent");
// Import enums
var enums_1 = require("../enums");
var BASE_API_URL = enums_1.DEGIRO_API_PATHS.BASE_API_URL, GET_ACCOUNT_CONFIG_PATH = enums_1.DEGIRO_API_PATHS.GET_ACCOUNT_CONFIG_PATH;
// Import debug console log
var utils_1 = require("../utils");
function getAccountConfigRequest(sessionId) {
    return new Promise(function (resolve, reject) {
        var baseRequestOptions = {
            headers: {
                Cookie: "JSESSIONID=".concat(sessionId, ";"),
                Referer: 'https://trader.degiro.nl/trader/',
            },
        };
        var finalRequestOptions = __assign({}, baseRequestOptions);
        var proxyUrl = process.env.HTTP_PROXY;
        if (proxyUrl) {
            var agent = new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
            finalRequestOptions = __assign(__assign({}, finalRequestOptions), { agent: agent });
        }
        // Do the request to get a account config data
        (0, utils_1.debug)("Making request to ".concat(BASE_API_URL).concat(GET_ACCOUNT_CONFIG_PATH, " with JSESSIONID: ").concat(sessionId));
        (0, node_fetch_1.default)(BASE_API_URL + GET_ACCOUNT_CONFIG_PATH, finalRequestOptions)
            .then(function (res) {
            if (!res.ok) {
                reject(res.statusText);
            }
            return res.json();
        })
            .then(function (res) {
            (0, utils_1.debug)('Response:\n', JSON.stringify(res, null, 2));
            resolve(res);
        })
            .catch(reject);
    });
}
exports.getAccountConfigRequest = getAccountConfigRequest;
//# sourceMappingURL=getAccountConfig.js.map