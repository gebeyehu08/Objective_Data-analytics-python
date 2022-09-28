"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const FactoriesWriter_1 = require("../writers/FactoriesWriter");
templating_1.Generator.generateFromModel({ outputFile: '../generated/factories.ts' }, (writer, model) => {
    const factoriesWriter = new FactoriesWriter_1.FactoriesWriter(writer);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFjdG9yaWVzLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBRWxELGdFQUE2RDtBQUU3RCxzQkFBUyxDQUFDLGlCQUFpQixDQUN6QixFQUFFLFVBQVUsRUFBRSwyQkFBMkIsRUFBRSxFQUMzQyxDQUFDLE1BQWtCLEVBQUUsS0FBc0IsRUFBRSxFQUFFO0lBQzdDLE1BQU0sZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUV0RCxDQUFDLENBQ0YsQ0FBQyJ9