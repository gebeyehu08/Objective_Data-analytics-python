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
const glob_1 = __importDefault(require("glob"));
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const JavaScriptWriter_1 = require("../writers/JavaScriptWriter");
const ZodWriter_1 = require("../writers/ZodWriter");
const common_1 = require("./common");
const parser_1 = require("./parser");
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
        members: parser_1.getContexts(),
        description: `Context's _type discriminator attribute values`,
    });
    zodWriter.writeEnumeration({
        name: 'EventTypes',
        members: parser_1.getEvents(),
        description: `Event's _type discriminator attribute values`,
    });
    parser_1.getContexts({ isAbstract: false, isParent: false }).forEach((context) => {
        zodWriter.writeObject({
            name: context.name,
            description: context.getDescription({ type: descriptionsType, target: descriptionsTarget }),
            properties: context.properties.map((property) => ({
                name: property.name,
                description: property.description,
                typeName: property.type,
                isNullable: property.nullable,
                isOptional: property.optional,
                value: common_1.getPropertyValue(context.name, property),
            })),
        });
        zodWriter.writeLine(';');
        zodWriter.writeLine();
    });
    parser_1.getContexts({ isAbstract: false, isParent: true }).forEach((context) => {
        zodWriter.writeObject({
            name: `${context.name}Entity`,
            description: context.getDescription({ type: descriptionsType, target: descriptionsTarget }),
            properties: context.properties.map((property) => ({
                name: property.name,
                description: property.description,
                typeName: property.type,
                isNullable: property.nullable,
                isOptional: property.optional,
                value: common_1.getPropertyValue(context.name, property),
            })),
        });
        zodWriter.writeLine(';');
        zodWriter.writeLine();
        zodWriter.writeDiscriminatedUnion({
            name: context.name,
            description: context.getDescription({ type: descriptionsType, target: descriptionsTarget }),
            discriminator: '_type',
            items: [
                {
                    properties: context.properties.map((property) => ({
                        name: property.name,
                        description: property.description,
                        typeName: property.type,
                        isNullable: property.nullable,
                        isOptional: property.optional,
                        value: common_1.getPropertyValue(context.name, property),
                    })),
                },
                ...context.children.map(({ name }) => name),
            ],
        });
    });
    const childLocationContextNames = parser_1.getContexts({ isLocationContext: true, isParent: false }).map(({ name }) => name);
    const parentLocationContextNames = parser_1.getContexts({ isLocationContext: true, isParent: true }).map(({ name }) => name);
    zodWriter.writeArray({
        name: 'LocationStack',
        items: [...childLocationContextNames, ...parentLocationContextNames.map((contextName) => `${contextName}Entity`)],
        discriminator: base_schema_json_1.default.LocationStack.items.discriminator,
        description: parser_1.getEntity('LocationStack').getDescription({ type: descriptionsType, target: descriptionsTarget }),
        rules: base_schema_json_1.default.LocationStack.validation.rules,
    });
    const childGlobalContextNames = parser_1.getContexts({ isGlobalContext: true, isParent: false }).map(({ name }) => name);
    const parentGlobalContextNames = parser_1.getContexts({ isGlobalContext: true, isParent: true }).map(({ name }) => name);
    zodWriter.writeArray({
        name: 'GlobalContexts',
        items: [...childGlobalContextNames, ...parentGlobalContextNames.map((contextName) => `${contextName}Entity`)],
        discriminator: base_schema_json_1.default.GlobalContexts.items.discriminator,
        description: parser_1.getEntity('GlobalContexts').getDescription({ type: descriptionsType, target: descriptionsTarget }),
        rules: base_schema_json_1.default.GlobalContexts.validation.rules,
    });
    parser_1.getEvents({ isAbstract: false }).forEach((event) => {
        var _a;
        zodWriter.writeObject({
            name: event.name,
            description: event.getDescription({ type: descriptionsType, target: descriptionsTarget }),
            properties: event.properties.map((property) => ({
                name: property.name,
                description: property.description,
                typeName: property.type,
                isNullable: property.nullable,
                isOptional: property.optional,
                value: common_1.getPropertyValue(event.name, property),
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
    parser_1.getContexts({ isAbstract: false }).forEach((context) => {
        zodWriter.writeLine(`'${context.name}': ${context.name},`);
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
    parser_1.getEvents({ isAbstract: false }).forEach((event) => zodWriter.writeLine(`${event.name},`));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdG9yLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLHNEQUFrRDtBQUNsRCx1Q0FBeUI7QUFDekIsZ0RBQXdCO0FBQ3hCLDhFQUE4QztBQUM5QyxrRUFBK0Q7QUFDL0Qsb0RBQWlEO0FBQ2pELHFDQUE0QztBQUM1QyxxQ0FBNkQ7QUFFN0QsTUFBTSxlQUFlLEdBQUcsa0JBQWtCLENBQUM7QUFDM0MsTUFBTSxhQUFhLEdBQUcsMEJBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQ25ELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBQ2hDLE1BQU0sa0JBQWtCLEdBQUcsU0FBUyxDQUFDO0FBR3JDLHNCQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsZUFBZSxHQUFHLGFBQWEsZUFBZSxFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDM0csTUFBTSxTQUFTLEdBQUcsSUFBSSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBR3hDLFNBQVMsQ0FBQyxTQUFTLENBQUMsd0NBQXdDLENBQUMsQ0FBQztJQUM5RCxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7SUFHdEIsU0FBUyxDQUFDLGdCQUFnQixDQUFDO1FBQ3pCLElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSxvQkFBVyxFQUFFO1FBQ3RCLFdBQVcsRUFBRSxnREFBZ0Q7S0FDOUQsQ0FBQyxDQUFDO0lBR0gsU0FBUyxDQUFDLGdCQUFnQixDQUFDO1FBQ3pCLElBQUksRUFBRSxZQUFZO1FBQ2xCLE9BQU8sRUFBRSxrQkFBUyxFQUFFO1FBQ3BCLFdBQVcsRUFBRSw4Q0FBOEM7S0FDNUQsQ0FBQyxDQUFDO0lBR0gsb0JBQVcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFF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