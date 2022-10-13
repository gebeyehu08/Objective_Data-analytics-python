"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const fs = __importStar(require("fs"));
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
                value: common_1.getPropertyValue(contextName, properties[propertyName]),
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
                value: common_1.getPropertyValue(contextName, properties[propertyName]),
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
                        value: common_1.getPropertyValue(contextName, properties[propertyName]),
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
                value: common_1.getPropertyValue(eventName, properties[propertyName]),
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
    const validatorFiles = glob_1.default.sync(`${validatorFolder}/*/`, { ignore: '../../validator/**/node_modules' });
    validatorFiles.forEach((validator) => {
        const validatorVersion = validator.replace(`${validatorFolder}`, '').replace('/', '');
        jsWriter.writeLine(`versions.push('${validatorVersion}');`);
    });
});
templating_1.Generator.generate({ outputFile: `${validatorFolder}${schemaVersion}/validator.test.js` }, (writer) => {
    const jsWriter = new JavaScriptWriter_1.JavaScriptWriter(writer);
    jsWriter.writeFile('validator-test.template.js');
});
const packageJsonPath = `${validatorFolder}${schemaVersion}/package.json`;
templating_1.Generator.generate({ outputFile: packageJsonPath }, (writer) => {
    writer.writeFile('validator-package_json.template.json');
    fs.readFile(packageJsonPath, 'utf8', function (err, data) {
        fs.writeFileSync(packageJsonPath, data.replace(/{{schemaVersion}}/g, schemaVersion));
    });
});
fs.copyFileSync('../../base_schema.json', `${validatorFolder}${schemaVersion}/base_schema.json`);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdG9yLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLHNEQUFrRDtBQUNsRCx1Q0FBeUI7QUFDekIsOEVBQThDO0FBQzlDLGtFQUErRDtBQUMvRCxvREFBaUQ7QUFDakQsZ0RBQXdCO0FBQ3hCLHFDQVVrQjtBQUVsQixNQUFNLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQztBQUMzQyxNQUFNLGFBQWEsR0FBRywwQkFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFDbkQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDaEMsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUM7QUFHckMsc0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxlQUFlLEdBQUcsYUFBYSxlQUFlLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUMzRyxNQUFNLFNBQVMsR0FBRyxJQUFJLHFCQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFHeEMsU0FBUyxDQUFDLGdCQUFnQixDQUFDO1FBQ3pCLElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSx3QkFBZSxDQUFDLHNCQUFhLENBQUMsMEJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVGLFdBQVcsRUFBRSxnREFBZ0Q7S0FDOUQsQ0FBQyxDQUFDO0lBR0gsU0FBUyxDQUFDLGdCQUFnQixDQUFDO1FBQ3pCLElBQUksRUFBRSxZQUFZO1FBQ2xCLE9BQU8sRUFBRSx3QkFBZSxDQUFDLHNCQUFhLENBQUMsMEJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVB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