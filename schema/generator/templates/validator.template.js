"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const ValidatorWriter_1 = require("../writers/ValidatorWriter");
const common_1 = require("./common");
const SchemaToZodPropertyTypeMap = {
    integer: 'bigint',
    literal: 'literal',
    string: 'string',
};
templating_1.Generator.generateFromModel({ outputFile: '../generated/validator.js' }, (writer, model) => {
    const validator = new ValidatorWriter_1.ValidatorWriter(writer);
    common_1.writeEnumerations(validator);
    const getEntityProperties = (entity) => { var _a; return (_a = entity['properties']) !== null && _a !== void 0 ? _a : {}; };
    const getEntityParents = (entity) => { var _a; return (_a = entity['parents']) !== null && _a !== void 0 ? _a : []; };
    const getEntityRequiresContext = (entity) => { var _a; return (_a = entity['requiresContext']) !== null && _a !== void 0 ? _a : []; };
    const getParentAttributes = (parents, attributes = { properties: {} }) => parents.reduce((parentAttributes, parent) => {
        const parentProperties = getEntityProperties(model.contexts[parent]);
        const parentParents = getEntityParents(model.contexts[parent]);
        const parentPropertyKeys = common_1.getObjectKeys(parentProperties);
        parentPropertyKeys.forEach((parentPropertyKey) => {
            const parentProperty = parentProperties[parentPropertyKey];
            if (parentAttributes.properties[parentPropertyKey] === undefined) {
                parentAttributes.properties[parentPropertyKey] = parentProperty;
            }
        });
        if (!parentParents.length) {
            return parentAttributes;
        }
        return getParentAttributes(parentParents, parentAttributes);
    }, attributes);
    const getEntityAttributes = (entity) => {
        const parents = getEntityParents(entity);
        const properties = getEntityProperties(entity);
        return getParentAttributes(parents, { properties });
    };
    common_1.getObjectKeys(model.contexts)
        .filter((_type) => !_type.startsWith('Abstract'))
        .forEach((_type) => {
        const context = model.contexts[_type];
        const { properties } = getEntityAttributes(context);
        console.log(properties);
        validator.writeLine(`export const ${_type} = z.object({`);
        common_1.getObjectKeys(properties).forEach((property) => {
            var _a;
            validator.writeProperty({
                name: String(property),
                typeName: SchemaToZodPropertyTypeMap[properties[property].type],
                isOptional: properties[property].isOptional,
                value: ((_a = properties[property].value) !== null && _a !== void 0 ? _a : '').replace('${entityName}', _type),
            });
        });
        validator.writeLine(`});\n`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdG9yLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBRWxELGdFQUE2RDtBQUM3RCxxQ0FBNEQ7QUFFNUQsTUFBTSwwQkFBMEIsR0FBRztJQUNqQyxPQUFPLEVBQUUsUUFBUTtJQUNqQixPQUFPLEVBQUUsU0FBUztJQUNsQixNQUFNLEVBQUUsUUFBUTtDQUNqQixDQUFDO0FBRUYsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FDekIsRUFBRSxVQUFVLEVBQUUsMkJBQTJCLEVBQUUsRUFDM0MsQ0FBQyxNQUFrQixFQUFFLEtBQXNCLEVBQUUsRUFBRTtJQUM3QyxNQUFNLFNBQVMsR0FBRyxJQUFJLGlDQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFOUMsMEJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFN0IsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLHdCQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsbUNBQUksRUFBRSxHQUFBLENBQUM7SUFDbkUsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLHdCQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsbUNBQUksRUFBRSxHQUFBLENBQUM7SUFDN0QsTUFBTSx3QkFBd0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLHdCQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxtQ0FBSSxFQUFFLEdBQUEsQ0FBQztJQUc3RSxNQUFNLG1CQUFtQixHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsR0FBRyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQ3ZFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUMxQyxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxRQUFRLENB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