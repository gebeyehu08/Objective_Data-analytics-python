"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const TypescriptWriter_1 = require("../writers/TypescriptWriter");
const common_1 = require("./common");
templating_1.Generator.generateFromModel({ outputFile: '../generated/schema.ts' }, (writer, model) => {
    const schemaWriter = new TypescriptWriter_1.TypescriptWriter(writer);
    schemaWriter.writeEnumeration({
        export: true,
        name: 'ContextTypes',
        members: common_1.sortArrayByName(common_1.getObjectKeys(base_schema_json_1.default.contexts).map((_type) => ({ name: _type }))),
    });
    writer.writeLine();
    schemaWriter.writeEnumeration({
        export: true,
        name: 'EventTypes',
        members: common_1.sortArrayByName(common_1.getObjectKeys(base_schema_json_1.default.events).map((_type) => ({ name: _type }))),
    });
    writer.writeLine();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZW1hLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBS0Esc0RBQWtEO0FBQ2xELDhFQUE4QztBQUM5QyxrRUFBK0Q7QUFDL0QscUNBQTBEO0FBRTFELHNCQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRSxVQUFVLEVBQUUsd0JBQXdCLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsS0FBc0IsRUFBRSxFQUFFO0lBQ25ILE1BQU0sWUFBWSxHQUFHLElBQUksbUNBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFHbEQsWUFBWSxDQUFDLGdCQUFnQixDQUFDO1FBQzVCLE1BQU0sRUFBRSxJQUFJO1FBQ1osSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLHdCQUFlLENBQUMsc0JBQWEsQ0FBQywwQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDN0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBR25CLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQztRQUM1QixNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxZQUFZO1FBQ2xCLE9BQU8sRUFBRSx3QkFBZSxDQUFDLHNCQUFhLENBQUMsMEJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzNGLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNyQixDQUFDLENBQUMsQ0FBQyJ9