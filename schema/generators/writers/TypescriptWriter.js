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
exports.TypeScriptWriter = void 0;
const typescript_1 = require("@yellicode/typescript");
class TypeScriptWriter extends typescript_1.TypeScriptWriter {
    constructor(writer) {
        super(writer);
        this.indentString = '  ';
        writer.writeLine(`/*\n * Copyright ${new Date().getFullYear()} Objectiv B.V.\n */\n`);
    }
    writeMultiLineImports(moduleName, x) {
        this.writeLine(`import {\n${this.indentString}${x.join(`,\n${this.indentString}`)}\n} from '${moduleName}';`);
    }
    writeES6ConstDeclaration(definition, kind = 'const') {
        if (definition.description) {
            this.writeJsDocLines(definition.description);
        }
        if (definition.export) {
            this.write(`export `);
        }
        if (definition.declare) {
            this.write('declare ');
        }
        this.write(`${kind} ${definition.name}`);
        if (definition.typeName) {
            this.write(`: ${definition.typeName}`);
        }
        return this;
    }
    writeES6FunctionBlock(func, contents) {
        if (func.description) {
            this.writeJsDocLines(func.description.split('\n'));
        }
        this.writeES6ConstDeclaration({
            name: func.name,
            typeName: null,
            export: func.export,
        });
        this.write(` = (`);
        this.writeProps({ propsName: 'props', parameters: func.parameters });
        this.write(`): ${func.returnTypeName} => `);
        contents && contents(this);
        return this;
    }
    writeProps({ propsName, parameters }) {
        this.writeLine(`${propsName}: {`);
        this.increaseIndent();
        parameters.forEach(parameter => {
            this.writeLine(`${parameter.name}${parameter.isOptional ? '?:' : ':'} ${parameter.typeName},`);
        });
        this.decreaseIndent();
        this.write(`}`);
    }
}
exports.TypeScriptWriter = TypeScriptWriter;
__exportStar(require("@yellicode/typescript"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZVNjcmlwdFdyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlR5cGVTY3JpcHRXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUtBLHNEQUE2SDtBQVE3SCxNQUFhLGdCQUFpQixTQUFRLDZCQUF3QjtJQUM1RCxZQUFZLE1BQWtCO1FBQzVCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLHVCQUF1QixDQUFDLENBQUM7SUFDeEYsQ0FBQztJQUVELHFCQUFxQixDQUFDLFVBQWtCLEVBQUUsQ0FBVztRQUNuRCxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLGFBQWEsVUFBVSxJQUFJLENBQUMsQ0FBQztJQUNoSCxDQUFDO0lBRU0sd0JBQXdCLENBQUMsVUFBOEIsRUFBRSxPQUF3QixPQUFPO1FBQzNGLElBQUksVUFBVSxDQUFDLFdBQVcsRUFBRTtZQUMxQixJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUM5QztRQUNELElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3pCO1FBQ0QsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDMUI7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDMUM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0scUJBQXFCLENBQUMsSUFBMkIsRUFBRSxRQUE2QztRQUNyRyxJQUFHLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsSUFBSSxDQUFDLHdCQUF3QixDQUFFO1lBQzdCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ3BCLENBQUMsQ0FBQztRQUdILElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBRXJFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsY0FBYyxNQUFNLENBQUMsQ0FBQztRQUU1QyxRQUFRLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTNCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLFVBQVUsQ0FBQyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQTJEO1FBQ2pHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV0QixVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFBO1FBQ2hHLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEIsQ0FBQztDQUNGO0FBOURELDRDQThEQztBQUVELHdEQUFzQyJ9