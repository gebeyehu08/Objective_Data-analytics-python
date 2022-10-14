"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const TypescriptWriter_1 = require("../writers/TypescriptWriter");
const common_1 = require("./common");
const destinationFolder = '../generated/';
const contextNames = common_1.getContextNames();
const eventNames = common_1.getEventNames();
templating_1.Generator.generateFromModel({ outputFile: `${destinationFolder}/ContextNames.ts` }, (writer) => {
    const tsWriter = new TypescriptWriter_1.TypescriptWriter(writer);
    const globalContexts = [];
    const locationContexts = [];
    const abstractContexts = [];
    contextNames.forEach(contextName => {
        const context = common_1.getEntityByName(contextName);
        const parents = common_1.getEntityParents(context);
        if (contextName.startsWith('Abstract')) {
            abstractContexts.push(contextName);
        }
        if (parents.includes('AbstractGlobalContext')) {
            globalContexts.push(contextName);
        }
        if (parents.includes('AbstractLocationContext')) {
            locationContexts.push(contextName);
        }
    });
    tsWriter.writeEnumeration({
        export: true,
        name: 'AbstractContextName',
        members: common_1.sortArrayByName(abstractContexts.map((_type) => ({ name: _type, value: _type }))),
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLine('export type AnyAbstractContextName =');
    abstractContexts.forEach((contextName, index) => {
        tsWriter.writeLine(`${tsWriter.indentString}| '${contextName}'${index === abstractContexts.length - 1 ? ';' : ''}`);
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeEnumeration({
        export: true,
        name: 'GlobalContextName',
        members: common_1.sortArrayByName(globalContexts.map((_type) => ({ name: _type, value: _type }))),
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLine('export type AnyGlobalContextName =');
    globalContexts.forEach((contextName, index) => {
        tsWriter.writeLine(`${tsWriter.indentString}| '${contextName}'${index === globalContexts.length - 1 ? ';' : ''}`);
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeEnumeration({
        export: true,
        name: 'LocationContextName',
        members: common_1.sortArrayByName(locationContexts.map((_type) => ({ name: _type, value: _type }))),
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLine('export type AnyLocationContextName =');
    locationContexts.forEach((contextName, index) => {
        tsWriter.writeLine(`${tsWriter.indentString}| '${contextName}'${index === locationContexts.length - 1 ? ';' : ''}`);
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLines([
        'export const ContextNames = new Set([...Object.keys(LocationContextName), ...Object.keys(GlobalContextName)]);'
    ]);
});
templating_1.Generator.generateFromModel({ outputFile: `${destinationFolder}/EventNames.ts` }, (writer) => {
    const tsWriter = new TypescriptWriter_1.TypescriptWriter(writer);
    const events = [];
    const abstractEvents = [];
    eventNames.forEach(eventName => {
        if (eventName.startsWith('Abstract')) {
            abstractEvents.push(eventName);
        }
        else {
            events.push(eventName);
        }
    });
    tsWriter.writeEnumeration({
        export: true,
        name: 'AbstractEventName',
        members: common_1.sortArrayByName(abstractEvents.map((_type) => ({ name: _type, value: _type }))),
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLine('export type AnyAbstractEventName =');
    abstractEvents.forEach((eventName, index) => {
        tsWriter.writeLine(`${tsWriter.indentString}| '${eventName}'${index === abstractEvents.length - 1 ? ';' : ''}`);
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeEnumeration({
        export: true,
        name: 'EventName',
        members: common_1.sortArrayByName(events.map((_type) => ({ name: _type, value: _type }))),
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLine('export type AnyEventName =');
    events.forEach((eventName, index) => {
        tsWriter.writeLine(`${tsWriter.indentString}| '${eventName}'${index === events.length - 1 ? ';' : ''}`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmFtZXMudGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuYW1lcy50ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBLHNEQUFrRDtBQUNsRCxrRUFBK0Q7QUFDL0QscUNBQThHO0FBSTlHLE1BQU0saUJBQWlCLEdBQUcsZUFBZSxDQUFDO0FBRTFDLE1BQU0sWUFBWSxHQUFHLHdCQUFlLEVBQUUsQ0FBQztBQUN2QyxNQUFNLFVBQVUsR0FBRyxzQkFBYSxFQUFFLENBQUM7QUFFbkMsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLGlCQUFpQixrQkFBa0IsRUFBRSxFQUFFLENBQUMsTUFBa0IsRUFBRSxFQUFFO0lBQ3pHLE1BQU0sUUFBUSxHQUFHLElBQUksbUNBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUMsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQzFCLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQzVCLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBRTVCLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7UUFDakMsTUFBTSxPQUFPLEdBQUcsd0JBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3QyxNQUFNLE9BQU8sR0FBRyx5QkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxQyxJQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDckMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3BDO1FBRUQsSUFBRyxPQUFPLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLEVBQUU7WUFDNUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtTQUNqQztRQUVELElBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFO1lBQzlDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtTQUNuQztJQUNILENBQUMsQ0FBQyxDQUFBO0lBR0YsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1FBQ3hCLE1BQU0sRUFBRSxJQUFJO1FBQ1osSUFBSSxFQUFFLHFCQUFxQjtRQUMzQixPQUFPLEVBQUUsd0JBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDM0YsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBRzFCLFFBQVEsQ0FBQyxTQUFTLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtJQUMxRCxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDOUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxZQUFZLE1BQU0sV0FBVyxJQUFJLEtBQUssS0FBSyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEgsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7SUFHMUIsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1FBQ3hCLE1BQU0sRUFBRSxJQUFJO1FBQ1osSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixPQUFPLEVBQUUsd0JBQWUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3pGLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUcxQixRQUFRLENBQUMsU0FBUyxDQUFDLG9DQUFvQyxDQUFDLENBQUE7SUFDeEQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUM1QyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDLFlBQVksTUFBTSxXQUFXLElBQUksS0FBSyxLQUFLLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEgsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7SUFHMUIsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1FBQ3hCLE1BQU0sRUFBRSxJQUFJO1FBQ1osSUFBSSxFQUFFLHFCQUFxQjtRQUMzQixPQUFPLEVBQUUsd0JBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDM0YsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBRzFCLFFBQVEsQ0FBQyxTQUFTLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtJQUMxRCxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDOUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxZQUFZLE1BQU0sV0FBVyxJQUFJLEtBQUssS0FBSyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEgsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7SUFFMUIsUUFBUSxDQUFDLFVBQVUsQ0FBQztRQUNsQixnSEFBZ0g7S0FDakgsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxzQkFBUyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsaUJBQWlCLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDdkcsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDbEIsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBRTFCLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDN0IsSUFBRyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ25DLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDaEM7YUFBTTtZQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7U0FDdkI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUdILFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN4QixNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxtQkFBbUI7UUFDekIsT0FBTyxFQUFFLHdCQUFlLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN6RixDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7SUFHMUIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO0lBQ3hELGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDMUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxZQUFZLE1BQU0sU0FBUyxJQUFJLEtBQUssS0FBSyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2xILENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBRzFCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN4QixNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxXQUFXO1FBQ2pCLE9BQU8sRUFBRSx3QkFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDakYsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBRzFCLFFBQVEsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtJQUNoRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2xDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxRQUFRLENBQUMsWUFBWSxNQUFNLFNBQVMsSUFBSSxLQUFLLEtBQUssTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxRyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=