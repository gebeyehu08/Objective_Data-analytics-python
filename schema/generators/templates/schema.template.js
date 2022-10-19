"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const TypescriptWriter_1 = require("../writers/TypescriptWriter");
const parser_1 = require("./parser");
const descriptionsType = 'text';
const descriptionsTarget = 'primary';
templating_1.Generator.generateFromModel({ outputFile: '../generated/schema.ts' }, (writer) => {
    const tsWriter = new TypescriptWriter_1.TypeScriptWriter(writer);
    parser_1.getEntities({ isAbstract: true, sortBy: 'name', include: ['LocationStack', 'GlobalContexts'] }).forEach((entity) => {
        tsWriter.writeInterfaceBlock({
            export: true,
            description: entity.getDescription({ type: descriptionsType, target: descriptionsTarget }).split('\n'),
            name: entity.name,
            extends: entity._parent ? [entity._parent] : undefined,
        }, (tsWriter) => {
            entity.ownProperties.forEach((property) => tsWriter.writeProperty(schemaToTypeScriptProperty(entity, property)));
        });
        tsWriter.writeEndOfLine();
    });
});
const schemaToTypeScriptProperty = (entity, property) => {
    const typesMap = {
        integer: 'number',
        string: 'string',
        uuid: 'string',
        array: 'Array',
        LocationStack: 'LocationStack',
        GlobalContexts: 'GlobalContexts',
    };
    let mappedType;
    switch (property.type) {
        case 'discriminator':
            if (entity.isAbstract) {
                mappedType = `${entity.children.map(({ name }) => `'${name}'`).join(' | ')}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZW1hLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBQ2xELGtFQUErRDtBQUMvRCxxQ0FBdUM7QUFFdkMsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDaEMsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUM7QUFFckMsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSx3QkFBd0IsRUFBRSxFQUFFLENBQUMsTUFBa0IsRUFBRSxFQUFFO0lBQzNGLE1BQU0sUUFBUSxHQUFHLElBQUksbUNBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFOUMsb0JBQVcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7UUFDakgsUUFBUSxDQUFDLG1CQUFtQixDQUMxQjtZQUNFLE1BQU0sRUFBRSxJQUFJO1lBQ1osV0FBVyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ3RHLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtZQUNqQixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7U0FDdkQsRUFDRCxDQUFDLFFBQTBCLEVBQUUsRUFBRTtZQUM3QixNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQ3hDLFFBQVEsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQ3JFLENBQUM7UUFDSixDQUFDLENBQ0YsQ0FBQztRQUNGLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUM1QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRTtJQUN0RCxNQUFNLFFBQVEsR0FBRztRQUNmLE9BQU8sRUFBRSxRQUFRO1FBQ2pCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLElBQUksRUFBRSxRQUFRO1FBQ2QsS0FBSyxFQUFFLE9BQU87UUFDZCxhQUFhLEVBQUUsZUFBZTtRQUM5QixjQUFjLEVBQUUsZ0JBQWdCO0tBQ2pDLENBQUM7SUFFRixJQUFJLFVBQVUsQ0FBQztJQUNmLFFBQVEsUUFBUSxDQUFDLElBQUksRUFBRTtRQUNyQixLQUFLLGVBQWU7WUFDbEIsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFO2dCQUNyQixVQUFVLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQzthQUM5RTtpQkFBTTtnQkFDTCxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUM7YUFDakM7WUFDRCxNQUFNO1FBQ1IsS0FBSyxPQUFPO1lBQ1YsVUFBVSxHQUFHLFNBQVMsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDO1lBQ3hDLE1BQU07UUFDUjtZQUNFLFVBQVUsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3hDO0lBRUQsT0FBTztRQUNMLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtRQUNuQixXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQzdDLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLFVBQVUsRUFBRSxRQUFRLENBQUMsUUFBUTtRQUM3QixnQkFBZ0IsRUFBRSxRQUFRLENBQUMsUUFBUTtLQUNwQyxDQUFDO0FBQ0osQ0FBQyxDQUFDIn0=