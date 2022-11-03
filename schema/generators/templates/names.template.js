"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const TypeScriptWriter_1 = require("../writers/TypeScriptWriter");
const parser_1 = require("./parser");
const destinationFolder = '../../../tracker/core/schema/src/generated/';
templating_1.Generator.generate({ outputFile: `${destinationFolder}names.ts` }, (writer) => {
    const tsWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
    const abstractContexts = parser_1.getContexts({ isAbstract: true, sortBy: 'name' });
    const abstractEvents = parser_1.getEvents({ isAbstract: true, sortBy: 'name' });
    const globalContexts = parser_1.getContexts({ isGlobalContext: true, sortBy: 'name' });
    const locationContexts = parser_1.getContexts({ isLocationContext: true, sortBy: 'name' });
    const events = parser_1.getEvents({ isAbstract: false, sortBy: 'name' });
    tsWriter.writeEnumeration({
        export: true,
        name: 'AbstractContextName',
        members: abstractContexts.map(({ name }) => ({ name, value: name })),
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLine('export type AnyAbstractContextName =');
    abstractContexts.forEach((context, index) => {
        tsWriter.writeLine(`${tsWriter.indentString}| '${context.name}'${index === abstractContexts.length - 1 ? ';' : ''}`);
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeEnumeration({
        export: true,
        name: 'GlobalContextName',
        members: globalContexts.map(({ name }) => ({ name, value: name })),
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLine('export type AnyGlobalContextName =');
    globalContexts.forEach((context, index) => {
        tsWriter.writeLine(`${tsWriter.indentString}| '${context.name}'${index === globalContexts.length - 1 ? ';' : ''}`);
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeEnumeration({
        export: true,
        name: 'LocationContextName',
        members: locationContexts.map(({ name }) => ({ name, value: name })),
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLine('export type AnyLocationContextName =');
    locationContexts.forEach((context, index) => {
        tsWriter.writeLine(`${tsWriter.indentString}| '${context.name}'${index === locationContexts.length - 1 ? ';' : ''}`);
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLines([
        'export const ContextNames = new Set([...Object.keys(LocationContextName), ...Object.keys(GlobalContextName)]);',
    ]);
    tsWriter.writeEndOfLine();
    tsWriter.writeEnumeration({
        export: true,
        name: 'AbstractEventName',
        members: abstractEvents.map(({ name }) => ({ name, value: name })),
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLine('export type AnyAbstractEventName =');
    abstractEvents.forEach((event, index) => {
        tsWriter.writeLine(`${tsWriter.indentString}| '${event.name}'${index === abstractEvents.length - 1 ? ';' : ''}`);
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeEnumeration({
        export: true,
        name: 'EventName',
        members: events.map(({ name }) => ({ name, value: name })),
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLine('export type AnyEventName =');
    events.forEach((event, index) => {
        tsWriter.writeLine(`${tsWriter.indentString}| '${event.name}'${index === events.length - 1 ? ';' : ''}`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmFtZXMudGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuYW1lcy50ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBLHNEQUFrRDtBQUNsRCxrRUFBK0Q7QUFDL0QscUNBQWtEO0FBRWxELE1BQU0saUJBQWlCLEdBQUcsNkNBQTZDLENBQUM7QUFFeEUsc0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxpQkFBaUIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDeEYsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QyxNQUFNLGdCQUFnQixHQUFHLG9CQUFXLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzNFLE1BQU0sY0FBYyxHQUFHLGtCQUFTLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZFLE1BQU0sY0FBYyxHQUFHLG9CQUFXLENBQUMsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzlFLE1BQU0sZ0JBQWdCLEdBQUcsb0JBQVcsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNsRixNQUFNLE1BQU0sR0FBRyxrQkFBUyxDQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUdoRSxRQUFRLENBQUMsZ0JBQWdCLENBQUM7UUFDeEIsTUFBTSxFQUFFLElBQUk7UUFDWixJQUFJLEVBQUUscUJBQXFCO1FBQzNCLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ3JFLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUcxQixRQUFRLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7SUFDM0QsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzFDLFFBQVEsQ0FBQyxTQUFTLENBQ2hCLEdBQUcsUUFBUSxDQUFDLFlBQVksTUFBTSxPQUFPLENBQUMsSUFBSSxJQUFJLEtBQUssS0FBSyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUNqRyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7SUFHMUIsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1FBQ3hCLE1BQU0sRUFBRSxJQUFJO1FBQ1osSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixPQUFPLEVBQUUsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7S0FDbkUsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBRzFCLFFBQVEsQ0FBQyxTQUFTLENBQUMsb0NBQW9DLENBQUMsQ0FBQztJQUN6RCxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3hDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxRQUFRLENBQUMsWUFBWSxNQUFNLE9BQU8sQ0FBQyxJQUFJLElBQUksS0FBSyxLQUFLLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDckgsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7SUFHMUIsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1FBQ3hCLE1BQU0sRUFBRSxJQUFJO1FBQ1osSUFBSSxFQUFFLHFCQUFxQjtRQUMzQixPQUFPLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNyRSxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7SUFHMUIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0lBQzNELGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUMxQyxRQUFRLENBQUMsU0FBUyxDQUNoQixHQUFHLFFBQVEsQ0FBQyxZQUFZLE1BQU0sT0FBTyxDQUFDLElBQUksSUFBSSxLQUFLLEtBQUssZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDakcsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBRTFCLFFBQVEsQ0FBQyxVQUFVLENBQUM7UUFDbEIsZ0hBQWdIO0tBQ2pILENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUcxQixRQUFRLENBQUMsZ0JBQWdCLENBQUM7UUFDeEIsTUFBTSxFQUFFLElBQUk7UUFDWixJQUFJLEVBQUUsbUJBQW1CO1FBQ3pCLE9BQU8sRUFBRSxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNuRSxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7SUFHMUIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0lBQ3pELGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDdEMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxZQUFZLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLEtBQUssY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNuSCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUcxQixRQUFRLENBQUMsZ0JBQWdCLENBQUM7UUFDeEIsTUFBTSxFQUFFLElBQUk7UUFDWixJQUFJLEVBQUUsV0FBVztRQUNqQixPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7S0FDM0QsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBRzFCLFFBQVEsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsQ0FBQztJQUNqRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzlCLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxRQUFRLENBQUMsWUFBWSxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxLQUFLLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDM0csQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9