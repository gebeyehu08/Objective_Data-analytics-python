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
    writeEmphasisLine(text, strong = false) {
        if (strong)
            this.writeLine('**' + text + '**');
        else
            this.writeLine('*' + text + '*');
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
    writeMermaidChartForEntity(entity, caption) {
        function getRequiredContextsAndProperties(entity) {
            var _a;
            const rules = (_a = entity.validation) === null || _a === void 0 ? void 0 : _a.rules;
            let requiredContexts = Array();
            if (rules && rules.length > 0) {
                for (let i = 0; i < rules.length; i++) {
                    let rule = rules[i];
                    if (['RequiresLocationContext', 'RequiresGlobalContext'].includes(rule.type)) {
                        const requiredName = rule.scope[0].context;
                        const type = rule.type.replace('Requires', '');
                        const url = '../' + type.replace('Context', '-contexts/').toLowerCase() + requiredName + '.md';
                        requiredContexts.push([requiredName, type, url]);
                    }
                }
            }
            const properties = entity.ownProperties;
            let cap = entity.name;
            const hasContextsOrProperties = (requiredContexts && requiredContexts.length > 0) ||
                (properties && Object.entries(properties).length > 0);
            const hasContextsAndProperties = (requiredContexts && requiredContexts.length > 0) &&
                (properties && Object.entries(properties).length > 0);
            if (hasContextsOrProperties) {
                cap += ('["' + entity.name);
                if (hasContextsAndProperties) {
                    cap += ("<span class='requires_context_and_properties'>");
                }
                if (requiredContexts && requiredContexts.length > 0) {
                    cap += ("<span class='requires_context'>requires:<br />");
                    requiredContexts.forEach((requiredContext) => {
                        cap += (requiredContext[0] + '<br />');
                    });
                    cap += ('</span>');
                }
                if (properties) {
                    cap += ("<span class='properties'>");
                    for (const [key, value] of Object.entries(properties)) {
                        cap += (value.name + ': ' + value.type + '<br />');
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
        if (entity.name == "MediaEvent") {
            console.log("parents:", entity.parents);
        }
        const parents = entity.parents;
        this.increaseIndent();
        this.writeIndent();
        for (let i = 0; i < parents.length; i++) {
            const p = parents[i];
            let parentCap = getRequiredContextsAndProperties(p);
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
        if (entity.parents.length > 1) {
            this.write(entity.parents[entity.parents.length - 1].name + ' --> ');
        }
        let entityCap = getRequiredContextsAndProperties(entity);
        this.write(entityCap);
        this.write(';');
        this.writeEndOfLine();
        if (entity.children && entity.children.length > 0) {
            for (let i = 0; i < entity.children.length; i++) {
                let child = entity.children[i];
                this.writeLine(entity.name + ' --> ' + child.name + ';');
            }
        }
        this.decreaseIndent();
        this.writeLine('class ' + entity.name + ' diagramActive');
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
            if (parent.isAbstract) {
                path += 'abstracts/';
            }
            else if (parent.isEvent) {
                path += 'events/';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdXNhdXJ1c1dyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkRvY3VzYXVydXNXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsMENBQXlEO0FBaUN6RCxNQUFhLGdCQUFpQixTQUFRLGlCQUFVO0lBQy9DLFlBQVksTUFBa0I7UUFDN0IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFFMUIsQ0FBQztJQU1NLE9BQU8sQ0FBQyxJQUFZO1FBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFNTSxPQUFPLENBQUMsSUFBWTtRQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBTU0sT0FBTyxDQUFDLElBQVk7UUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQU1NLGFBQWEsQ0FBQyxJQUFZO1FBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFPTSxpQkFBaUIsQ0FBQyxJQUFZLEVBQUUsU0FBa0IsS0FBSztRQUM3RCxJQUFJLE1BQU07WUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7O1lBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBT00sU0FBUyxDQUFDLElBQVksRUFBRSxHQUFXO1FBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFTTSxvQkFB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