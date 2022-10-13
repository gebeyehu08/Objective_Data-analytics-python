"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptWriter = void 0;
const core_1 = require("@yellicode/core");
const common_1 = require("../templates/common");
class JavaScriptWriter extends core_1.CodeWriter {
    constructor(writer, { writeCopyright } = { writeCopyright: true }) {
        super(writer);
        this.documentationLineLength = 120;
        this.indentString = '  ';
        if (writeCopyright) {
            writer.writeLine(`/*\n * Copyright ${new Date().getFullYear()} Objectiv B.V.\n */\n`);
        }
    }
    writeJsDocLines(lines) {
        this.writeLine('/**');
        lines.forEach((line) => {
            const lineLength = line ? line.length : 0;
            if (this.documentationLineLength > 0 && lineLength > this.documentationLineLength) {
                core_1.CodeWriterUtility.wordWrap(line, this.documentationLineLength).forEach((s) => this.writeLine(` * ${s}`));
            }
            else
                this.writeLine(` * ${line.trim()}`);
        });
        this.writeLine(' */');
    }
    writeJSONObject(object) {
        this.writeLine('{');
        this.increaseIndent();
        const objectKeys = common_1.getObjectKeys(object);
        objectKeys.forEach((key, index) => {
            const value = object[key];
            this.writeIndent();
            this.write(`"${key}": `);
            if (typeof value === 'string') {
                this.write(`"${value}"`);
            }
            else if (Array.isArray(value)) {
                this.write(`["${value.join('", "')}"]`);
            }
            else {
                this.write(value);
            }
            this.write(index < objectKeys.length - 1 ? ',' : '');
            this.writeEndOfLine();
        });
        this.decreaseIndent();
        this.writeLine('}');
    }
}
exports.JavaScriptWriter = JavaScriptWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSmF2YVNjcmlwdFdyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkphdmFTY3JpcHRXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsMENBQTRFO0FBQzVFLGdEQUFvRDtBQUVwRCxNQUFhLGdCQUFpQixTQUFRLGlCQUFVO0lBRzlDLFlBQVksTUFBa0IsRUFBRSxFQUFFLGNBQWMsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRTtRQUMzRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFIaEIsNEJBQXVCLEdBQUcsR0FBRyxDQUFDO1FBSTVCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksY0FBYyxFQUFFO1lBQ2xCLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLHVCQUF1QixDQUFDLENBQUM7U0FDdkY7SUFDSCxDQUFDO0lBRU0sZUFBZSxDQUFDLEtBQWU7UUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDckIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUMsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ2pGLHdCQUFpQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzFHOztnQkFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVNLGVBQWUsQ0FBQyxNQUFjO1FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXRCLE1BQU0sVUFBVSxHQUFHLHNCQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNoQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQ3pCLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO2dCQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQzthQUMxQjtpQkFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBTSxLQUF3QixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDN0Q7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNuQjtZQUNELElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7Q0FDRjtBQS9DRCw0Q0ErQ0MifQ==