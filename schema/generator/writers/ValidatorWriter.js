'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ValidatorWriter = void 0;
const core_1 = require('@yellicode/core');
const common_1 = require('../templates/common');
class ValidatorWriter extends core_1.CodeWriter {
  constructor(writer) {
    super(writer);
    this.indentString = '  ';
    common_1.writeCopyright(this);
    this.writeLine('import { z } from "zod";\n');
  }
  writeEnumeration(enumeration) {
    enumeration.export && this.write('export ');
    this.writeLine(`const ${enumeration.name} = z.enum([`);
    this.increaseIndent();
    enumeration.members.forEach((members) => {
      this.writeLine(`"${members.name}",`);
    });
    this.decreaseIndent();
    this.writeLine(`]);`);
  }
  writeProperty(property) {
    var _a;
    this.increaseIndent();
    this.writeIndent();
    this.write(
      `${property.name}: z.${property.typeName}(${(_a = property.value) !== null && _a !== void 0 ? _a : ''})`
    );
    if (property.isOptional) {
      this.write('.optional()');
    }
    this.writeEndOfLine(',');
    this.decreaseIndent();
  }
}
exports.ValidatorWriter = ValidatorWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsaWRhdG9yV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVmFsaWRhdG9yV3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLDBDQUF5RDtBQUN6RCxnREFBcUQ7QUFtQnJELE1BQWEsZUFBZ0IsU0FBUSxpQkFBVTtJQUM3QyxZQUFZLE1BQWtCO1FBQzVCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLHVCQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxXQUF3QjtRQUM5QyxXQUFXLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLFdBQVcsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFTSxhQUFhLENBQUMsUUFBNEI7O1FBRS9DLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFHbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLE9BQU8sUUFBUSxDQUFDLFFBQVEsSUFBSSxNQUFBLFFBQVEsQ0FBQyxLQUFLLG1DQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFaEYsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDM0I7UUFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDO0NBQ0Y7QUFsQ0QsMENBa0NDIn0=
