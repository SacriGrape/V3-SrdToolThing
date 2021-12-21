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
exports.Ct0Block = void 0;
var block_1 = require("./block");
var CustomBuffer_1 = require("../Utils/CustomBuffer");
var Ct0Block = /** @class */ (function (_super) {
    __extends(Ct0Block, _super);
    function Ct0Block() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ct0Block.prototype.Deserialize = function (data, srdiPath, srdvPath) {
        return;
    };
    Ct0Block.prototype.Serialize = function () {
        return new CustomBuffer_1.CustomBuffer(0);
    };
    Ct0Block.prototype.GetInfo = function () {
        return "Block Type: " + this.blockType + "\n";
    };
    return Ct0Block;
}(block_1.Block));
exports.Ct0Block = Ct0Block;
