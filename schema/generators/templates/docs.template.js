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
    let outputFile = (isLocationContext ? 'location-contexts/' : isGlobalContext ? 'global-contexts/' : 'events/') + entity.name + '.md';
    if (isAbstract) {
        if (entity.name == 'AbstractContext') {
            return;
        }
        outputFile =
            entity.name.replace('Abstract', '').replace(/[A-Z]/g, ' $&').trim().replace(' ', '-').toLowerCase() +
                's/overview.md';
        frontMatterSlug = '/taxonomy/' + outputFile.replace('overview.md', '');
        let abstractEntity = {
            name: entity.name.replace('Abstract', '').replace(/[A-Z]/g, ' $&').trim() + 's',
            description: secondaryDescription,
            listOfChildren: [],
        };
        let listOfChildren = Array();
        const children = entity.children;
        if (children && children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const url = (child.isLocationContext
                    ? './location-contexts/'
                    : child.isGlobalContext
                        ? './global-contexts/'
                        : './events/') +
                    child.name +
                    '.md';
                listOfChildren.push({
                    name: child.name,
                    url: url,
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
            if (['RequiresLocationContext', 'RequiresGlobalContext'].includes(rule.type) &&
                (entity.name == 'AbstractEvent' || !rule._inheritedFrom)) {
                const requiredName = rule.scope[0].context;
                const type = rule.type.replace('Requires', '');
                const url = '../' + type.replace('Context', '-contexts/').toLowerCase() + requiredName + '.md';
                requiredContexts.push({
                    name: requiredName,
                    type: type,
                    url: url,
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
        docsWriter.writeMermaidChartForEntity(entity, 'Diagram: ' + entity.name + ' inheritance');
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
                let type = p.type == 'array' ? p.type + '<' + p.items.type + '>' : p.type;
                if (['GlobalContexts', 'LocationStack'].includes(p.type)) {
                    type = '[' + type + '](/taxonomy/reference/types/' + p.type + ')';
                }
                if (!p.internal) {
                    let name = '**' + p.name.replace(/_/g, '\\_') + (p.optional || p.nullable ? ' _[optional]_' : '') + '**';
                    rows.push([name, type, p.description.replace(/(\r\n|\n|\r)/gm, '')]);
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
                    .forEach((ruleSummary) => docsWriter.writeListItem(ruleSummary + '.'));
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
        url: '/taxonomy/reference/types/' + type.name + '.md',
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
                let outputFile = '/taxonomy/reference/' +
                    (type.isLocationContext ? 'location-contexts/overview.md' : 'global-contexts/overview.md');
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
                docsWriter.writeLine('Specifically:');
                [...new Set(ruleSummaries)]
                    .sort((a, b) => a.localeCompare(b))
                    .forEach((ruleSummary) => docsWriter.writeListItem(ruleSummary + '.'));
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
    docsWriter.writeH1('Open analytics taxonomy reference');
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
    docsWriter.writeH2('Types');
    docsWriter.writeLine('Describe the possible contents of properties that Events and Contexts can have.');
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
    docsWriter.writeH1('Types');
    docsWriter.writeLine('The possible contents of properties that Events and Contexts can have:');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsa0VBQStEO0FBQy9ELHFDQUE0RDtBQUU1RCxNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQUN6QyxJQUFJLGdCQUFnQixHQUFHLEtBQUssRUFBRSxDQUFDO0FBQy9CLElBQUksYUFBYSxHQUFHLEtBQUssRUFBRSxDQUFDO0FBYzVCLENBQUMsR0FBRyxvQkFBVyxFQUFFLEVBQUUsR0FBRyxrQkFBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtJQUNwRCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQzFGLE1BQU0sb0JBQW9CLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDOUYsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUVoRyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3JDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBQ25ELE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFFL0MsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDO0lBRXpCLElBQUksVUFBVSxHQUNaLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENB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