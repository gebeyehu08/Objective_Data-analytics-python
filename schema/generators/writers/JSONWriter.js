"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONWriter = void 0;
const core_1 = require("@yellicode/core");
class JSONWriter extends core_1.CodeWriter {
    constructor(writer) {
        super(writer);
        this.indentString = '    ';
    }
    writeJSON(content) {
        this.writeLine(JSON.stringify(content, null, 4));
    }
}
exports.JSONWriter = JSONWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSlNPTldyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkpTT05Xcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsMENBQXlEO0FBRXpELE1BQWEsVUFBVyxTQUFRLGlCQUFVO0lBQ3hDLFlBQVksTUFBa0I7UUFDNUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUVNLFNBQVMsQ0FBQyxPQUFZO1FBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbEQsQ0FBQztDQUNGO0FBVEQsZ0NBU0MifQ==