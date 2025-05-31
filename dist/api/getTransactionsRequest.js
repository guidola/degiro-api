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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsRequest = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var https_proxy_agent_1 = require("https-proxy-agent");
var enums_1 = require("../enums");
var utils_1 = require("../utils");
var GET_TRANSACTIONS_PATH = enums_1.DEGIRO_API_PATHS.GET_TRANSACTIONS_PATH;
function getTransactionsRequest(accountData, accountConfig, config) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        // Create params to get orders by types
        var params = '';
        params += "fromDate=".concat(encodeURIComponent(config.fromDate), "&");
        params += "toDate=".concat(encodeURIComponent(config.toDate), "&");
        params += "groupTransactionsByOrder"; // Note: This was likely meant to be part of the params string construction
        params += "&intAccount=".concat(accountData.data.intAccount, "&"); // Assuming '&' was intended before intAccount
        params += "sessionId=".concat(accountConfig.data.sessionId);
        var baseRequestOptions = {
            headers: {
                Cookie: "JSESSIONID=".concat(accountConfig.data.sessionId, ";"),
                Referer: 'https://trader.degiro.nl/trader/', // Standard Referer header
            },
        };
        var finalRequestOptions = __assign({}, baseRequestOptions);
        var proxyUrl = process.env.HTTP_PROXY;
        if (proxyUrl) {
            var agent = new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
            finalRequestOptions = __assign(__assign({}, finalRequestOptions), { agent: agent });
        }
        // The requestOptions above are standard and do not include any settings
        // that would explicitly bypass environment/system-configured proxies.
        // Fetch API by default respects proxy settings (e.g., HTTP_PROXY/HTTPS_PROXY env vars in Node.js,
        // or browser settings).
        var uri = "".concat(accountConfig.data.reportingUrl).concat(GET_TRANSACTIONS_PATH, "?").concat(params);
        (0, utils_1.debug)("Making request to ".concat(uri));
        (0, node_fetch_1.default)(uri, finalRequestOptions)
            .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
            var responseBody, textError_1, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!response.ok) return [3 /*break*/, 5];
                        responseBody = '';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, response.text()];
                    case 2:
                        responseBody = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        textError_1 = _a.sent();
                        responseBody = 'Could not read error response body.';
                        return [3 /*break*/, 4];
                    case 4:
                        error = new Error("API request to ".concat(uri, " failed with status ").concat(response.status, " (").concat(response.statusText, "). Response: ").concat(responseBody));
                        // Optionally, attach status or other info to the error object
                        // (error as any).status = response.status;
                        throw error;
                    case 5: 
                    // If response is OK, parse it as JSON
                    return [2 /*return*/, response.json()];
                }
            });
        }); })
            .then(function (parsedJsonResponse) {
            (0, utils_1.debug)('Response JSON:\n', JSON.stringify(parsedJsonResponse, null, 2));
            // Expecting the response to be an object with a 'data' property containing an array of transactions.
            if (parsedJsonResponse && typeof parsedJsonResponse === 'object' && parsedJsonResponse.hasOwnProperty('data')) {
                if (Array.isArray(parsedJsonResponse.data)) {
                    resolve(parsedJsonResponse.data);
                }
                else if (parsedJsonResponse.data === null) {
                    // If 'data' is explicitly null (e.g., no transactions),
                    // resolve with an empty array to match Promise<TransactionType[]> signature.
                    resolve([]);
                }
                else {
                    // 'data' property exists but is not an array or null.
                    reject(new Error("Invalid API response structure: 'data' field is present but not an array or null. Received type: ".concat(typeof parsedJsonResponse.data)));
                }
            }
            else {
                // The response JSON is not an object or does not have the 'data' property.
                // This could happen if the API changes or if a proxy returns a custom error JSON.
                reject(new Error('Invalid API response structure: "data" field missing or response is not a JSON object.'));
            }
        })
            .catch(function (error) {
            // Log and reject with the error from any stage of the fetch promise chain.
            (0, utils_1.debug)("Error during getTransactionsRequest for ".concat(uri, ":"), error.message);
            reject(error);
        });
    });
}
exports.getTransactionsRequest = getTransactionsRequest;
//# sourceMappingURL=getTransactionsRequest.js.map