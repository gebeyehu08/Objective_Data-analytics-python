'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const templating_1 = require('@yellicode/templating');
const ValidatorWriter_1 = require('../writers/ValidatorWriter');
const common_1 = require('./common');
const SchemaToZodPropertyTypeMap = {
  integer: 'bigint',
  literal: 'literal',
  string: 'string',
};
templating_1.Generator.generateFromModel({ outputFile: '../generated/validator.js' }, (writer, model) => {
  const validator = new ValidatorWriter_1.ValidatorWriter(writer);
  common_1.writeEnumerations(validator);
  common_1.getContexts().forEach((contextName) => {
    const { properties } = common_1.getEntityAttributes(model.contexts, contextName);
    validator.writeLine(`export const ${contextName} = z.object({`);
    common_1.getObjectKeys(properties).forEach((property) => {
      var _a;
      validator.writeProperty({
        name: String(property),
        typeName: SchemaToZodPropertyTypeMap[properties[property].type],
        isOptional: properties[property].optional,
        value: ((_a = properties[property].value) !== null && _a !== void 0 ? _a : '').replace(
          '${contextName}',
          `ContextTypes.enum.${contextName}`
        ),
      });
    });
    validator.writeLine(`});\n`);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdG9yLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBRWxELGdFQUE2RDtBQUM3RCxxQ0FBOEY7QUFFOUYsTUFBTSwwQkFBMEIsR0FBRztJQUNqQyxPQUFPLEVBQUUsUUFBUTtJQUNqQixPQUFPLEVBQUUsU0FBUztJQUNsQixNQUFNLEVBQUUsUUFBUTtDQUNqQixDQUFDO0FBRUYsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FDekIsRUFBRSxVQUFVLEVBQUUsMkJBQTJCLEVBQUUsRUFDM0MsQ0FBQyxNQUFrQixFQUFFLEtBQXNCLEVBQUUsRUFBRTtJQUM3QyxNQUFNLFNBQVMsR0FBRyxJQUFJLGlDQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFOUMsMEJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFHN0Isb0JBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO1FBQ3BDLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyw0QkFBbUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXhFLFNBQVMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLFdBQVcsZUFBZSxDQUFDLENBQUM7UUFFaEUsc0JBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTs7WUFDN0MsU0FBUyxDQUFDLGFBQWEsQ0FBQztnQkFDdEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBQ3RCLFFBQVEsRUFBRSwwQkFBMEIsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMvRCxVQUFVLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVE7Z0JBQ3pDLEtBQUssRUFBRSxPQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLG1DQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsV0FBVyxFQUFFLENBQUM7YUFDeEcsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUNGLENBQUMifQ==
