"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CfhBlock = void 0;
var block_1 = require("./block");
var CustomBuffer_1 = require("../Utils/CustomBuffer");
var CfhBlock = /** @class */ (function (_super) {
    __extends(CfhBlock, _super);
    function CfhBlock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CfhBlock.prototype.Deserialize = function (data, srdiPath, srdvPath) {
        return;
    };
    CfhBlock.prototype.Serialize = function () {
        return new CustomBuffer_1.CustomBuffer(0);
    };
    CfhBlock.prototype.GetInfo = function () {
        return "Block Type: " + this.blockType + "\n";
    };
    return CfhBlock;
}(block_1.Block));
exports.CfhBlock = CfhBlock;
