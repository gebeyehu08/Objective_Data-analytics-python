"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONWriter = void 0;
const core_1 = require("@yellicode/core");
class JSONWriter extends core_1.CodeWriter {
    constructor(writer) {
        super(writer);
        this.indentString = '    ';
    }
    writeArray(array) {
        this.writeLine(array.name ? `"${array.name}": [` : ']');
        this.increaseIndent();
        array.items.forEach((item, index) => {
            this.writeIndent();
            this.write(`"${item}"`);
            this.writeEndOfLine(index < array.items.length - 1 ? ',' : '');
        });
        this.decreaseIndent();
        this.writeIndent();
        this.write(`]`);
        array.closeWithComma && this.write(`,`);
        this.writeEndOfLine(``);
    }
    writeObject(object) {
        this.writeLine(object.name ? `"${object.name}": {` : '{');
        this.increaseIndent();
        const propertyKeys = Object.keys(object.properties);
        propertyKeys.forEach((propertyKey, index) => {
            const propertyValue = object.properties[propertyKey];
            if (typeof propertyValue === 'string') {
                this.writeIndent();
                this.write(`"${propertyKey}": "${sanitizeString(propertyValue)}"`);
                this.writeEndOfLine(index < propertyKeys.length - 1 ? ',' : '');
            }
            else if (typeof propertyValue === 'number' || typeof propertyValue === 'boolean') {
                this.writeIndent();
                this.write(`"${propertyKey}": ${propertyValue}`);
                this.writeEndOfLine(index < propertyKeys.length - 1 ? ',' : '');
            }
            else if (Array.isArray(propertyValue)) {
                this.writeArray({
                    name: 'required',
                    items: propertyValue,
                    closeWithComma: index < propertyKeys.length - 1,
                });
            }
            else {
                this.writeObject({
                    name: propertyKey,
                    properties: propertyValue,
                    closeWithComma: index < propertyKeys.length - 1,
                });
            }
        });
        this.decreaseIndent();
        this.writeIndent();
        this.write(`}`);
        object.closeWithComma && this.write(`,`);
        this.writeEndOfLine(``);
    }
}
exports.JSONWriter = JSONWriter;
const sanitizeString = (string) => {
    return string.replace(/\n/g, '');
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSlNPTldyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkpTT05Xcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsMENBQXlEO0FBY3pELE1BQWEsVUFBVyxTQUFRLGlCQUFVO0lBQ3hDLFlBQVksTUFBa0I7UUFDNUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUVNLFVBQVUsQ0FBQyxLQUFzQjtRQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksTUFBTSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDbEMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNoRSxDQUFDLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNmLEtBQUssQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ3pC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