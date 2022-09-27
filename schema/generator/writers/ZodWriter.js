"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodWriter = void 0;
const core_1 = require("@yellicode/core");
class ZodWriter extends core_1.CodeWriter {
    constructor(writer) {
        super(writer);
        this.writeLine(`/*\n* Copyright ${new Date().getFullYear()} Objectiv B.V.\n*/\n`);
        this.writeLine('import { z } from "zod";\n');
    }
    writeEnumeration(enumeration) {
        enumeration.export && this.write('export ');
        this.writeLine(`const ${enumeration.name} = z.enum([`);
        this.increaseIndent();
        enumeration.members.forEach(members => {
            this.writeLine(`"${members.name}",`);
        });
        this.decreaseIndent();
        this.writeLine(`]);`);
    }
}
exports.ZodWriter = ZodWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWm9kV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiWm9kV3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLDBDQUF5RDtBQVl6RCxNQUFhLFNBQVUsU0FBUSxpQkFBVTtJQUN2QyxZQUFZLE1BQWtCO1FBQzVCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLHNCQUFzQixDQUFDLENBQUM7UUFDbEYsSUFBSSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO0lBQzlDLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxXQUF3QjtRQUM5QyxXQUFXLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLFdBQVcsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QixDQUFDO0NBQ0Y7QUFqQkQsOEJBaUJDIn0=