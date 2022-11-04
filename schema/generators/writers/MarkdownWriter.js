'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.MarkdownWriter = void 0;
const core_1 = require('@yellicode/core');
class MarkdownWriter extends core_1.CodeWriter {
  constructor(writer) {
    super(writer);
    this.indentString = '  ';
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
exports.MarkdownWriter = MarkdownWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFya2Rvd25Xcml0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJNYXJrZG93bldyaXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSwwQ0FBeUQ7QUFFekQsTUFBYSxjQUFlLFNBQVEsaUJBQVU7SUFDNUMsWUFBWSxNQUFrQjtRQUM1QixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUUzQixDQUFDO0lBRU0sT0FBTyxDQUFDLElBQVk7UUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLE9BQU8sQ0FBQyxJQUFZO1FBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTSxPQUFPLENBQUMsSUFBWTtRQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU0sYUFBYSxDQUFDLElBQVk7UUFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLGlCQUFpQixDQUFDLElBQVksRUFBRSxTQUFrQixLQUFLO1FBQzVELElBQUksTUFBTTtZQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQzs7WUFDMUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FDRjtBQTNCRCx3Q0EyQkMifQ==
