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
                value: property.value,
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
                value: property.value,
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
                        value: property.value,
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
                value: property.value,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdG9yLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLHNEQUFrRDtBQUNsRCx1Q0FBeUI7QUFDekIsZ0RBQXdCO0FBQ3hCLDhFQUE4QztBQUM5QyxrRUFBK0Q7QUFDL0Qsb0RBQWlEO0FBQ2pELHFDQUE2RDtBQUU3RCxNQUFNLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQztBQUMzQyxNQUFNLGFBQWEsR0FBRywwQkFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFDbkQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDaEMsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUM7QUFHckMsc0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxlQUFlLEdBQUcsYUFBYSxlQUFlLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUMzRyxNQUFNLFNBQVMsR0FBRyxJQUFJLHFCQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFHeEMsU0FBUyxDQUFDLFNBQVMsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBQzlELFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUd0QixTQUFTLENBQUMsZ0JBQWdCLENBQUM7UUFDekIsSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLG9CQUFXLEVBQUU7UUFDdEIsV0FBVyxFQUFFLGdEQUFnRDtLQUM5RCxDQUFDLENBQUM7SUFHSCxTQUFTLENBQUMsZ0JBQWdCLENBQUM7UUFDekIsSUFBSSxFQUFFLFlBQVk7UUFDbEIsT0FBTyxFQUFFLGtCQUFTLEVBQUU7UUFDcEIsV0FBVyxFQUFFLDhDQUE4QztLQUM1RCxDQUFDLENBQUM7SUFHSCxvQkFBVyxDQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENB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