"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeEnumerations = exports.writeCopyright = exports.sortEnumMembers = exports.getObjectKeys = void 0;
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
exports.getObjectKeys = Object.keys;
exports.sortEnumMembers = (members) => members.sort((a, b) => a.name.localeCompare(b.name));
exports.writeCopyright = (writer) => {
    writer.writeLine(`/*\n * Copyright ${new Date().getFullYear()} Objectiv B.V.\n */\n`);
};
exports.writeEnumerations = (writer) => {
    writer.writeEnumeration({
        export: true,
        name: 'ContextTypes',
        members: exports.sortEnumMembers(exports.getObjectKeys(base_schema_json_1.default.contexts).map((_type) => ({ name: _type }))),
    });
    writer.writeLine();
    writer.writeEnumeration({
        export: true,
        name: 'EventTypes',
        members: exports.sortEnumMembers(exports.getObjectKeys(base_schema_json_1.default.events).map((_type) => ({ name: _type }))),
    });
    writer.writeLine();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLDhFQUE4QztBQUlqQyxRQUFBLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBb0QsQ0FBQztBQUU1RSxRQUFBLGVBQWUsR0FBRyxDQUE2QixPQUFZLEVBQUUsRUFBRSxDQUMxRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFMUMsUUFBQSxjQUFjLEdBQUcsQ0FBQyxNQUFzQyxFQUFFLEVBQUU7SUFDdkUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztBQUN4RixDQUFDLENBQUM7QUFFVyxRQUFBLGlCQUFpQixHQUFHLENBQUMsTUFBc0MsRUFBRSxFQUFFO0lBQzFFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztRQUN0QixNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSx1QkFBZSxDQUFDLHFCQUFhLENBQUMsMEJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzdGLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUVuQixNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFDdEIsTUFBTSxFQUFFLElBQUk7UUFDWixJQUFJLEVBQUUsWUFBWTtRQUNsQixPQUFPLEVBQUUsdUJBQWUsQ0FBQyxxQkFBYSxDQUFDLDBCQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMzRixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDckIsQ0FBQyxDQUFDIn0=