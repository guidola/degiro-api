"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processGetCashFundsResultListObject = void 0;
var processGetCashFundsResultListObject = function (objectData) {
    var _a;
    var arrayDataToExtract = objectData.value;
    var result = {};
    for (var i = 0; i < arrayDataToExtract.length; i++) {
        var data = arrayDataToExtract[i];
        if (data.isAdded) {
            Object.assign(result, (_a = {},
                _a[data.name] = data.value,
                _a));
        }
    }
    return result;
};
exports.processGetCashFundsResultListObject = processGetCashFundsResultListObject;
//# sourceMappingURL=processGetCashFundsResultListObject.js.map