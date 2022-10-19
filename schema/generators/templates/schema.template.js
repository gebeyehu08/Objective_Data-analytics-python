"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@yellicode/core");
const templating_1 = require("@yellicode/templating");
const TypescriptWriter_1 = require("../writers/TypescriptWriter");
const parser_1 = require("./parser");
const descriptionsType = 'text';
const descriptionsTarget = 'primary';
templating_1.Generator.generate({ outputFile: '../generated/schema/abstracts.ts' }, (writer) => {
    const tsWriter = new TypescriptWriter_1.TypeScriptWriter(writer);
    parser_1.getEntities({ isAbstract: true, sortBy: 'name' }).forEach((entity) => {
        tsWriter.writeInterfaceBlock({
            export: true,
            description: entity.getDescription({ type: descriptionsType, target: descriptionsTarget }).split('\n'),
            name: entity.name,
            extends: entity._parent ? [entity._parent] : undefined,
        }, (tsWriter) => {
            if (!entity._parent && entity.isContext) {
                tsWriter.writeProperty({
                    name: '__instance_id',
                    typeName: 'string',
                    description: ['An internal unique identifier used to compare instances with the same _type & id.'],
                });
            }
            if (entity._parent && entity.isParent && entity.isContext) {
                tsWriter.writeProperty({
                    name: `__${core_1.NameUtility.camelToKebabCase(entity.name).replace(/-/g, '_').replace('abstract_', '')}`,
                    typeName: 'true',
                    description: ['An internal discriminator relating entities of the same hierarchical branch.'],
                });
            }
            entity.ownProperties.forEach((property) => tsWriter.writeProperty(schemaToTypeScriptProperty(tsWriter, entity, property)));
        });
        tsWriter.writeEndOfLine();
    });
});
templating_1.Generator.generate({ outputFile: '../generated/schema/events.ts' }, (writer) => {
    const tsWriter = new TypescriptWriter_1.TypeScriptWriter(writer);
    tsWriter.writeImports('./abstracts', ['AbstractEvent', 'AbstractLocationContext']);
    parser_1.getEvents({ isAbstract: false, sortBy: 'name' }).forEach((entity) => {
        tsWriter.writeInterfaceBlock({
            export: true,
            description: entity.getDescription({ type: descriptionsType, target: descriptionsTarget }).split('\n'),
            name: entity.name,
            extends: entity._parent ? [entity._parent] : undefined,
        }, (tsWriter) => {
            tsWriter.writeProperty(schemaToTypeScriptProperty(tsWriter, entity, {
                name: `_type`,
                type: 'discriminator',
                description: 'A string literal used during serialization. Hardcoded to the Event name.',
            }));
            if (entity._parent && entity.isParent) {
                tsWriter.writeProperty({
                    name: `__${core_1.NameUtility.camelToKebabCase(entity.name).replace(/-/g, '_').replace('abstract_', '')}`,
                    typeName: 'true',
                    description: ['An internal discriminator relating entities of the same hierarchical branch.'],
                });
            }
            entity.ownProperties.forEach((property) => tsWriter.writeProperty(schemaToTypeScriptProperty(tsWriter, entity, property)));
        });
        tsWriter.writeEndOfLine();
    });
});
const schemaToTypeScriptProperty = (tsWriter, entity, property) => {
    const typesMap = {
        integer: 'number',
        string: 'string',
        uuid: 'string',
        array: 'Array',
        LocationStack: 'Array<AbstractLocationContext>',
        GlobalContexts: 'Array<AbstractGlobalContext>',
    };
    let mappedType;
    switch (property.type) {
        case 'discriminator':
            if (entity.isParent) {
                const entityNames = entity.children.map(({ name }) => `'${name}'`);
                const indent = tsWriter.indentString.repeat(2);
                if (!entity.isAbstract) {
                    entityNames.unshift(`'${entity.name}'`);
                }
                mappedType = `\n${indent}| ${entityNames.join(`\n${indent}| `)}`;
            }
            else {
                mappedType = `'${entity.name}'`;
            }
            break;
        case 'array':
            mappedType = `Array<${property.value}>`;
            break;
        default:
            mappedType = typesMap[property.type];
    }
    return {
        name: property.name,
        description: property.description.split('\n'),
        typeName: mappedType,
        isOptional: property.optional,
        hasNullUnionType: property.nullable,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZW1hLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsMENBQTBEO0FBQzFELHNEQUFrRDtBQUNsRCxrRUFBK0Q7QUFDL0QscUNBQWtEO0FBRWxELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBQ2hDLE1BQU0sa0JBQWtCLEdBQUcsU0FBUyxDQUFDO0FBRXJDLHNCQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLGtDQUFrQyxFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDNUYsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU5QyxvQkFBVyxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUNuRSxRQUFRLENBQUMsbUJBQW1CLENBQzFCO1lBQ0UsTUFBTSxFQUFFLElBQUk7WUFDWixXQUFXLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDdEcsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztTQUN2RCxFQUNELENBQUMsUUFBMEIsRUFBRSxFQUFFO1lBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Z0JBQ3ZDLFFBQVEsQ0FBQyxhQUFhLENBQUM7b0JBQ3JCLElBQUksRUFBRSxlQUFlO29CQUNyQixRQUFR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