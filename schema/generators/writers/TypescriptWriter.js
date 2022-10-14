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
exports.TypescriptWriter = void 0;
const typescript_1 = require("@yellicode/typescript");
class TypescriptWriter extends typescript_1.TypeScriptWriter {
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
        if (!func)
            return this;
        this.writeES6ConstDeclaration({
            name: func.name,
            typeName: null,
            export: func.export,
        });
        this.writeLine(` = (props: {`);
        this.increaseIndent();
        func.parameters.forEach(parameter => {
            this.writeLine(`${parameter.name}${parameter.isOptional ? '?:' : ':'} ${parameter.typeName},`);
        });
        this.decreaseIndent();
        this.write(`}): ${func.returnTypeName} => `);
        contents(this);
        return this;
    }
}
exports.TypescriptWriter = TypescriptWriter;
__exportStar(require("@yellicode/typescript"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZXNjcmlwdFdyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlR5cGVzY3JpcHRXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUtBLHNEQUFpRztBQU1qRyxNQUFhLGdCQUFpQixTQUFRLDZCQUFnQjtJQUNwRCxZQUFZLE1BQWtCO1FBQzVCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLHVCQUF1QixDQUFDLENBQUM7SUFDeEYsQ0FBQztJQUVELHFCQUFxQixDQUFDLFVBQWtCLEVBQUUsQ0FBVztRQUNuRCxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLGFBQWEsVUFBVSxJQUFJLENBQUMsQ0FBQztJQUNoSCxDQUFDO0lBRU0sd0JBQXdCLENBQUMsVUFBOEIsRUFBRSxPQUF3QixPQUFPO1FBQzNGLElBQUksVUFBVSxDQUFDLFdBQVcsRUFBRTtZQUMxQixJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUM5QztRQUNELElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3pCO1FBQ0QsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDMUI7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDMUM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0scUJBQXFCLENBQUMsSUFBMkIsRUFBRSxRQUE2QztRQUNyRyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRXZCLElBQUksQ0FBQyx3QkFBd0IsQ0FBRTtZQUM3QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNwQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV0QixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQTtRQUNoRyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLGNBQWMsTUFBTSxDQUFDLENBQUM7UUFFN0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWYsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFuREQsNENBbURDO0FBRUQsd0RBQXNDIn0=