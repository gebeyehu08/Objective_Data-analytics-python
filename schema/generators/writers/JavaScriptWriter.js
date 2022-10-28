"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptWriter = void 0;
const core_1 = require("@yellicode/core");
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
        const objectKeys = Object.keys(object);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSmF2YVNjcmlwdFdyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkphdmFTY3JpcHRXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsMENBQTRFO0FBRTVFLE1BQWEsZ0JBQWlCLFNBQVEsaUJBQVU7SUFHOUMsWUFBWSxNQUFrQixFQUFFLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFO1FBQzNFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUhoQiw0QkFBdUIsR0FBRyxHQUFHLENBQUM7UUFJNUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxjQUFjLEVBQUU7WUFDbEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztTQUN2RjtJQUNILENBQUM7SUFFTSxlQUFlLENBQUMsS0FBZTtRQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNyQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQyxJQUFJLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtnQkFDakYsd0JBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDMUc7O2dCQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRU0sZUFBZSxDQUFDLE1BQWM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFdEIsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ2hDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDekIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2FBQzFCO2lCQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFNLEtBQXdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM3RDtpQkFBTTtnQkFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ25CO1lBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEIsQ0FBQztDQUNGO0FBL0NELDRDQStDQyJ9