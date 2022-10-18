"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const TypeScriptWriter_1 = require("../writers/TypeScriptWriter");
const common_1 = require("./common");
templating_1.Generator.generateFromModel({ outputFile: '../generated/schema.ts' }, (writer) => {
    const schemaWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
    schemaWriter.writeEnumeration({
        export: true,
        name: 'ContextTypes',
        members: common_1.sortBy(common_1.getObjectKeys(base_schema_json_1.default.contexts).map((_type) => ({ name: _type })), 'name'),
    });
    writer.writeLine();
    schemaWriter.writeEnumeration({
        export: true,
        name: 'EventTypes',
        members: common_1.sortBy(common_1.getObjectKeys(base_schema_json_1.default.events).map((_type) => ({ name: _type })), 'name'),
    });
    writer.writeLine();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZW1hLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBS0Esc0RBQWtEO0FBQ2xELDhFQUE4QztBQUM5QyxrRUFBK0Q7QUFDL0QscUNBQWlEO0FBRWpELHNCQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRSxVQUFVLEVBQUUsd0JBQXdCLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUMzRixNQUFNLFlBQVksR0FBRyxJQUFJLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBR2xELFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQztRQUM1QixNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSxlQUFNLENBQUMsc0JBQWEsQ0FBQywwQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDO0tBQzVGLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUduQixZQUFZLENBQUMsZ0JBQWdCLENBQUM7UUFDNUIsTUFBTSxFQUFFLElBQUk7UUFDWixJQUFJLEVBQUUsWUFBWTtRQUNsQixPQUFPLEVBQUUsZUFBTSxDQUFDLHNCQUFhLENBQUMsMEJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQztLQUMxRixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDckIsQ0FBQyxDQUFDLENBQUMifQ==