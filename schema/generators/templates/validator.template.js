"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const JavaScriptWriter_1 = require("../writers/JavaScriptWriter");
const ZodWriter_1 = require("../writers/ZodWriter");
const glob_1 = __importDefault(require("glob"));
const common_1 = require("./common");
const validatorFolder = '../../validator/';
const schemaVersion = base_schema_json_1.default.version.base_schema;
const descriptionsType = 'text';
const descriptionsTarget = 'primary';
templating_1.Generator.generate({ outputFile: `${validatorFolder}${schemaVersion}/validator.js` }, (writer) => {
    const zodWriter = new ZodWriter_1.ZodWriter(writer);
    zodWriter.writeEnumeration({
        name: 'ContextTypes',
        members: common_1.sortArrayByName(common_1.getObjectKeys(base_schema_json_1.default.contexts).map((_type) => ({ name: _type }))),
        description: `Context's _type discriminator attribute values`,
    });
    zodWriter.writeEnumeration({
        name: 'EventTypes',
        members: common_1.sortArrayByName(common_1.getObjectKeys(base_schema_json_1.default.events).map((_type) => ({ name: _type }))),
        description: `Event's _type discriminator attribute values`,
    });
    const allContexts = common_1.filterAbstractNames(common_1.getContextNames());
    const childContexts = allContexts.filter((context) => common_1.getChildren(context).length === 0);
    childContexts.forEach((contextName) => {
        const context = base_schema_json_1.default.contexts[contextName];
        const properties = common_1.getEntityProperties(context);
        zodWriter.writeObject({
            name: contextName,
            description: common_1.getEntityDescription(context, descriptionsType, descriptionsTarget),
            properties: common_1.getObjectKeys(properties).map((propertyName) => ({
                name: String(propertyName),
                description: common_1.getPropertyDescription(context, propertyName, descriptionsType, descriptionsTarget),
                typeName: properties[propertyName].type,
                isOptional: properties[propertyName].optional,
                value: properties[propertyName].type === 'discriminator' ? `ContextTypes.enum.${contextName}` : undefined,
            })),
        });
        zodWriter.writeLine(';');
        zodWriter.writeLine();
    });
    const parentContexts = allContexts.filter((context) => common_1.getChildren(context).length > 0);
    parentContexts.forEach((contextName) => {
        const context = base_schema_json_1.default.contexts[contextName];
        const properties = common_1.getEntityProperties(context);
        const childrenNames = common_1.getChildren(contextName);
        zodWriter.writeObject({
            name: `${contextName}Entity`,
            description: common_1.getEntityDescription(context, descriptionsType, descriptionsTarget),
            properties: common_1.getObjectKeys(properties).map((propertyName) => ({
                name: String(propertyName),
                description: common_1.getPropertyDescription(context, propertyName, descriptionsType, descriptionsTarget),
                typeName: properties[propertyName].type,
                isOptional: properties[propertyName].optional,
                value: properties[propertyName].type === 'discriminator' ? `ContextTypes.enum.${contextName}` : undefined,
            })),
        });
        zodWriter.writeLine(';');
        zodWriter.writeLine();
        zodWriter.writeDiscriminatedUnion({
            name: contextName,
            description: common_1.getEntityDescription(context, descriptionsType, descriptionsTarget),
            discriminator: '_type',
            items: [
                {
                    properties: common_1.getObjectKeys(properties).map((propertyName) => ({
                        name: String(propertyName),
                        description: common_1.getPropertyDescription(context, propertyName, descriptionsType, descriptionsTarget),
                        typeName: properties[propertyName].type,
                        isOptional: properties[propertyName].optional,
                        value: properties[propertyName].type === 'discriminator' ? `ContextTypes.enum.${contextName}` : undefined,
                    })),
                },
                ...childrenNames,
            ],
        });
    });
    const allLocationContexts = common_1.getChildren(base_schema_json_1.default.LocationStack.items.type).sort();
    const ChildLocationContexts = allLocationContexts.filter((context) => common_1.getChildren(context).length === 0);
    const ParentLocationContexts = allLocationContexts.filter((context) => common_1.getChildren(context).length > 0);
    zodWriter.writeArray({
        name: 'LocationStack',
        items: [...ChildLocationContexts, ...ParentLocationContexts.map((contextName) => `${contextName}Entity`)],
        discriminator: base_schema_json_1.default.LocationStack.items.discriminator,
        description: common_1.getEntityDescription(base_schema_json_1.default.LocationStack, descriptionsType, descriptionsTarget),
        rules: base_schema_json_1.default.LocationStack.validation.rules,
    });
    const allGlobalContexts = common_1.getChildren(base_schema_json_1.default.GlobalContexts.items.type).sort();
    const ChildGlobalContexts = allGlobalContexts.filter((context) => common_1.getChildren(context).length === 0);
    const ParentGlobalContexts = allGlobalContexts.filter((context) => common_1.getChildren(context).length > 0);
    zodWriter.writeArray({
        name: 'GlobalContexts',
        items: [...ChildGlobalContexts, ...ParentGlobalContexts.map((contextName) => `${contextName}Entity`)],
        discriminator: base_schema_json_1.default.GlobalContexts.items.discriminator,
        description: common_1.getEntityDescription(base_schema_json_1.default.GlobalContexts, descriptionsType, descriptionsTarget),
        rules: base_schema_json_1.default.GlobalContexts.validation.rules,
    });
    common_1.filterAbstractNames(common_1.getEventNames()).forEach((eventName) => {
        var _a;
        const event = base_schema_json_1.default.events[eventName];
        const properties = common_1.getEntityProperties(event);
        zodWriter.writeObject({
            name: eventName,
            description: common_1.getEntityDescription(event, descriptionsType, descriptionsTarget),
            properties: common_1.getObjectKeys(properties).map((propertyName) => ({
                name: String(propertyName),
                description: common_1.getPropertyDescription(event, propertyName, descriptionsType, descriptionsTarget),
                typeName: properties[propertyName].type,
                isOptional: properties[propertyName].optional,
                value: properties[propertyName].type === 'discriminator' ? `EventTypes.enum.${eventName}` : undefined,
            })),
            rules: (_a = event.validation) === null || _a === void 0 ? void 0 : _a.rules,
        });
        zodWriter.writeLine(';');
        zodWriter.writeLine();
    });
    zodWriter.writeJsDocLines([`Set validators in validatorMap for the refinements.`]);
    zodWriter.writeLine(`entityMap = {`);
    zodWriter.exportList.push('entityMap');
    zodWriter.increaseIndent();
    allContexts.forEach((context) => {
        zodWriter.writeLine(`'${context}': ${context},`);
    });
    zodWriter.decreaseIndent();
    zodWriter.writeLine(`};\n`);
    zodWriter.writeJsDocLines([
        `The validate method can be used to safely parse an Event.`,
        `Possible return values:`,
        `  - Valid event: { success: true, data: <parsed event object> }.`,
        `  - Invalid event: { success: false, error: <error collection> }.`,
    ]);
    zodWriter.writeLine(`const validate = z.union([`);
    zodWriter.exportList.push('validate');
    zodWriter.increaseIndent();
    common_1.filterAbstractNames(common_1.getEventNames()).forEach((eventName) => zodWriter.writeLine(`${eventName},`));
    zodWriter.decreaseIndent();
    zodWriter.writeLine(`]).safeParse;`);
    zodWriter.writeLine();
    zodWriter.exportList.forEach((name) => {
        zodWriter.writeLine(`exports.${name} = ${name};`);
    });
});
templating_1.Generator.generate({ outputFile: `${validatorFolder}common.js` }, (writer) => {
    const jsWriter = new JavaScriptWriter_1.JavaScriptWriter(writer);
    jsWriter.writeFile('validator-common.template.ts');
    jsWriter.writeEndOfLine();
    jsWriter.writeEndOfLine();
    const validatorFiles = glob_1.default.sync(`${validatorFolder}/*/`, { ignore: '../../validator/**/node_modules' });
    validatorFiles.forEach((validator) => {
        const validatorVersion = validator.replace(`${validatorFolder}`, '').replace('/', '');
        jsWriter.writeLine(`versions.push('${validatorVersion}');`);
    });
});
templating_1.Generator.generate({ outputFile: `${validatorFolder}validator-service.js` }, (writer) => {
    const jsWriter = new JavaScriptWriter_1.JavaScriptWriter(writer);
    jsWriter.writeFile('validator-service.template.ts');
});
templating_1.Generator.generate({ outputFile: `${validatorFolder}${schemaVersion}/validator.test.js` }, (writer) => {
    const jsWriter = new JavaScriptWriter_1.JavaScriptWriter(writer);
    jsWriter.writeFile('validator-test.template.js');
});
templating_1.Generator.generate({ outputFile: `${validatorFolder}${schemaVersion}/package.json` }, (writer) => {
    writer.writeFile('validator-package_json.template.json');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdG9yLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBS0Esc0RBQWtEO0FBQ2xELDhFQUE4QztBQUM5QyxrRUFBK0Q7QUFDL0Qsb0RBQWlEO0FBQ2pELGdEQUF3QjtBQUN4QixxQ0FVa0I7QUFFbEIsTUFBTSxlQUFlLEdBQUcsa0JBQWtCLENBQUM7QUFDM0MsTUFBTSxhQUFhLEdBQUcsMEJBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQ25ELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBQ2hDLE1BQU0sa0JBQWtCLEdBQUcsU0FBUyxDQUFDO0FBR3JDLHNCQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsZUFBZSxHQUFHLGFBQWEsZUFBZSxFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDM0csTUFBTSxTQUFTLEdBQUcsSUFBSSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBR3hDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN6QixJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsd0JBQWUsQ0FBQyxzQkFBYSxDQUFDLDBCQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RixXQUFXLEVBQUUsZ0RBQWdEO0tBQzlELENBQUMsQ0FBQztJQUdILFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN6QixJQUFJLEVBQUUsWUFBWTtRQUNsQixPQUFPLEVBQUUsd0JBQWUsQ0FBQyxzQkFBYSxDQUFDLDBCQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFF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