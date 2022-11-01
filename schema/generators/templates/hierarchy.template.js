"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const JavaScriptWriter_1 = require("../writers/JavaScriptWriter");
const parser_1 = require("./parser");
templating_1.Generator.generate({ outputFile: `../../../backend/objectiv_backend/schema/hierarchy.json` }, (writer) => {
    const jsWriter = new JavaScriptWriter_1.JavaScriptWriter(writer, { writeCopyright: false });
    const hierarchy = {};
    parser_1.getEntities({ exclude: ['LocationStack', 'GlobalContexts'], sortBy: 'name' }).forEach((entity) => {
        hierarchy[entity.name] = [...entity.parents.map(({ name }) => name), entity.name];
    });
    jsWriter.writeJSONObject(hierarchy);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGllcmFyY2h5LnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGllcmFyY2h5LnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBQ2xELGtFQUErRDtBQUMvRCxxQ0FBdUM7QUFFdkMsc0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUseURBQXlELEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUNuSCxNQUFNLFFBQVEsR0FBRyxJQUFJLG1DQUFnQixDQUFDLE1BQU0sRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRXpFLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUVyQixvQkFBVyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLGdCQUFnQixDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7UUFDL0YsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEYsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RDLENBQUMsQ0FBQyxDQUFDIn0=