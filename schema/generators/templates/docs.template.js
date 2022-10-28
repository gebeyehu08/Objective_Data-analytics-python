"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const DocusaurusWriter_1 = require("../writers/DocusaurusWriter");
const parser_1 = require("./parser");
const destination = '../generated/docs/';
let entitiesOverview = Array();
[...parser_1.getContexts(), ...parser_1.getEvents()].forEach((entity) => {
    var _a;
    const primaryDescription = entity.getDescription({ type: 'markdown', target: 'primary' });
    const secondaryDescription = entity.getDescription({ type: 'markdown', target: 'secondary' });
    const admonitionDescription = entity.getDescription({ type: 'markdown', target: 'admonition' });
    const isAbstract = entity.isAbstract;
    const isLocationContext = entity.isLocationContext;
    const isGlobalContext = entity.isGlobalContext;
    let frontMatterSlug = '';
    let outputFile = (isLocationContext ? 'location-contexts/' : isGlobalContext ? 'global-contexts/'
        : 'events/') + entity.name + '.md';
    if (isAbstract) {
        if (entity.name == 'AbstractContext') {
            return;
        }
        outputFile = entity.name.replace('Abstract', '').replace(/[A-Z]/g, ' $&').trim().replace(' ', '-')
            .toLowerCase() + 's/overview.md';
        frontMatterSlug = "/taxonomy/" + outputFile.replace('overview.md', '');
        let abstractEntity = {
            name: entity.name.replace('Abstract', '').replace(/[A-Z]/g, ' $&').trim() + 's',
            description: secondaryDescription,
            listOfChildren: []
        };
        let listOfChildren = Array();
        const children = entity.children;
        if (children && children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const url = (child.isLocationContext ? './location-contexts/'
                    : child.isGlobalContext ? './global-contexts/' : './events/') + child.name + '.md';
                listOfChildren.push({
                    name: child.name,
                    url: url
                });
            }
        }
        abstractEntity.listOfChildren = listOfChildren;
        entitiesOverview.push(abstractEntity);
    }
    const rules = (_a = entity.validation) === null || _a === void 0 ? void 0 : _a.rules;
    let requiredContexts = Array();
    if (rules && rules.length > 0) {
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            if (['RequiresLocationContext', 'RequiresGlobalContext'].includes(rule.type)) {
                const requiredName = rule.scope[0].context;
                const type = rule.type.replace('Requires', '');
                const url = '../' + type.replace('Context', '-contexts/').toLowerCase() + requiredName + '.md';
                requiredContexts.push({
                    name: requiredName,
                    type: type,
                    url: url
                });
            }
        }
    }
    templating_1.Generator.generate({ outputFile: `${destination}/${outputFile}` }, (writer) => {
        const docsWriter = new DocusaurusWriter_1.DocusaurusWriter(writer);
        docsWriter.writeFrontmatter(frontMatterSlug);
        docsWriter.writeH1(entity.name);
        docsWriter.writeLine();
        if (isAbstract) {
            docsWriter.writeLine(secondaryDescription);
        }
        else {
            docsWriter.writeLine(primaryDescription);
        }
        docsWriter.writeLine();
        docsWriter.writeLine("import Mermaid from '@theme/Mermaid'");
        docsWriter.writeLine();
        docsWriter.writeMermaidChartForEntity(entity, "Diagram: " + entity.name + ' inheritance');
        docsWriter.writeLine();
        if (entity.isEvent) {
            docsWriter.writeH3('Requires');
            docsWriter.writeLine();
            if (requiredContexts.length > 0) {
                for (let i = 0; i < requiredContexts.length; i++) {
                    let rc = requiredContexts[i];
                    docsWriter.writeRequiredContext(rc.name, rc.url, rc.type);
                }
            }
            else {
                docsWriter.writeLine('None.');
            }
            docsWriter.writeLine();
        }
        function getPropertiesRows(properties) {
            let rows = Array();
            properties.forEach((p) => {
                const type = (p.type == "array") ? (p.type + "<" + p.items.type + ">") : p.type;
                if (!p.internal) {
                    let name = '**' + p.name.replaceAll('_', '\\_')
                        + ((p.optional || p.nullable) ? ' _[optional]_' : '') + '**';
                    rows.push([name, type, p.description.replace(/(\r\n|\n|\r)/gm, "")]);
                }
            });
            return rows;
        }
        if (entity.ownProperties.length > 0) {
            docsWriter.writeH3('Properties');
            docsWriter.writeLine();
            docsWriter.writeTable(['', 'type', 'description'], getPropertiesRows(entity.ownProperties));
        }
        if (entity.inheritedProperties.length > 0) {
            docsWriter.writeH3('Inherited Properties');
            docsWriter.writeLine();
            docsWriter.writeTable(['', 'type', 'description'], getPropertiesRows(entity.inheritedProperties));
        }
        docsWriter.writeEndOfLine();
        if (entity.rules.length) {
            docsWriter.writeH3('Validation Rules');
            let ruleSummaries = [];
            entity.rules.forEach((entityRule) => {
                getRuleSummaries(entityRule, ruleSummaries);
            });
            [...new Set(ruleSummaries)]
                .sort((a, b) => a.localeCompare(b))
                .forEach((ruleSummary) => docsWriter.writeListItem(ruleSummary + "."));
            docsWriter.writeEndOfLine();
        }
        docsWriter.writeLine(admonitionDescription);
    });
});
const outputFile = 'overview.md';
const frontMatterSlug = '/taxonomy/reference/';
templating_1.Generator.generate({ outputFile: `${destination}/${outputFile}` }, (writer) => {
    const docsWriter = new DocusaurusWriter_1.DocusaurusWriter(writer);
    docsWriter.writeFrontmatter(frontMatterSlug);
    docsWriter.writeH1("Open analytics taxonomy reference");
    docsWriter.writeLine("Details all Events & Contexts available.");
    docsWriter.writeLine();
    entitiesOverview.forEach((category) => {
        docsWriter.writeH2(category.name);
        docsWriter.writeLine(category.description);
        docsWriter.writeLine();
        category.listOfChildren.forEach((child) => {
            docsWriter.write('* ');
            docsWriter.writeLink(child.name, child.url);
            docsWriter.writeEndOfLine();
        });
        docsWriter.writeLine();
    });
});
const getRuleSummaries = (rule, ruleSummaries) => {
    switch (rule.type) {
        case 'MatchContextProperty':
            rule.scope.forEach(({ contextA, contextB, property }) => {
                ruleSummaries.push(`${contextA}.${property} must equal ${contextB}.${property}`);
            });
            break;
        case 'RequiresLocationContext':
            rule.scope.forEach(({ context, position }) => {
                ruleSummaries.push(`LocationStacks must contain ${context}${position !== undefined ? ` at index ${position}` : ''}`);
            });
            break;
        case 'RequiresGlobalContext':
            rule.scope.forEach(({ context }) => {
                ruleSummaries.push(`GlobalContexts must contain context ${context}`);
            });
            break;
        case 'UniqueContext':
            rule.scope.forEach(({ excludeContexts, includeContexts, by }) => {
                if (!(excludeContexts === null || excludeContexts === void 0 ? void 0 : excludeContexts.length) && !(includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.length)) {
                    ruleSummaries.push(`${rule._inheritedFrom} items must be unique by their ${by.join('+')}`);
                }
                if (excludeContexts === null || excludeContexts === void 0 ? void 0 : excludeContexts.length) {
                    ruleSummaries.push(`${rule._inheritedFrom} items must be unique by their ${by.join('+')}, except for ${excludeContexts.join(',')}`);
                }
                if (includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.length) {
                    includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.forEach((includedContext) => {
                        ruleSummaries.push(`${includedContext} must be unique by their ${by.join('+')}`);
                    });
                }
            });
            break;
        default:
            throw new Error(`Cannot summarize rule ${rule.type}`);
    }
    return ruleSummaries;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsa0VBQStEO0FBQy9ELHFDQUFrRDtBQUVsRCxNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQUN6QyxJQUFJLGdCQUFnQixHQUFHLEtBQUssRUFBRSxDQUFDO0FBYy9CLENBQUMsR0FBRyxvQkFBVyxFQUFFLEVBQUUsR0FBRyxrQkFBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTs7SUFDckQsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUMxRixNQUFNLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQzlGLE1BQU0scUJBQXFCLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7SUFFaEcsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUNyQyxNQUFNLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztJQUNuRCxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDO0lBRS9DLElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQztJQUV6QixJQUFJLFVBQVUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxrQkFBa0I7UUFDakcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJ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