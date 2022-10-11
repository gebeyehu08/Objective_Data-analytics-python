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
    writeRequiredContext(text, url, type) {
        this.writeLine('* [' + text + '](' + url + ') (a ' + type + ').');
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
    writeMermaidChartForEntity(entityName, entityProperties, requiredContexts, entityParents, entityChildren, caption) {
        if (entityName == 'InputChangeEvent') {
            console.log(entityChildren);
            debugger;
        }
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
        if (entityParents.length > 1) {
            this.write(entityParents[entityParents.length - 1].name + ' --> ');
        }
        let entityCap = getRequiredContextsAndProperties(entityName, requiredContexts, entityProperties);
        this.write(entityCap);
        this.write(';');
        this.writeEndOfLine();
        if (entityChildren && entityChildren.length > 0) {
            for (let i = 0; i < entityChildren.length; i++) {
                let child = entityChildren[i];
                this.writeLine(entityName + ' --> ' + child + ';');
            }
        }
        this.decreaseIndent();
        this.writeLine('class ' + entityName + ' diagramActive');
        this.decreaseIndent();
        this.writeLine('`}');
        this.writeLine('caption="' + caption + '"');
        this.writeLine('baseColor="blue"');
        if (parents.length > 0) {
            this.writeLine('links={[');
        }
        this.increaseIndent();
        for (let i = 0; i < parents.length; i++) {
            const parent = parents[i];
            let path = '/taxonomy/reference/';
            if (parent.subCategory == "Abstract") {
                path += 'abstracts/';
            }
            else if (parent.subCategory == "Event") {
                path += 'events/';
            }
            else if (parent.subCategory == "GlobalContext") {
                path += 'global-contexts/';
            }
            else if (parent.subCategory == "LocationContext") {
                path += 'location-contexts/';
            }
            this.writeLine('{ name: \'' + parent.name + '\', to: \'' + path + parent.name + '\' },');
        }
        this.decreaseIndent();
        if (parents.length > 0) {
            this.writeLine(']}');
        }
        this.decreaseIndent();
        this.writeLine('/>');
    }
}
exports.DocusaurusWriter = DocusaurusWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdXNhdXJ1c1dyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkRvY3VzYXVydXNXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsMENBQXlEO0FBNEJ6RCxNQUFhLGdCQUFpQixTQUFRLGlCQUFVO0lBQzlDLFlBQVksTUFBa0I7UUFDNUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQU1NLE9BQU8sQ0FBQyxJQUFZO1FBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFNTSxPQUFPLENBQUMsSUFBWTtRQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBTU0sT0FBTyxDQUFDLElBQVk7UUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQU9NLGlCQUFpQixDQUFDLElBQVksRUFBRSxTQUFrQixLQUFLO1FBQzVELElBQUksTUFBTTtZQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQzs7WUFDMUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFNTSxhQUFhLENBQUMsSUFBWTtRQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBT00sU0FBUyxDQUFDLElBQVksRUFBRSxHQUFXO1FBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFTTSxvQkFB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