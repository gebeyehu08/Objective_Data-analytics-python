'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m) if (p !== 'default' && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.SchemaWriter = void 0;
const typescript_1 = require('@yellicode/typescript');
const common_1 = require('../templates/common');
class SchemaWriter extends typescript_1.TypeScriptWriter {
  constructor(writer) {
    super(writer);
    this.indentString = '  ';
    common_1.writeCopyright(this);
  }
}
exports.SchemaWriter = SchemaWriter;
__exportStar(require('@yellicode/typescript'), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2NoZW1hV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2NoZW1hV3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFLQSxzREFBeUQ7QUFDekQsZ0RBQXFEO0FBRXJELE1BQWEsWUFBYSxTQUFRLDZCQUFnQjtJQUNoRCxZQUFZLE1BQWtCO1FBQzVCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLHVCQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsQ0FBQztDQUNGO0FBTkQsb0NBTUM7QUFFRCx3REFBc0MifQ==
