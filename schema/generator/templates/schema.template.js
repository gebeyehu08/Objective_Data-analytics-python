"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const common_1 = require("./common");
const SchemaWriter_1 = require("../writers/SchemaWriter");
templating_1.Generator.generateFromModel({ outputFile: '../generated/schema.ts' }, (writer, model) => {
    const ts = new SchemaWriter_1.SchemaWriter(writer);
    ts.writeEnumeration({
        export: true,
        name: "ContextTypes",
        members: common_1.sortEnumMembers(common_1.getObjectKeys(model.contexts).map((_type) => ({ name: _type })))
    });
    ts.writeLine();
    ts.writeEnumeration({
        export: true,
        name: "EventTypes",
        members: common_1.sortEnumMembers(common_1.getObjectKeys(model.events).map((_type) => ({ name: _type })))
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZW1hLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBRWxELHFDQUEwRDtBQUMxRCwwREFBNkU7QUFFN0Usc0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSx3QkFBd0IsRUFBRSxFQUFFLENBQUMsTUFBa0IsRUFBRSxLQUFzQixFQUFFLEVBQUU7SUFDbkgsTUFBTSxFQUFFLEdBQUcsSUFBSSwyQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXBDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNsQixNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSx3QkFBZSxDQUF1QixzQkFBYSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9HLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUVmLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNsQixNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxZQUFZO1FBQ2xCLE9BQU8sRUFBRSx3QkFBZSxDQUF1QixzQkFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzdHLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=