'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.DocsWriter = void 0;
const core_1 = require('@yellicode/core');
const common_1 = require('../templates/common');
class DocsWriter extends core_1.CodeWriter {
  constructor(writer) {
    super(writer);
    this.indentString = '  ';
    common_1.writeCopyright(this);
  }
  writeH1(text) {
    this.writeLine('# ' + text);
  }
  writeH2(text) {
    this.writeLine('## ' + text);
  }
  writeH3(text) {
    this.writeLine('### ' + text);
  }
  writeListItem(text) {
    this.writeLine('* ' + text);
  }
  writeEmphasisLine(text, strong = false) {
    if (strong) this.writeLine('**' + text + '**');
    else this.writeLine('*' + text + '*');
  }
}
exports.DocsWriter = DocsWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jc1dyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkRvY3NXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsMENBQXlEO0FBQ3pELGdEQUFxRDtBQUVyRCxNQUFhLFVBQVcsU0FBUSxpQkFBVTtJQUN4QyxZQUFZLE1BQWtCO1FBQzVCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLHVCQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVNLE9BQU8sQ0FBQyxJQUFZO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxPQUFPLENBQUMsSUFBWTtRQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRU0sT0FBTyxDQUFDLElBQVk7UUFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFZO1FBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxJQUFZLEVBQUUsU0FBa0IsS0FBSztRQUMxRCxJQUFJLE1BQU07WUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBQyxJQUFJLEdBQUMsSUFBSSxDQUFDLENBQUM7O1lBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFDLElBQUksR0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0Y7QUEzQkQsZ0NBMkJDIn0=
