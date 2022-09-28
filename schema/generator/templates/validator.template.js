'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const templating_1 = require('@yellicode/templating');
const ValidatorWriter_1 = require('../writers/ValidatorWriter');
const common_1 = require('./common');
const SchemaToZodPropertyTypeMap = {
  integer: 'bigint',
  literal: 'literal',
  string: 'string',
  discriminator: 'literal',
};
templating_1.Generator.generateFromModel({ outputFile: '../generated/validator.js' }, (writer, model) => {
  const validatorWriter = new ValidatorWriter_1.ValidatorWriter(writer);
  common_1.writeEnumerations(validatorWriter);
  common_1.getContexts().forEach((contextName) => {
    const { properties } = common_1.getEntityAttributes(model.contexts, contextName);
    validatorWriter.writeLine(`export const ${contextName} = z.object({`);
    common_1.getObjectKeys(properties).forEach((property) => {
      validatorWriter.writeProperty({
        name: String(property),
        typeName: SchemaToZodPropertyTypeMap[properties[property].type],
        isOptional: properties[property].optional,
        value: properties[property].type === 'discriminator' ? `ContextTypes.enum.${contextName}` : undefined,
      });
    });
    validatorWriter.writeLine(`});\n`);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdG9yLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBRWxELGdFQUE2RDtBQUM3RCxxQ0FBOEY7QUFFOUYsTUFBTSwwQkFBMEIsR0FBRztJQUNqQyxPQUFPLEVBQUUsUUFBUTtJQUNqQixPQUFPLEVBQUUsU0FBUztJQUNsQixNQUFNLEVBQUUsUUFBUTtJQUNoQixhQUFhLEVBQUUsU0FBUztDQUN6QixDQUFDO0FBRUYsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FDekIsRUFBRSxVQUFVLEVBQUUsMkJBQTJCLEVBQUUsRUFDM0MsQ0FBQyxNQUFrQixFQUFFLEtBQXNCLEVBQUUsRUFBRTtJQUM3QyxNQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFcEQsMEJBQWlCLENBQUMsZUFBZSxDQUFDLENBQUM7SUFHbkMsb0JBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO1FBQ3BDLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyw0QkFBbUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXhFLGVBQWUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLFdBQVcsZUFBZSxDQUFDLENBQUM7UUFFdEUsc0JBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUM3QyxlQUFlLENBQUMsYUFBYSxDQUFDO2dCQUM1QixJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDdEIsUUFBUSxFQUFFLDBCQUEwQixDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQy9ELFVBQVUsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUTtnQkFDekMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEtBQUksZUFBZSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7YUFDckcsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxlQUFlLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUNGLENBQUMifQ==
