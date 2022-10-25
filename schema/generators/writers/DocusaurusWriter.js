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
                cap += ('["' + entity.name) +
                    (hasContextsAndProperties ? "<span class='requires_context_and_properties'>" : '');
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
                        cap += (value.name + (value.nullable ? '?' : '') + ': ' + value.type + '<br />');
                    }
                    cap += ('</span>');
                }
                cap += ((hasContextsAndProperties ? '</span>' : '') + '"]');
            }
            return cap;
        }
        this.writeLine('<Mermaid chart={`');
        this.increaseIndent();
        this.increaseIndent();
        this.writeLine('graph LR');
        const parents = entity.parents;
        this.increaseIndent();
        this.writeIndent();
        for (let i = 0; i < parents.length; i++) {
            const parentRcap = getRequiredContextsAndProperties(parents[i]);
            this.write(parentRcap);
            if ((i > 0) && (i % 2 == 1)) {
                this.write(';');
                this.writeEndOfLine();
                if (parents.length > i) {
                    this.writeIndent();
                    this.write(parentRcap + ' --> ');
                }
            }
            else {
                if (i < parents.length) {
                    this.write(' --> ');
                }
            }
        }
        this.writeIndent();
        let entityRcap = getRequiredContextsAndProperties(entity);
        this.write(entityRcap + ';');
        this.writeEndOfLine();
        const children = entity.children;
        if (children && children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                let childRcap = getRequiredContextsAndProperties(child);
                const parent = child._parent;
                this.writeLine((parent != entity.name ? child._parent : entity.name) + ' --> ' + childRcap + ';');
            }
        }
        this.decreaseIndent();
        this.writeLine('class ' + entity.name + ' diagramActive');
        this.decreaseIndent();
        this.writeLine('`}');
        this.writeLine('caption="' + caption + '"');
        this.writeLine('baseColor="blue"');
        function getFormattedLinksToEntities(entities) {
            let links = '';
            for (let i = 0; i < entities.length; i++) {
                const entity = entities[i];
                let path = '/taxonomy/reference/';
                if (entity.isAbstract) {
                    path += 'abstracts/';
                }
                else if (entity.isEvent) {
                    path += 'events/';
                }
                else if (entity.isGlobalContext) {
                    path += 'global-contexts/';
                }
                else if (entity.isLocationContext) {
                    path += 'location-contexts/';
                }
                links += '{ name: \'' + entity.name + '\', to: \'' + path + entity.name + '\' }, ';
            }
            return links;
        }
        if (parents.length > 0 || children.length > 0) {
            this.writeLine('links={[');
        }
        this.increaseIndent();
        this.write(getFormattedLinksToEntities(parents));
        this.write(getFormattedLinksToEntities(children));
        this.decreaseIndent();
        if (parents.length > 0 || children.length > 0) {
            this.writeLine(']}');
        }
        this.decreaseIndent();
        this.writeLine('/>');
    }
}
exports.DocusaurusWriter = DocusaurusWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdXNhdXJ1c1dyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkRvY3VzYXVydXNXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsMENBQXlEO0FBb0N6RCxNQUFhLGdCQUFpQixTQUFRLGlCQUFVO0lBQy9DLFlBQVksTUFBa0I7UUFDN0IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQU1NLE9BQU8sQ0FBQyxJQUFZO1FBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFNTSxPQUFPLENBQUMsSUFBWTtRQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBTU0sT0FBTyxDQUFDLElBQVk7UUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQU1NLGFBQWEsQ0FBQyxJQUFZO1FBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFPTSxpQkFBaUIsQ0FBQyxJQUFZLEVBQUUsU0FBa0IsS0FBSztRQUM3RCxJQUFJLE1BQU07WUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7O1lBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBT00sU0FBUyxDQUFDLElBQVksRUFBRSxHQUFXO1FBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFTTSxvQkFB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