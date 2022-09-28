"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
templating_1.Generator.generateFromModel({ outputFile: '../generated/factories.ts' }, (writer, model) => {
    const ts = new typescript_1.TypeScriptWriter(writer);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFjdG9yaWVzLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBQ2xELHNEQUF5RDtBQUd6RCxzQkFBUyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsVUFBVSxFQUFFLDJCQUEyQixFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEtBQXNCLEVBQUUsRUFBRTtJQUN0SCxNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTFDLENBQUMsQ0FBQyxDQUFDIn0=