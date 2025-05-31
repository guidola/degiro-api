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
exports.loginRequest = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var https_proxy_agent_1 = require("https-proxy-agent");
// Import enums
var enums_1 = require("../enums");
var BASE_API_URL = enums_1.DEGIRO_API_PATHS.BASE_API_URL, LOGIN_URL_PATH = enums_1.DEGIRO_API_PATHS.LOGIN_URL_PATH;
// Import debug console log
var utils_1 = require("../utils");
function loginRequest(params) {
    return new Promise(function (resolve, reject) {
        // Make the payload
        var payload = {
            isPassCodeReset: false,
            isRedirectToMobile: false,
            password: params.pwd,
            username: params.username.toLowerCase().trim(),
            oneTimePassword: params.oneTimePassword,
            queryParams: {
                reason: 'session_expired',
            },
        };
        var baseRequestOptions = {
            method: 'POST',
            body: JSON.stringify(payload),
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
        // Do the request to get a session
        (0, utils_1.debug)("Making request to ".concat(BASE_API_URL).concat(LOGIN_URL_PATH, " with options:"));
        (0, utils_1.debug)(JSON.stringify(finalRequestOptions, null, 2));
        (0, node_fetch_1.default)("".concat(BASE_API_URL).concat(LOGIN_URL_PATH), finalRequestOptions)
            .then(function (res) {
            if (!payload.oneTimePassword)
                return res;
            (0, utils_1.debug)('Sending OTP');
            return (0, node_fetch_1.default)("".concat(BASE_API_URL).concat(LOGIN_URL_PATH, "/totp"), finalRequestOptions);
        })
            .then(function (res) { return res.json(); })
            .then(function (res) {
            if (!res.sessionId)
                return reject(res.statusText);
            (0, utils_1.debug)('Login response: ', JSON.stringify(res, null, 2));
            resolve(res);
        })
            .catch(reject);
    });
}
exports.loginRequest = loginRequest;
//# sourceMappingURL=login.js.map