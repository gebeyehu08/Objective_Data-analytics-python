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
            description: primaryDescription,
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
        docsWriter.writeLine(primaryDescription);
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
        docsWriter.writeLine(admonitionDescription);
    });
});
const outputFile = 'overview.md';
const frontMatterSlug = '/taxonomy/reference/';
templating_1.Generator.generate({ outputFile: `${destination}/${outputFile}` }, (writer) => {
    const docsWriter = new DocusaurusWriter_1.DocusaurusWriter(writer);
    docsWriter.writeFrontmatter(frontMatterSlug);
    entitiesOverview.forEach((category) => {
        docsWriter.writeH1(category.name);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsa0VBQStEO0FBQy9ELHFDQUFrRDtBQUVsRCxNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQUN6QyxJQUFJLGdCQUFnQixHQUFHLEtBQUssRUFBRSxDQUFDO0FBYy9CLENBQUMsR0FBRyxvQkFBVyxFQUFFLEVBQUUsR0FBRyxrQkFBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTs7SUFDckQsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUMxRixNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBRWhHLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDckMsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFDbkQsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUUvQyxJQUFJLGVBQWUsR0FBRyxFQUFFLENBQUM7SUFFekIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsa0JBQWtCO1FBQ2pHLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNuQyxJQUFHLFVBQVUsRUFBRTtRQUVkLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxpQkFBaUIsRUFBRTtZQUNyQyxPQUFPO1NBQ1A7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