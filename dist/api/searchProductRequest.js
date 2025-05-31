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
exports.searchProductRequest = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var https_proxy_agent_1 = require("https-proxy-agent");
// Import debug console log
var utils_1 = require("../utils");
var createURLQuery = function (options) {
    // Destructure the options parameter
    var text = options.text, _a = options.type, type = _a === void 0 ? undefined : _a, _b = options.sortColumn, sortColumn = _b === void 0 ? undefined : _b, _c = options.sortType, sortType = _c === void 0 ? undefined : _c, _d = options.limit, limit = _d === void 0 ? 10 : _d, _e = options.offset, offset = _e === void 0 ? 0 : _e;
    // Create the query
    var res = "&searchText=".concat(encodeURIComponent(text));
    if (type)
        res += "&type=".concat(encodeURIComponent(type));
    if (sortColumn)
        res += "&sortColumn=".concat(encodeURIComponent(sortColumn));
    if (sortType)
        res += "&sortType=".concat(encodeURIComponent(sortType));
    if (limit)
        res += "&limit=".concat(encodeURIComponent(limit));
    if (offset)
        res += "&offset=".concat(encodeURIComponent(offset));
    return res;
};
function searchProductRequest(options, accountData, accountConfig) {
    return new Promise(function (resolve, reject) {
        // Preparae de request
        var params = createURLQuery(options);
        var baseRequestOptions = {}; // Add any common headers if needed
        var finalRequestOptions = __assign({}, baseRequestOptions);
        var proxyUrl = process.env.HTTP_PROXY;
        if (proxyUrl) {
            var agent = new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
            finalRequestOptions = __assign(__assign({}, finalRequestOptions), { agent: agent });
        }
        // Do de request
        (0, utils_1.debug)("Making a search request to url: ".concat(accountConfig.data.productSearchUrl, "v5/products/lookup?intAccount=").concat(accountData.data.intAccount, "&sessionId=").concat(accountData.data.id, "&").concat(params, "}"));
        (0, node_fetch_1.default)("".concat(accountConfig.data.productSearchUrl, "v5/products/lookup?intAccount=").concat(accountData.data.intAccount, "&sessionId=").concat(accountConfig.data.sessionId, "&").concat(params), finalRequestOptions)
            .then(function (res) { return res.json(); })
            .then(function (_a) {
            var products = _a.products;
            return resolve(products || []);
        })
            .catch(reject);
    });
}
exports.searchProductRequest = searchProductRequest;
//# sourceMappingURL=searchProductRequest.js.map