"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const TypeScriptWriter_1 = require("../writers/TypeScriptWriter");
const common_1 = require("./common");
const destinationFolder = '../generated/';
const contextNames = common_1.getContextNames();
const eventNames = common_1.getEventNames();
templating_1.Generator.generateFromModel({ outputFile: `${destinationFolder}/ContextNames.ts` }, (writer) => {
    const tsWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
    const globalContexts = [];
    const locationContexts = [];
    const abstractContexts = [];
    contextNames.forEach((contextName) => {
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
        members: common_1.sortBy(abstractContexts.map((_type) => ({ name: _type, value: _type })), 'name'),
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
        members: common_1.sortBy(globalContexts.map((_type) => ({ name: _type, value: _type })), 'name'),
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
        members: common_1.sortBy(locationContexts.map((_type) => ({ name: _type, value: _type })), 'name'),
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLine('export type AnyLocationContextName =');
    locationContexts.forEach((contextName, index) => {
        tsWriter.writeLine(`${tsWriter.indentString}| '${contextName}'${index === locationContexts.length - 1 ? ';' : ''}`);
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLines([
        'export const ContextNames = new Set([...Object.keys(LocationContextName), ...Object.keys(GlobalContextName)]);',
    ]);
});
templating_1.Generator.generateFromModel({ outputFile: `${destinationFolder}/EventNames.ts` }, (writer) => {
    const tsWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
    const events = [];
    const abstractEvents = [];
    eventNames.forEach((eventName) => {
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
        members: common_1.sortBy(abstractEvents.map((_type) => ({ name: _type, value: _type })), 'name'),
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
        members: common_1.sortBy(events.map((_type) => ({ name: _type, value: _type })), 'name'),
    });
    tsWriter.writeEndOfLine();
    tsWriter.writeLine('export type AnyEventName =');
    events.forEach((eventName, index) => {
        tsWriter.writeLine(`${tsWriter.indentString}| '${eventName}'${index === events.length - 1 ? ';' : ''}`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmFtZXMudGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuYW1lcy50ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBLHNEQUFrRDtBQUNsRCxrRUFBK0Q7QUFDL0QscUNBQXFHO0FBSXJHLE1BQU0saUJBQWlCLEdBQUcsZUFBZSxDQUFDO0FBRTFDLE1BQU0sWUFBWSxHQUFHLHdCQUFlLEVBQUUsQ0FBQztBQUN2QyxNQUFNLFVBQVUsR0FBRyxzQkFBYSxFQUFFLENBQUM7QUFFbkMsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLGlCQUFpQixrQkFBa0IsRUFBRSxFQUFFLENBQUMsTUFBa0IsRUFBRSxFQUFFO0lBQ3pHLE1BQU0sUUFBUSxHQUFHLElBQUksbUNBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUMsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQzFCLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQzVCLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBRTVCLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtRQUNuQyxNQUFNLE9BQU8sR0FBRyx3QkFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sT0FBTyxHQUFHLHlCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFDLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUN0QyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDcEM7UUFFRCxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsRUFBRTtZQUM3QyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLEVBQUU7WUFDL0MsZ0JBQWdCLENBQUMsSUFB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