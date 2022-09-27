"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorWriter = void 0;
const core_1 = require("@yellicode/core");
class ValidatorWriter extends core_1.CodeWriter {
  constructor(writer) {
    super(writer);
    this.writeLine(
      `/*\n* Copyright ${new Date().getFullYear()} Objectiv B.V.\n*/\n`
    );
    this.writeLine('import { z } from "zod";\n');
  }
  writeEnumeration(enumeration) {
    enumeration.export && this.write("export ");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsaWRhdG9yV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVmFsaWRhdG9yV3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLDBDQUF5RDtBQVl6RCxNQUFhLGVBQWdCLFNBQVEsaUJBQVU7SUFDN0MsWUFBWSxNQUFrQjtRQUM1QixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtJQUM5QyxDQUFDO0lBRU0sZ0JBQWdCLENBQUMsV0FBd0I7UUFDOUMsV0FBVyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxXQUFXLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEIsQ0FBQztDQUNGO0FBakJELDBDQWlCQyJ9
