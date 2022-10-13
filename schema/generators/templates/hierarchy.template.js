"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const fs_1 = __importDefault(require("fs"));
const JavaScriptWriter_1 = require("../writers/JavaScriptWriter");
const common_1 = require("./common");
const fileName = 'hierarchy.json';
const outputFile = `../generated/${fileName}`;
const copyDestinations = [
    `../../../backend/objectiv_backend/schema/${fileName}`,
    `../../../tracker/core/schema/src/generated/${fileName}`
];
templating_1.Generator.generate({ outputFile }, (writer) => {
    const jsWriter = new JavaScriptWriter_1.JavaScriptWriter(writer, { writeCopyright: false });
    const hierarchy = {};
    common_1.getEntityNames().sort().forEach(entityName => {
        const entityParents = common_1.getEntityParents(common_1.getEntityByName(entityName));
        if (entityParents.length) {
            hierarchy[entityName] = [...entityParents, entityName];
        }
    });
    jsWriter.writeJSONObject(hierarchy);
});
copyDestinations.forEach(destination => {
    fs_1.default.copyFileSync(outputFile, destination);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGllcmFyY2h5LnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGllcmFyY2h5LnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBS0Esc0RBQWtEO0FBQ2xELDRDQUFvQjtBQUNwQixrRUFBK0Q7QUFDL0QscUNBQTZFO0FBRTdFLE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDO0FBQ2xDLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixRQUFRLEVBQUUsQ0FBQztBQUM5QyxNQUFNLGdCQUFnQixHQUFHO0lBQ3ZCLDRDQUE0QyxRQUFRLEVBQUU7SUFDdEQsOENBQThDLFFBQVEsRUFBRTtDQUN6RCxDQUFBO0FBRUQsc0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUN4RCxNQUFNLFFBQVEsR0FBRyxJQUFJLG1DQUFnQixDQUFDLE1BQU0sRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRXpFLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUVyQix1QkFBYyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQzNDLE1BQU0sYUFBYSxHQUFHLHlCQUFnQixDQUFDLHdCQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNwRSxJQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDdkIsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDeEQ7SUFDSCxDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFDLENBQUM7QUFHSCxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7SUFDckMsWUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDM0MsQ0FBQyxDQUFDLENBQUEifQ==