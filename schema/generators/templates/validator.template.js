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
    zodWriter.writeFile('fragments/validator.template.static.ts');
    zodWriter.writeLine();
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
    jsWriter.writeFile('fragments/validator-common.template.ts');
    jsWriter.writeEndOfLine();
    const validatorFiles = glob_1.default.sync(`${validatorFolder}/*/`, { ignore: '../../validator/**/node_modules' });
    validatorFiles.forEach((validator) => {
        const validatorVersion = validator.replace(`${validatorFolder}`, '').replace('/', '');
        jsWriter.writeLine(`versions.push('${validatorVersion}');`);
    });
});
templating_1.Generator.generate({ outputFile: `${validatorFolder}${schemaVersion}/validator.test.js` }, (writer) => {
    const jsWriter = new JavaScriptWriter_1.JavaScriptWriter(writer);
    jsWriter.writeFile('fragments/validator-test.template.js');
});
const packageJsonPath = `${validatorFolder}${schemaVersion}/package.json`;
templating_1.Generator.generate({ outputFile: packageJsonPath }, (writer) => {
    writer.writeFile('fragments/validator-package_json.template.json');
    fs.readFile(packageJsonPath, 'utf8', function (err, data) {
        fs.writeFileSync(packageJsonPath, data.replace(/{{schemaVersion}}/g, schemaVersion));
    });
});
fs.copyFileSync('../../base_schema.json', `${validatorFolder}${schemaVersion}/base_schema.json`);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdG9yLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLHNEQUFrRDtBQUNsRCx1Q0FBeUI7QUFDekIsOEVBQThDO0FBQzlDLGtFQUErRDtBQUMvRCxvREFBaUQ7QUFDakQsZ0RBQXdCO0FBQ3hCLHFDQVdrQjtBQUVsQixNQUFNLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQztBQUMzQyxNQUFNLGFBQWEsR0FBRywwQkFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFDbkQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDaEMsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUM7QUFHckMsc0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxlQUFlLEdBQUcsYUFBYSxlQUFlLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUMzRyxNQUFNLFNBQVMsR0FBRyxJQUFJLHFCQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFHeEMsU0FBUyxDQUFDLFNBQVMsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBQzlELFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUd0QixTQUFTLENBQUMsZ0JBQWdCLENBQUM7UUFDekIsSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLHdCQUFlLENBQUMsc0JBQWEsQ0FBQywwQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUYsV0FBVyxFQUFFLGdEQUFnRDtLQUM5RCxDQUFDLENBQUM7SUFHSCxTQUFTLENBQUMsZ0JBQWdCLENBQUM7UUFDekIsSUFBSSxFQUFFLFlBQVk7UUFDbEIsT0FBTyxF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