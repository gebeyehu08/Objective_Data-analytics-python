"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@yellicode/core");
const templating_1 = require("@yellicode/templating");
const TypeScriptWriter_1 = require("../writers/TypeScriptWriter");
const parser_1 = require("./parser");
const destinationFolder = '../../../tracker/core/schema/src/generated/';
const descriptionsType = 'text';
const descriptionsTarget = 'primary';
templating_1.Generator.generate({ outputFile: `${destinationFolder}types.ts` }, (writer) => {
    const tsWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
    const types = parser_1.getEntities({ isType: true });
    tsWriter.writeImports('./abstracts', types.map(type => type.items.type));
    tsWriter.writeEndOfLine();
    types.forEach((type) => {
        tsWriter.writeTypeDefinition({
            export: true,
            description: type.getDescription({ type: descriptionsType, target: descriptionsTarget }).split('\n'),
            name: type.name,
            typeName: type.type,
            typeValue: type.items.type
        });
        tsWriter.writeEndOfLine();
    });
});
templating_1.Generator.generate({ outputFile: `${destinationFolder}abstracts.ts` }, (writer) => {
    const tsWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
    parser_1.getEntities({ isAbstract: true, sortBy: 'name' }).forEach((entity) => {
        tsWriter.writeInterfaceBlock({
            export: true,
            description: entity.getDescription({ type: descriptionsType, target: descriptionsTarget }).split('\n'),
            name: entity.name,
            extends: entity._parent ? [entity._parent] : undefined,
        }, (tsWriter) => {
            if (!entity._parent) {
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
templating_1.Generator.generate({ outputFile: `${destinationFolder}events.ts` }, (writer) => {
    const tsWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
    tsWriter.writeImports('./abstracts', ['AbstractEvent']);
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
templating_1.Generator.generate({ outputFile: `${destinationFolder}contexts.ts` }, (writer) => {
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
    var _a;
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
        isOptional: (_a = property.nullable) !== null && _a !== void 0 ? _a : property.optional,
        hasNullUnionType: property.nullable,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZW1hLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsMENBQTBEO0FBQzFELHNEQUFrRDtBQUNsRCxrRUFBK0Q7QUFDL0QscUNBQStEO0FBRS9ELE1BQU0saUJBQWlCLEdBQUcsNkNBQTZDLENBQUM7QUFDeEUsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDaEMsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUM7QUFFckMsc0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxpQkFBaUIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDeEYsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QyxNQUFNLEtBQUssR0FBRyxvQkFBVyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFFNUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUV6RSxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7SUFFMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ3JCLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQztZQUMzQixNQUFNLEVBQUUsSUFBSTtZQUNaLFdBQVcsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNwRyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDbkIs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