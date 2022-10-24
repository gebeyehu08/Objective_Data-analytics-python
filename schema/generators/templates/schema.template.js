"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@yellicode/core");
const templating_1 = require("@yellicode/templating");
const TypeScriptWriter_1 = require("../writers/TypeScriptWriter");
const parser_1 = require("./parser");
const descriptionsType = 'text';
const descriptionsTarget = 'primary';
templating_1.Generator.generate({ outputFile: '../generated/schema/abstracts.ts' }, (writer) => {
    const tsWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
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
    const tsWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
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
templating_1.Generator.generate({ outputFile: '../generated/schema/contexts.ts' }, (writer) => {
    const tsWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
    tsWriter.writeImports('./abstracts', ['AbstractGlobalContext', 'AbstractLocationContext']);
    parser_1.getContexts({ isAbstract: false, sortBy: 'name' }).forEach((entity) => {
        tsWriter.writeInterfaceBlock({
            export: true,
            description: entity.getDescription({ type: descriptionsType, target: descriptionsTarget }).split('\n'),
            name: entity.name,
            extends: entity._parent ? [entity._parent] : undefined,
        }, (tsWriter) => {
            tsWriter.writeProperty(schemaToTypeScriptProperty(tsWriter, entity, {
                name: `_type`,
                type: 'discriminator',
                description: 'A string literal used during serialization. Hardcoded to the Context name.',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZW1hLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsMENBQTBEO0FBQzFELHNEQUFrRDtBQUNsRCxrRUFBK0Q7QUFDL0QscUNBQStEO0FBRS9ELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBQ2hDLE1BQU0sa0JBQWtCLEdBQUcsU0FBUyxDQUFDO0FBRXJDLHNCQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLGtDQUFrQyxFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDNUYsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU5QyxvQkFBVyxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUNuRSxRQUFRLENBQUMsbUJBQW1CLENBQzFCO1lBQ0UsTUFBTSxFQUFFLElBQUk7WUFDWixXQUFXLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDdEcsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztTQUN2RCxFQUNELENBQUMsUUFBMEIsRUFBRSxFQUFFO1lBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Z0JBQ3ZDLFFBQVEsQ0FBQyxhQUFhLENBQUM7b0JBQ3JCLElBQUksRUFBRSxlQUFlO29CQUNyQixRQUFR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