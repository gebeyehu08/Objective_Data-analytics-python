"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocusaurusWriter = void 0;
const core_1 = require("@yellicode/core");
class DocusaurusWriter extends core_1.CodeWriter {
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
    writeLink(text, url) {
        this.write('[' + text + '](' + url + ')');
    }
    writeRequiredContext(text, url) {
        this.writeLine('* [' + text + '](' + url + ').');
    }
    writeTableRow(columns, colLengths, startChar = " ", fillChar = " ", endChar = " ") {
        var _a;
        this.write('|');
        for (let i = 0; i < columns.length; i++) {
            let columnContent = (_a = columns[i]) !== null && _a !== void 0 ? _a : "";
            this.write(startChar + columnContent);
            let columnLength = columnContent.length;
            for (let k = 0; k < (colLengths[i] - columnLength); k++) {
                this.write(fillChar);
            }
            this.write(endChar + "|");
        }
        this.writeEndOfLine();
    }
    writeTable(columns, rows) {
        let columnLengths = [];
        columns.forEach((column) => {
            columnLengths.push(column.length);
        });
        rows.forEach((row) => {
            for (let i = 0; i < row.length; i++) {
                let columnContent = row[i];
                if (columnContent && (columnLengths[i] < columnContent.length)) {
                    columnLengths[i] = columnContent.length;
                }
                ;
            }
        });
        this.writeTableRow(columns, columnLengths);
        let headerSeperatorColumns = [];
        columns.forEach((column) => {
            headerSeperatorColumns.push("");
        });
        this.writeTableRow(headerSeperatorColumns, columnLengths, ":", "-", "-");
        rows.forEach((row) => {
            if (row.length > 0) {
                this.writeTableRow(row, columnLengths);
            }
        });
    }
    writeEmphasisLine(text, strong = false) {
        if (strong)
            this.writeLine('**' + text + '**');
        else
            this.writeLine('*' + text + '*');
    }
}
exports.DocusaurusWriter = DocusaurusWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdXNhdXJ1c1dyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkRvY3VzYXVydXNXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsMENBQXlEO0FBY3pELE1BQWEsZ0JBQWlCLFNBQVEsaUJBQVU7SUFDOUMsWUFBWSxNQUFrQjtRQUM1QixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUUzQixDQUFDO0lBRU0sT0FBTyxDQUFDLElBQVk7UUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLE9BQU8sQ0FBQyxJQUFZO1FBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTSxPQUFPLENBQUMsSUFBWTtRQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU0sYUFBYSxDQUFDLElBQVk7UUFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLFNBQVMsQ0FBQyxJQUFZLEVBQUUsR0FBVztRQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBR00sb0JBQW9CLENBQUMsSUFBWSxFQUFFLEdBQVc7UUFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVNLGFBQWEsQ0FBQyxPQUFpQixFQUFFLFVBQW9CLEVBQUUsU0FBUyxHQUFHLEdBQUcsRUFBRSxRQUFRLEdBQUMsR0FBRyxF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