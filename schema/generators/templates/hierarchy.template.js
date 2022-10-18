"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const JavaScriptWriter_1 = require("../writers/JavaScriptWriter");
const parser_1 = require("./parser");
templating_1.Generator.generate({ outputFile: `../../../backend/objectiv_backend/schema/hierarchy.json` }, (writer) => {
    const jsWriter = new JavaScriptWriter_1.JavaScriptWriter(writer, { writeCopyright: false });
    const hierarchy = {};
    [...parser_1.getContexts(), ...parser_1.getEvents()]
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((entity) => {
        hierarchy[entity.name] = [...entity.parents.map(({ name }) => name), entity.name];
    });
    jsWriter.writeJSONObject(hierarchy);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGllcmFyY2h5LnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGllcmFyY2h5LnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBQ2xELGtFQUErRDtBQUMvRCxxQ0FBa0Q7QUFFbEQsc0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUseURBQXlELEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUNuSCxNQUFNLFFBQVEsR0FBRyxJQUFJLG1DQUFnQixDQUFDLE1BQU0sRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRXpFLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUVyQixDQUFDLEdBQUcsb0JBQVcsRUFBRSxFQUFFLEdBQUcsa0JBQVMsRUFBRSxDQUFDO1NBQy9CLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUNsQixTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwRixDQUFDLENBQUMsQ0FBQztJQUVMLFFBQVEsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFDLENBQUMifQ==