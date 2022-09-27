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
}
exports.ValidatorWriter = ValidatorWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsaWRhdG9yV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVmFsaWRhdG9yV3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLDBDQUF5RDtBQUN6RCxnREFBcUQ7QUFZckQsTUFBYSxlQUFnQixTQUFRLGlCQUFVO0lBQzdDLFlBQVksTUFBa0I7UUFDNUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsdUJBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVNLGdCQUFnQixDQUFDLFdBQXdCO1FBQzlDLFdBQVcsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsV0FBVyxDQUFDLElBQUksYUFBYSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEIsQ0FBQztDQUNGO0FBbEJELDBDQWtCQyJ9
