"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const JavaScriptWriter_1 = require("../writers/JavaScriptWriter");
const common_1 = require("./common");
templating_1.Generator.generate({ outputFile: `../../../backend/objectiv_backend/schema/hierarchy.json` }, (writer) => {
    const jsWriter = new JavaScriptWriter_1.JavaScriptWriter(writer, { writeCopyright: false });
    const hierarchy = {};
    common_1.getEntityNames()
        .sort()
        .forEach((entityName) => {
        const entityParents = common_1.getEntityParents(common_1.getEntityByName(entityName));
        hierarchy[entityName] = [...entityParents, entityName];
    });
    jsWriter.writeJSONObject(hierarchy);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGllcmFyY2h5LnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGllcmFyY2h5LnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBQ2xELGtFQUErRDtBQUMvRCxxQ0FBNkU7QUFFN0Usc0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUseURBQXlELEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUNuSCxNQUFNLFFBQVEsR0FBRyxJQUFJLG1DQUFnQixDQUFDLE1BQU0sRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRXpFLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUVyQix1QkFBYyxFQUFFO1NBQ2IsSUFBSSxFQUFFO1NBQ04sT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7UUFDdEIsTUFBTSxhQUFhLEdBQUcseUJBQWdCLENBQUMsd0JBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3pELENBQUMsQ0FBQyxDQUFDO0lBRUwsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUMsQ0FBQyJ9