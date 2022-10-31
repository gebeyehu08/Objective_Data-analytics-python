"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const DocusaurusWriter_1 = require("../writers/DocusaurusWriter");
const parser_1 = require("./parser");
const destination = '../generated/docs/';
let entitiesOverview = Array();
let typesOverview = Array();
[...parser_1.getContexts(), ...parser_1.getEvents()].forEach((entity) => {
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
    const rules = entity.ownRules;
    let requiredContexts = Array();
    if (rules && rules.length > 0) {
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            if (['RequiresLocationContext', 'RequiresGlobalContext'].includes(rule.type)
                && (entity.name == 'AbstractEvent' || !rule._inheritedFrom)) {
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
        entity.requiredContexts = requiredContexts;
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
                let type = (p.type == "array") ? (p.type + "<" + p.items.type + ">") : p.type;
                if (['GlobalContexts', 'LocationStack'].includes(p.type)) {
                    type = "[" + type + "](/taxonomy/reference/types/" + p.type + ")";
                }
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
        if (entity.ownRules.length) {
            let ruleSummaries = [];
            entity.ownRules.forEach((entityRule) => {
                getRuleSummaries(entityRule, ruleSummaries, entity);
            });
            if (ruleSummaries.length > 0) {
                docsWriter.writeH3('Validation Rules');
                [...new Set(ruleSummaries)]
                    .sort((a, b) => a.localeCompare(b))
                    .forEach((ruleSummary) => docsWriter.writeListItem(ruleSummary + "."));
            }
            docsWriter.writeLine();
        }
        docsWriter.writeLine(admonitionDescription);
    });
});
[...parser_1.getTypes()].forEach((type) => {
    const markdownDescription = type.getDescription({ type: 'markdown', target: 'primary' });
    const outputFile = 'types/' + type.name + '.md';
    typesOverview.push({
        name: type.name,
        url: '/taxonomy/reference/types/' + type.name + '.md'
    });
    templating_1.Generator.generate({ outputFile: `${destination}/${outputFile}` }, (writer) => {
        var _a;
        const docsWriter = new DocusaurusWriter_1.DocusaurusWriter(writer);
        docsWriter.writeH1(type.name);
        docsWriter.writeLine(markdownDescription);
        docsWriter.writeLine();
        if (type.type) {
            docsWriter.writeH2('Contains');
            docsWriter.writeLine();
            docsWriter.write(type.type + '<');
            if (type.items) {
                let outputFile = '/taxonomy/reference/'
                    + (type.isLocationContext ? 'location-contexts/overview.md' : 'global-contexts/overview.md');
                docsWriter.write('[' + type.items.type + '](' + outputFile + ')');
            }
            docsWriter.write('>.');
            docsWriter.writeEndOfLine();
            docsWriter.writeLine();
        }
        if (type.rules.length) {
            let ruleSummaries = [];
            type.rules.forEach((entityRule) => {
                getRuleSummaries(entityRule, ruleSummaries, type);
            });
            if (ruleSummaries.length > 0) {
                docsWriter.writeH2('Validation Rules');
                docsWriter.writeLine((_a = type.validation) === null || _a === void 0 ? void 0 : _a.description);
                docsWriter.writeLine();
                docsWriter.writeLine("Specifically:");
                [...new Set(ruleSummaries)]
                    .sort((a, b) => a.localeCompare(b))
                    .forEach((ruleSummary) => docsWriter.writeListItem(ruleSummary + "."));
                docsWriter.writeLine();
            }
        }
    });
});
const outputFile = 'overview.md';
const frontMatterSlug = '/taxonomy/reference/';
templating_1.Generator.generate({ outputFile: `${destination}/${outputFile}` }, (writer) => {
    const docsWriter = new DocusaurusWriter_1.DocusaurusWriter(writer);
    docsWriter.writeFrontmatter(frontMatterSlug);
    docsWriter.writeH1("Open analytics taxonomy reference");
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
    docsWriter.writeH2("Types");
    docsWriter.writeLine("Describe the possible contents of properties that Events and Contexts can have.");
    typesOverview.forEach((type) => {
        docsWriter.write('* ');
        docsWriter.writeLink(type.name, type.url);
        docsWriter.writeEndOfLine();
    });
});
const typesOverviewOutputFile = 'types/overview.md';
const typesFrontMatterSlug = '/taxonomy/types/';
templating_1.Generator.generate({ outputFile: `${destination}/${typesOverviewOutputFile}` }, (writer) => {
    const docsWriter = new DocusaurusWriter_1.DocusaurusWriter(writer);
    docsWriter.writeFrontmatter(typesFrontMatterSlug);
    docsWriter.writeH1("Types");
    docsWriter.writeLine("The possible contents of properties that Events and Contexts can have:");
    typesOverview.forEach((type) => {
        docsWriter.write('* ');
        docsWriter.writeLink(type.name, type.url);
        docsWriter.writeEndOfLine();
    });
    docsWriter.writeLine();
});
const getRuleSummaries = (rule, ruleSummaries, entity = null) => {
    if (!rule._inheritedFrom) {
        switch (rule.type) {
            case 'MatchContextProperty':
                rule.scope.forEach(({ contextA, contextB, property }) => {
                    ruleSummaries.push(`\`${contextA}.${property}\` should equal \`${contextB}.${property}\``);
                });
                break;
            case 'RequiresLocationContext':
                rule.scope.forEach(({ context, position }) => {
                    const url = '/taxonomy/reference/location-contexts/' + context + '.md';
                    ruleSummaries.push(`[LocationStack](/taxonomy/reference/types/LocationStack) should contain [${context}](${url})${position !== undefined ? ` at index ${position}` : ''}`);
                });
                break;
            case 'RequiresGlobalContext':
                rule.scope.forEach(({ context }) => {
                    const url = '/taxonomy/reference/global-contexts/' + context + '.md';
                    ruleSummaries.push(`[GlobalContexts](/taxonomy/reference/types/GlobalContexts) should contain one [${context}](${url})`);
                });
                break;
            case 'UniqueContext':
                rule.scope.forEach(({ excludeContexts, includeContexts, by }) => {
                    if (!(excludeContexts === null || excludeContexts === void 0 ? void 0 : excludeContexts.length) && !(includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.length)) {
                        if (rule._inheritedFrom) {
                            ruleSummaries.push(`Items in \`${rule._inheritedFrom}\` should have a unique combination of \`{${by.join(', ')}}\` properties`);
                        }
                        else {
                            ruleSummaries.push(`Items should have a unique combination of \`{${by.join(', ')}}\` properties`);
                        }
                    }
                    if (excludeContexts === null || excludeContexts === void 0 ? void 0 : excludeContexts.length) {
                        if (rule._inheritedFrom) {
                            ruleSummaries.push(`Items in \`${rule._inheritedFrom}\` should have a unique combination of \`{${by.join(', ')}}\` properties, except for \`${excludeContexts.join(',')}\``);
                        }
                        else {
                            ruleSummaries.push(`Items should have a unique combination of \`{${by.join(', ')}}\` properties, except for \`${excludeContexts.join(',')}\``);
                        }
                    }
                    if (includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.length) {
                        includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.forEach((includedContext) => {
                            let requiredContextsNames = [];
                            if (entity.requiredContexts) {
                                for (let i = 0; i < entity.requiredContexts.length; i++) {
                                    requiredContextsNames.push(entity.requiredContexts[i].name);
                                }
                            }
                            if (entity && (entity.name == includedContext || requiredContextsNames.includes(includeContexts))) {
                                ruleSummaries.push(`${includedContext} should have a unique combination of \`{${by.join(', ')}}\` properties`);
                            }
                        });
                    }
                });
                break;
            default:
                throw new Error(`Cannot summarize rule ${rule.type}`);
        }
    }
    return ruleSummaries;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsa0VBQStEO0FBQy9ELHFDQUE0RDtBQUU1RCxNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQUN6QyxJQUFJLGdCQUFnQixHQUFHLEtBQUssRUFBRSxDQUFDO0FBQy9CLElBQUksYUFBYSxHQUFHLEtBQUssRUFBRSxDQUFDO0FBYzVCLENBQUMsR0FBRyxvQkFBVyxFQUFFLEVBQUUsR0FBRyxrQkFBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtJQUNyRCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQzFGLE1BQU0sb0JBQW9CLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDOUYsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUVoRyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3JDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBQ25ELE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFFL0MsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDO0lBRXpCLElBQUksVUFBVSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGtCQUFrQjtRQUNqRyxD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