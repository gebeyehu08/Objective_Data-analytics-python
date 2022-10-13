"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const JavaScriptWriter_1 = require("../writers/JavaScriptWriter");
const common_1 = require("./common");
templating_1.Generator.generate({ outputFile: '../generated/hierarchy.json' }, (writer) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGllcmFyY2h5LnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGllcmFyY2h5LnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBQ2xELGtFQUErRDtBQUMvRCxxQ0FBNkU7QUFFN0Usc0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsNkJBQTZCLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUN2RixNQUFNLFFBQVEsR0FBRyxJQUFJLG1DQUFnQixDQUFDLE1BQU0sRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRXpFLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUVyQix1QkFBYyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQzNDLE1BQU0sYUFBYSxHQUFHLHlCQUFnQixDQUFDLHdCQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNwRSxJQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDdkIsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDeEQ7SUFDSCxDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFDLENBQUMifQ==