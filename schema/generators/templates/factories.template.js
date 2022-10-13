"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const TypescriptWriter_1 = require("../writers/TypescriptWriter");
templating_1.Generator.generateFromModel({ outputFile: '../generated/factories.ts' }, (writer, model) => {
    const factoriesWriter = new TypescriptWriter_1.TypescriptWriter(writer);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFjdG9yaWVzLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBRWxELGtFQUErRDtBQUUvRCxzQkFBUyxDQUFDLGlCQUFpQixDQUN6QixFQUFFLFVBQVUsRUFBRSwyQkFBMkIsRUFBRSxFQUMzQyxDQUFDLE1BQWtCLEVBQUUsS0FBc0IsRUFBRSxFQUFFO0lBQzdDLE1BQU0sZUFBZSxHQUFHLElBQUksbUNBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFdkQsQ0FBQyxDQUNGLENBQUMifQ==