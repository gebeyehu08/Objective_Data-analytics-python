"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const ZodWriter_1 = require("../writers/ZodWriter");
const common_1 = require("./common");
const schemaVersion = base_schema_json_1.default.version.base_schema;
const descriptionsType = 'text';
const descriptionsIntent = 'primary';
const validatorGenerator = (writer, model) => {
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
        const context = model.contexts[contextName];
        const properties = common_1.getEntityProperties(context);
        zodWriter.writeObject({
            name: contextName,
            description: common_1.getEntityDescription(context, descriptionsType, descriptionsIntent),
            properties: common_1.getObjectKeys(properties).map((propertyName) => ({
                name: String(propertyName),
                description: common_1.getPropertyDescription(context, propertyName, descriptionsType, descriptionsIntent),
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
        const context = model.contexts[contextName];
        const properties = common_1.getEntityProperties(context);
        const childrenNames = common_1.getChildren(contextName);
        zodWriter.writeObject({
            name: `${contextName}Entity`,
            description: common_1.getEntityDescription(context, descriptionsType, descriptionsIntent),
            properties: common_1.getObjectKeys(properties).map((propertyName) => ({
                name: String(propertyName),
                description: common_1.getPropertyDescription(context, propertyName, descriptionsType, descriptionsIntent),
                typeName: properties[propertyName].type,
                isOptional: properties[propertyName].optional,
                value: properties[propertyName].type === 'discriminator' ? `ContextTypes.enum.${contextName}` : undefined,
            })),
        });
        zodWriter.writeLine(';');
        zodWriter.writeLine();
        zodWriter.writeDiscriminatedUnion({
            name: contextName,
            description: common_1.getEntityDescription(context, descriptionsType, descriptionsIntent),
            discriminator: '_type',
            items: [
                {
                    properties: common_1.getObjectKeys(properties).map((propertyName) => ({
                        name: String(propertyName),
                        description: common_1.getPropertyDescription(context, propertyName, descriptionsType, descriptionsIntent),
                        typeName: properties[propertyName].type,
                        isOptional: properties[propertyName].optional,
                        value: properties[propertyName].type === 'discriminator' ? `ContextTypes.enum.${contextName}` : undefined,
                    })),
                },
                ...childrenNames,
            ],
        });
    });
    const allLocationContexts = common_1.getChildren(model.LocationStack.items.type).sort();
    const ChildLocationContexts = allLocationContexts.filter((context) => common_1.getChildren(context).length === 0);
    const ParentLocationContexts = allLocationContexts.filter((context) => common_1.getChildren(context).length > 0);
    zodWriter.writeArray({
        name: 'LocationStack',
        items: [...ChildLocationContexts, ...ParentLocationContexts.map((contextName) => `${contextName}Entity`)],
        discriminator: model.LocationStack.items.discriminator,
        description: common_1.getEntityDescription(model.LocationStack, descriptionsType, descriptionsIntent),
        rules: model.LocationStack.validation.rules,
    });
    const allGlobalContexts = common_1.getChildren(model.GlobalContexts.items.type).sort();
    const ChildGlobalContexts = allGlobalContexts.filter((context) => common_1.getChildren(context).length === 0);
    const ParentGlobalContexts = allGlobalContexts.filter((context) => common_1.getChildren(context).length > 0);
    zodWriter.writeArray({
        name: 'GlobalContexts',
        items: [...ChildGlobalContexts, ...ParentGlobalContexts.map((contextName) => `${contextName}Entity`)],
        discriminator: model.GlobalContexts.items.discriminator,
        description: common_1.getEntityDescription(model.GlobalContexts, descriptionsType, descriptionsIntent),
        rules: model.GlobalContexts.validation.rules,
    });
    common_1.filterAbstractNames(common_1.getEventNames()).forEach((eventName) => {
        var _a;
        const event = model.events[eventName];
        const properties = common_1.getEntityProperties(event);
        zodWriter.writeObject({
            name: eventName,
            description: common_1.getEntityDescription(event, descriptionsType, descriptionsIntent),
            properties: common_1.getObjectKeys(properties).map((propertyName) => ({
                name: String(propertyName),
                description: common_1.getPropertyDescription(event, propertyName, descriptionsType, descriptionsIntent),
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
};
templating_1.Generator.generateFromModel({ outputFile: `../../validator/validator-v${schemaVersion}.js` }, validatorGenerator);
templating_1.Generator.generateFromModel({ outputFile: `../../validator/validator.js` }, validatorGenerator);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdG9yLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBS0Esc0RBQWtEO0FBQ2xELDhFQUE4QztBQUM5QyxvREFBaUQ7QUFDakQscUNBVWtCO0FBRWxCLE1BQU0sYUFBYSxHQUFHLDBCQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUNuRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztBQUNoQyxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztBQUVyQyxNQUFNLGtCQUFrQixHQUFHLENBQUMsTUFBa0IsRUFBRSxLQUFzQixFQUFFLEVBQUU7SUFDeEUsTUFBTSxTQUFTLEdBQUcsSUFBSSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBR3hDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN6QixJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsd0JBQWUsQ0FBQyxzQkFBYSxDQUFDLDBCQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RixXQUFXLEVBQUUsZ0RBQWdEO0tBQzlELENBQUMsQ0FBQztJQUdILFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN6QixJQUFJLEVBQUUsWUFBWTtRQUNsQixPQUFPLEVBQUUsd0JBQWUsQ0FBQyxzQkFBYSxDQUFDLDBCQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxRixXQUFXLEVBQUUsOENBQThDO0tBQzVELENBQUMsQ0FBQztJQUdILE1BQU0sV0FBVyxHQUFHLDRCQUFtQixDQUFDLHdCQUFl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