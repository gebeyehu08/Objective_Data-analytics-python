"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const ValidatorWriter_1 = require("../writers/ValidatorWriter");
const common_1 = require("./common");
templating_1.Generator.generateFromModel({ outputFile: '../generated/validator.js' }, (writer, model) => {
    const validator = new ValidatorWriter_1.ValidatorWriter(writer);
    common_1.writeEnumerations(validator, model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdG9yLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esc0RBQWtEO0FBRWxELGdFQUE2RDtBQUM3RCxxQ0FBNkM7QUFFN0Msc0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSwyQkFBMkIsRUFBRSxFQUFFLENBQUMsTUFBa0IsRUFBRSxLQUFzQixFQUFFLEVBQUU7SUFDdEgsTUFBTSxTQUFTLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTlDLDBCQUFpQixDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUMsQ0FBQyJ9