"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoriesWriter = void 0;
const typescript_1 = require("@yellicode/typescript");
const common_1 = require("../templates/common");
class FactoriesWriter extends typescript_1.TypeScriptWriter {
    constructor(writer) {
        super(writer);
        this.indentString = '  ';
        common_1.writeCopyright(this);
    }
}
exports.FactoriesWriter = FactoriesWriter;
__exportStar(require("@yellicode/typescript"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmFjdG9yaWVzV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRmFjdG9yaWVzV3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFLQSxzREFBeUQ7QUFDekQsZ0RBQXFEO0FBRXJELE1BQWEsZUFBZ0IsU0FBUSw2QkFBZ0I7SUFDbkQsWUFBWSxNQUFrQjtRQUM1QixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6Qix1QkFBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7Q0FDRjtBQU5ELDBDQU1DO0FBRUQsd0RBQXNDIn0=