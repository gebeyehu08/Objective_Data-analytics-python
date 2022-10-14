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
    const globalContexts = contextNames.filter(contextName => {
        const context = common_1.getEntityByName(contextName);
        const parents = common_1.getEntityParents(context);
        const isAbstract = contextName.startsWith('Abstract');
        const isGlobalContext = parents.includes('AbstractGlobalContext');
        return !isAbstract && isGlobalContext;
    });
    const locationContexts = contextNames.filter(contextName => {
        const context = common_1.getEntityByName(contextName);
        const parents = common_1.getEntityParents(context);
        const isAbstract = contextName.startsWith('Abstract');
        const isLocationContext = parents.includes('AbstractLocationContext');
        return !isAbstract && isLocationContext;
    });
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
    const events = eventNames.filter(eventName => {
        return !eventName.startsWith('Abstract');
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmFtZXMudGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuYW1lcy50ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBLHNEQUFrRDtBQUNsRCxrRUFBK0Q7QUFDL0QscUNBQThHO0FBSTlHLE1BQU0saUJBQWlCLEdBQUcsZUFBZSxDQUFDO0FBRTFDLE1BQU0sWUFBWSxHQUFHLHdCQUFlLEVBQUUsQ0FBQztBQUN2QyxNQUFNLFVBQVUsR0FBRyxzQkFBYSxFQUFFLENBQUM7QUFFbkMsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLGlCQUFpQixrQkFBa0IsRUFBRSxFQUFFLENBQUMsTUFBa0IsRUFBRSxFQUFFO0lBQ3pHLE1BQU0sUUFBUSxHQUFHLElBQUksbUNBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUMsTUFBTSxjQUFjLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRTtRQUN2RCxNQUFNLE9BQU8sR0FBRyx3QkFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sT0FBTyxHQUFHLHlCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFDLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEQsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBRWxFLE9BQU8sQ0FBQyxVQUFVLElBQUksZUFBZSxDQUFDO0lBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQ3pELE1BQU0sT0FBTyxHQUFHLHdCQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0MsTUFBTSxPQUFPLEdBQUcseUJBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUMsTUFBTSxVQUFVLEdBQUcs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