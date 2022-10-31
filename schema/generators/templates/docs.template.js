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
                docsWriter.writeLine(type.validation.description);
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