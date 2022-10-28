"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocusaurusWriter = void 0;
const core_1 = require("@yellicode/core");
class DocusaurusWriter extends core_1.CodeWriter {
    constructor(writer) {
        super(writer);
        this.indentString = '  ';
    }
    writeFrontmatter(slug) {
        if (slug != '') {
            this.writeLine('---');
            this.writeLine('slug: ' + slug);
            this.writeLine('---');
            this.writeLine();
        }
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
        let headerSeparatorColumns = [];
        columnNames.forEach((column) => {
            headerSeparatorColumns.push('');
        });
        this.writeTableRow(headerSeparatorColumns, columnLengths, ':', '-', '-');
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
                    if (entity.name == 'AbstractEvent') {
                        console.log('RULE:', rule);
                    }
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
                        if (!value.internal) {
                            cap += (value.name + (value.nullable ? '?' : '') + ': ' + value.type + '<br />');
                        }
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
                let path = '/taxonomy/';
                if (entity.name == 'AbstractContext') {
                    continue;
                }
                else if (entity.isAbstract) {
                    path += entity.name
                        .replace('Abstract', '')
                        .replace(/[A-Z]/g, ' $&')
                        .trim()
                        .replace(' ', '-')
                        .toLowerCase() + 's';
                }
                else if (entity.isEvent) {
                    path += 'reference/events/' + entity.name;
                }
                else if (entity.isGlobalContext) {
                    path += 'reference/global-contexts/' + entity.name;
                }
                else if (entity.isLocationContext) {
                    path += 'reference/location-contexts/' + entity.name;
                }
                links += '{ name: \'' + entity.name + '\', to: \'' + path + '\' }, ';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdXNhdXJ1c1dyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkRvY3VzYXVydXNXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsMENBQXlEO0FBc0N6RCxNQUFhLGdCQUFpQixTQUFRLGlCQUFVO0lBQy9DLFlBQVksTUFBa0I7UUFDN0IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQU1NLGdCQUFnQixDQUFDLElBQUk7UUFDM0IsSUFBRyxJQUFJLElBQUksRUFBRSxFQUFFO1lBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNqQjtJQUNGLENBQUM7SUFNTSxPQUFPLENBQUMsSUFBWTtRQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBTU0sT0FBTyxDQUFDLElBQVk7UUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQU1NLE9BQU8sQ0FBQyxJQUFZO1FBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFNTSxhQUFhLENBQUMsSUFBWTtRQUNoQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBT00saUJBQWlCLENBQUMsSUFBWSxFQUFFLFNBQWtCLEtBQUs7UUFDN0QsSUFBSSxNQUFNO1lBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdB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