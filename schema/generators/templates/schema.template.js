"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@yellicode/core");
const templating_1 = require("@yellicode/templating");
const TypescriptWriter_1 = require("../writers/TypescriptWriter");
const parser_1 = require("./parser");
const descriptionsType = 'text';
const descriptionsTarget = 'primary';
templating_1.Generator.generateFromModel({ outputFile: '../generated/schema/abstracts.ts' }, (writer) => {
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
                    description: ['An internal unique identifier used to compare instances of the same type.']
                });
            }
            if (entity._parent && entity.isParent && entity.isContext) {
                tsWriter.writeProperty({
                    name: `__${core_1.NameUtility.camelToKebabCase(entity.name).replace(/-/g, '_').replace('abstract_', '')}`,
                    typeName: 'true',
                    description: ['An internal discriminator relating entities of the same hierarchical branch.']
                });
            }
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
        LocationStack: 'Array<AbstractLocationContext>',
        GlobalContexts: 'Array<AbstractGlobalContext>',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZW1hLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsMENBQTBEO0FBQzFELHNEQUFrRDtBQUNsRCxrRUFBK0Q7QUFDL0QscUNBQXVDO0FBRXZDLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBQ2hDLE1BQU0sa0JBQWtCLEdBQUcsU0FBUyxDQUFDO0FBRXJDLHNCQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRSxVQUFVLEVBQUUsa0NBQWtDLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUNyRyxNQUFNLFFBQVEsR0FBRyxJQUFJLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTlDLG9CQUFXLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1FBQ25FLFFBQVEsQ0FBQyxtQkFBbUIsQ0FDMUI7WUFDRSxNQUFNLEVBQUUsSUFBSTtZQUNaLFdBQVcsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUN0RyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7WUFDakIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1NBQ3ZELEVBQ0QsQ0FBQyxRQUEwQixFQUFFLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtnQkFDdkMsUUFBUSxDQUFDLGFBQWEsQ0FBQztvQkFDckIsSUFBSSxFQUFFLGVBQWU7b0JBQ3JCLFFBQVEsRUFBRSxRQUFRO29CQUNsQixXQUFXLEVBQUUsQ0FBQywyRUFBMkUsQ0FBQztpQkFDM0YsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUN6RCxRQUFRLENBQUMsYUFBYSxDQUFDO29CQUNyQixJQUFJLEVBQUUsS0FBSyxrQkFBVyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUU7b0JBQ2xHLFFBQVEsRUFBRSxNQUFNO29CQUNoQixXQUFXLEVBQUUsQ0FBQyw4RUFBOEUsQ0FBQztpQkFDOUYsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQ3hDLFFBQVEsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQ3JFLENBQUM7UUFDSixDQUFDLENBQ0YsQ0FBQztRQUNGLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUM1QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRTtJQUN0RCxNQUFNLFFBQVEsR0FBRztRQUNmLE9BQU8sRUFBRSxRQUFRO1FBQ2pCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLElBQUksRUFBRSxRQUFRO1FBQ2QsS0FBSyxFQUFFLE9BQU87UUFDZCxhQUFhLEVBQUUsZ0NBQWdDO1FBQy9DLGNBQWMsRUFBRSw4QkFBOEI7S0FDL0MsQ0FBQztJQUVGLElBQUksVUFBVSxDQUFDO0lBQ2YsUUFBUSxRQUFRLENBQUMsSUFBSSxFQUFFO1FBQ3JCLEtBQUssZUFBZTtZQUNsQixJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUU7Z0JBQ3JCLFVBQVUsR0FBRyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2FBQzlFO2lCQUFNO2dCQUNMLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQzthQUNqQztZQUNELE1BQU07UUFDUixLQUFLLE9BQU87WUFDVixVQUFVLEdBQUcsU0FBUyxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUM7WUFDeEMsTUFBTTtRQUNSO1lBQ0UsVUFBVSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDeEM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO1FBQ25CLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDN0MsUUFBUSxFQUFFLFVBQVU7UUFDcEIsVUFBVSxFQUFFLFFBQVEsQ0FBQyxRQUFRO1FBQzdCLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxRQUFRO0tBQ3BDLENBQUM7QUFDSixDQUFDLENBQUMifQ==