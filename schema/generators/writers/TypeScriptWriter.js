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
        const optionalParametersCount = parameters.filter(parameter => parameter.isOptional).length;
        this.writeLine(`${propsName}${optionalParametersCount === parameters.length ? '?' : ''}: {`);
        this.increaseIndent();
        parameters.forEach((parameter) => {
            this.writeLine(`${parameter.name}${parameter.isOptional ? '?:' : ':'} ${parameter.typeName},`);
        });
        this.decreaseIndent();
        this.write(`}`);
    }
    writeTypeDefinition(definition) {
        if (definition.description) {
            this.writeJsDocLines(definition.description);
        }
        if (definition.export) {
            this.write(`export `);
        }
        this.write(`type ${definition.name}`);
        if (definition.typeName === 'array') {
            this.write(` = Array<${definition.typeValue}>`);
        }
        else {
            this.write(` = ${definition.typeName}`);
        }
        this.writeLine(`;`);
        return this;
    }
}
exports.TypeScriptWriter = TypeScriptWriter;
__exportStar(require("@yellicode/typescript"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZVNjcmlwdFdyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlR5cGVTY3JpcHRXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUtBLHNEQUkrQjtBQWdCL0IsTUFBYSxnQkFBaUIsU0FBUSw2QkFBd0I7SUFDNUQsWUFBWSxNQUFrQjtRQUM1QixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QixNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxVQUFrQixFQUFFLENBQVc7UUFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxhQUFhLFVBQVUsSUFBSSxDQUFDLENBQUM7SUFDaEgsQ0FBQztJQUVNLHdCQUF3QixDQUFDLFVBQThCLEVBQUUsT0FBd0IsT0FBTztRQUM3RixJQUFJLFVBQVUsQ0FBQyxXQUFXLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDOUM7UUFDRCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN2QjtRQUNELElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRTtZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3hCO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN6QyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUU7WUFD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