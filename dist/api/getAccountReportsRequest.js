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
exports.getAccountReportsRequest = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var https_proxy_agent_1 = require("https-proxy-agent");
// Import debug console log
var utils_1 = require("../utils");
// Import utils functions
var generateReportURIFromID_1 = require("../utils/generateReportURIFromID");
// Importamos constantes
var enums_1 = require("../enums");
var GET_ACCOUNT_REPORTS_PATH = enums_1.DEGIRO_API_PATHS.GET_ACCOUNT_REPORTS_PATH;
function getAccountReportsRequest(accountData, accountConfig) {
    return new Promise(function (resolve, reject) {
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
        var uri = "".concat(accountConfig.data.paUrl).concat(GET_ACCOUNT_REPORTS_PATH, "?intAccount=").concat(accountData.data.intAccount, "&sessionId=").concat(accountConfig.data.sessionId);
        (0, utils_1.debug)("Making request to ".concat(uri));
        (0, node_fetch_1.default)(uri, finalRequestOptions)
            .then(function (res) { return res.json(); })
            .then(function (res) {
            (0, utils_1.debug)('Response:\n', JSON.stringify(res, null, 2));
            var data = res.data;
            // Añadimos la URL de descarga del archivo para que sea más facil en cliente
            data = data.map(function (report) { return (__assign(__assign({}, report), { uri: (0, generateReportURIFromID_1.generateReportURIFromID)(report.id, accountData, accountConfig) })); });
            resolve(data);
        })
            .catch(reject);
    });
}
exports.getAccountReportsRequest = getAccountReportsRequest;
//# sourceMappingURL=getAccountReportsRequest.js.map