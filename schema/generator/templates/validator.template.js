"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const common_1 = require("./common");
const ZodWriter_1 = require("../writers/ZodWriter");
templating_1.Generator.generateFromModel({ outputFile: '../generated/validator.js' }, (writer, model) => {
    const zod = new ZodWriter_1.ZodWriter(writer);
    zod.writeEnumeration({
        export: true,
        name: "ContextTypes",
        members: common_1.sortEnumMembers(common_1.getObjectKeys(model.contexts).map((_type) => ({ name: _type })))
    });
    zod.writeLine();
    zod.writeEnumeration({
        export: true,
        name: "EventTypes",
        members: common_1.sortEnumMembers(common_1.getObjectKeys(model.events).map((_type) => ({ name: _type })))
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdG9yLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBRWxELHFDQUEwRDtBQUMxRCxvREFBdUU7QUFFdkUsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSwyQkFBMkIsRUFBRSxFQUFFLENBQUMsTUFBa0IsRUFBRSxLQUFzQixFQUFFLEVBQUU7SUFDdEgsTUFBTSxHQUFHLEdBQUcsSUFBSSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWxDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNuQixNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSx3QkFBZSxDQUF1QixzQkFBYSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9HLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUVoQixHQUFHLENBQUMsZ0JBQWdCLENBQUM7UUFDbkIsTUFBTSxFQUFFLElBQUk7UUFDWixJQUFJLEVBQUUsWUFBWTtRQUNsQixPQUFPLEVBQUUsd0JBQWUsQ0FBdUIsc0JBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQztLQUM3RyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9