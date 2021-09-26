"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const EscapeQueryObject = (obj) => Object.fromEntries(Object.entries(obj).map(e => [e[0], mysql_1.default.escape(e[1])]));
exports.default = EscapeQueryObject;
//# sourceMappingURL=EscapeQueryObject.js.map