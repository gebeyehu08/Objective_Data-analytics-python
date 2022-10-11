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
    writeTableRow(columns, colLengths, startChar = ' ', fillChar = ' ', endChar = ' ') {
        var _a;
        this.write('|');
        for (let i = 0; i < columns.length; i++) {
            let columnContent = (_a = columns[i]) !== null && _a !== void 0 ? _a : '';
            this.write(startChar + columnContent);
            let columnLength = columnContent.length;
            for (let k = 0; k < colLengths[i] - columnLength; k++) {
                this.write(fillChar);
            }
            this.write(endChar + '|');
        }
        this.writeEndOfLine();
    }
    writeTable(columnNames, rows) {
        let columnLengths = [];
        columnNames.forEach((column) => {
            columnLengths.push(column.length);
        });
        rows.forEach((row) => {
            for (let i = 0; i < row.length; i++) {
                let columnContent = row[i];
                if (columnContent && columnLengths[i] < columnContent.length) {
                    columnLengths[i] = columnContent.length;
                }
            }
        });
        this.writeTableRow(columnNames, columnLengths);
        let headerSeperatorColumns = [];
        columnNames.forEach((column) => {
            headerSeperatorColumns.push('');
        });
        this.writeTableRow(headerSeperatorColumns, columnLengths, ':', '-', '-');
        rows.forEach((row) => {
            if (row.length > 0) {
                this.writeTableRow(row, columnLengths);
            }
        });
    }
    writeMermaidChartForEntity(entityName, entityProperties, entityParents, requiredContexts, caption) {
        function getRequiredContextsAndProperties(name, requiredContexts, properties) {
            let cap = name;
            const hasContextsOrProperties = (requiredContexts && requiredContexts.length > 0) ||
                (properties && Object.entries(properties).length > 0);
            const hasContextsAndProperties = (requiredContexts && requiredContexts.length > 0) &&
                (properties && Object.entries(properties).length > 0);
            if (hasContextsOrProperties) {
                cap += ('["' + name);
                if (hasContextsAndProperties) {
                    cap += ("<span class='requires_context_and_properties'>");
                }
                if (requiredContexts && requiredContexts.length > 0) {
                    cap += ("<span class='requires_context'>requires:<br />");
                    requiredContexts.forEach((requiredContext) => {
                        cap += (requiredContext.contextName + '<br />');
                    });
                    cap += ('</span>');
                }
                if (properties) {
                    cap += ("<span class='properties'>");
                    for (const [key, value] of Object.entries(properties)) {
                        cap += (key.toString() + ': ' + value.type + '<br />');
                    }
                    cap += ('</span>');
                }
                if (hasContextsAndProperties) {
                    cap += ("</span");
                }
                cap += ('"]');
            }
            if (name == 'InteractiveEvent') {
                debugger;
            }
            return cap;
        }
        this.writeLine('<Mermaid chart={`');
        this.increaseIndent();
        this.increaseIndent();
        this.writeLine('graph LR');
        const parents = entityParents.reverse();
        this.increaseIndent();
        this.writeIndent();
        for (let i = 0; i < parents.length; i++) {
            const p = parents[i];
            let parentCap = getRequiredContextsAndProperties(p.name, p.requiredContexts, p.properties);
            this.write(parentCap);
            if (i > 0 && i % 2 == 1) {
                this.write(';');
                this.writeEndOfLine();
            }
            else {
                if (i < parents.length) {
                    this.write(' --> ');
                }
            }
        }
        this.writeIndent();
        if (entityParents.length > 0) {
            this.write(entityParents[entityParents.length - 1].name + ' --> ');
        }
        let entityCap = getRequiredContextsAndProperties(entityName, requiredContexts, entityProperties);
        this.write(entityCap);
        this.write(';');
        this.writeEndOfLine();
        this.decreaseIndent();
        this.writeLine('class ' + entityName + ' diagramActive');
        this.decreaseIndent();
        this.writeLine('`}');
        this.writeLine('caption="' + caption + '"');
        this.writeLine('baseColor="blue"');
        if (parents.length > 1) {
            this.writeLine('links={[');
        }
        this.increaseIndent();
        for (let i = 1; i < parents.length; i++) {
            const parent = parents[i];
            let path = '/taxonomy/reference/';
            if (parent.subCategory == "Event") {
                path += 'events/';
            }
            if (parent.subCategory == "GlobalContext") {
                path += 'global-contexts/';
            }
            if (parent.subCategory == "LocationContext") {
                path += 'location-contexts/';
            }
            this.writeLine('{ name: \'' + parent.name + '\', to: \'' + path + parent.name + '\' }');
        }
        this.decreaseIndent();
        if (parents.length > 1) {
            this.writeLine(']}');
        }
        this.decreaseIndent();
        this.writeLine('/>');
    }
}
exports.DocusaurusWriter = DocusaurusWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdXNhdXJ1c1dyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkRvY3VzYXVydXNXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsMENBQXlEO0FBNEJ6RCxNQUFhLGdCQUFpQixTQUFRLGlCQUFVO0lBQzlDLFlBQVksTUFBa0I7UUFDNUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQU1NLE9BQU8sQ0FBQyxJQUFZO1FBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFNTSxPQUFPLENBQUMsSUFBWTtRQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBTU0sT0FBTyxDQUFDLElBQVk7UUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQU9NLGlCQUFpQixDQUFDLElBQVksRUFBRSxTQUFrQixLQUFLO1FBQzVELElBQUksTUFBTTtZQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQzs7WUFDMUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFNTSxhQUFhLENBQUMsSUFBWTtRQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBT00sU0FBUyxDQUFDLElBQVksRUFBRSxHQUFXO1FBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFRTSxvQkFB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