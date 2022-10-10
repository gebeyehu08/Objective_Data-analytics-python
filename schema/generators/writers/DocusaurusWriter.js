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
    writeEmphasisLine(text, strong = false) {
        if (strong)
            this.writeLine('**' + text + '**');
        else
            this.writeLine('*' + text + '*');
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
    writeMermaidChart(entityName, entityProperties, entityParents, requiredContexts, caption) {
        this.writeLine('<Mermaid chart={`');
        this.increaseIndent();
        this.increaseIndent();
        this.writeLine('graph LR');
        const parents = entityParents.reverse();
        this.increaseIndent();
        this.writeIndent();
        for (let i = 0; i < parents.length; i++) {
            this.write(parents[i].name);
            if (i < parents.length) {
                this.write(" --> ");
            }
        }
        const hasContextsOrProperties = (requiredContexts.length > 0 || Object.entries(entityProperties).length > 0);
        this.write(entityName);
        if (hasContextsOrProperties) {
            this.write('["' + entityName);
        }
        if (requiredContexts.length > 0) {
            this.write('<span class=\'requires_context\'>requires:<br />');
            requiredContexts.forEach(requiredContext => {
                this.write(requiredContext.context + '<br />');
            });
            this.write('</span>');
        }
        if (entityName == 'FailureEvent') {
            debugger;
        }
        if (Object.entries(entityProperties).length > 0) {
            this.write('<br /><span class=\'properties\'>');
            for (const [key, value] of Object.entries(entityProperties)) {
                this.write(key + ': ' + value.type + '<br />');
            }
            this.write('</span>');
        }
        if (hasContextsOrProperties) {
            this.write('"]');
        }
        this.write(';');
        this.writeEndOfLine();
        this.decreaseIndent();
        this.writeLine('class ' + entityName + ' diagramActive');
        this.decreaseIndent();
        this.writeLine('`}');
        this.writeLine('caption="' + caption + '"');
        this.writeLine('baseColor="blue"');
        this.decreaseIndent();
        this.writeLine('/>');
    }
}
exports.DocusaurusWriter = DocusaurusWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdXNhdXJ1c1dyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkRvY3VzYXVydXNXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsMENBQXlEO0FBZXpELE1BQWEsZ0JBQWlCLFNBQVEsaUJBQVU7SUFDOUMsWUFBWSxNQUFrQjtRQUM1QixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUUzQixDQUFDO0lBRU0sT0FBTyxDQUFDLElBQVk7UUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLE9BQU8sQ0FBQyxJQUFZO1FBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTSxPQUFPLENBQUMsSUFBWTtRQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU0saUJBQWlCLENBQUMsSUFBWSxFQUFFLFNBQWtCLEtBQUs7UUFDNUQsSUFBSSxNQUFNO1lBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDOztZQUMxQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFZO1FBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxTQUFTLENBQUMsSUFBWSxFQUFFLEdBQVc7UUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUdNLG9CQUFv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