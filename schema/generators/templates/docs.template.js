"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const DocusaurusWriter_1 = require("../writers/DocusaurusWriter");
const parser_1 = require("./parser");
const destination = '../generated/docs/';
let entitiesOverview = Array();
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
        docsWriter.writeLine(admonitionDescription);
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
});
const getRuleSummaries = (rule, ruleSummaries) => {
    switch (rule.type) {
        case 'MatchContextProperty':
            rule.scope.forEach(({ contextA, contextB, property }) => {
                ruleSummaries.push(`\`${contextA}.${property}\` should equal \`${contextB}.${property}\``);
            });
            break;
        case 'RequiresLocationContext':
            rule.scope.forEach(({ context, position }) => {
                ruleSummaries.push(`\`LocationStacks\` should contain \`${context}\`${position !== undefined ? ` at index ${position}` : ''}`);
            });
            break;
        case 'RequiresGlobalContext':
            rule.scope.forEach(({ context }) => {
                ruleSummaries.push(`\`GlobalContexts\` should contain \`${context}\``);
            });
            break;
        case 'UniqueContext':
            rule.scope.forEach(({ excludeContexts, includeContexts, by }) => {
                if (!(excludeContexts === null || excludeContexts === void 0 ? void 0 : excludeContexts.length) && !(includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.length)) {
                    ruleSummaries.push(`Items in \`${rule._inheritedFrom}\` should have a unique combination of \`{${by.join(', ')}}\` properties`);
                }
                if (excludeContexts === null || excludeContexts === void 0 ? void 0 : excludeContexts.length) {
                    ruleSummaries.push(`Items in \`${rule._inheritedFrom}\` should have a unique combination of \`{${by.join(', ')}}\` properties, except for \`${excludeContexts.join(',')}\``);
                }
                if (includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.length) {
                    includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.forEach((includedContext) => {
                        ruleSummaries.push(`${includedContext} should have a unique combination of \`{${by.join(', ')}}\` properties`);
                    });
                }
            });
            break;
        default:
            throw new Error(`Cannot summarize rule ${rule.type}`);
    }
    return ruleSummaries;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsa0VBQStEO0FBQy9ELHFDQUFrRDtBQUVsRCxNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQUN6QyxJQUFJLGdCQUFnQixHQUFHLEtBQUssRUFBRSxDQUFDO0FBYy9CLENBQUMsR0FBRyxvQkFBVyxFQUFFLEVBQUUsR0FBRyxrQkFBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtJQUNyRCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQzFGLE1BQU0sb0JBQW9CLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDOUYsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUVoRyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3JDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBQ25ELE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFFL0MsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDO0lBRXpCLElBQUksVUFBVSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGtCQUFrQjtRQUNqRyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDbkMsSUFBRyxVQUFVLEVBQUU7UUFFZCxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksaUJBQWlCLEVBQUU7WUFDckMsT0FBTztTQUNQO1FBQ0QsVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO2FBQ2pHLFdBQVcsRUFBRSxHQUFHLGVBQWUsQ0FBQztRQUNqQyxlQUFlLEdBQUcsWUFBWSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBR3ZFLElBQUksY0FBYyxHQUFHO1lBQ3BCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxHQUFHO1lBQy9FLFdBQVcsRUFBRSxvQkFBb0I7WUFDakMsY0FBYyxFQUFFLEVBQUU7U0FDbEIsQ0FBQTtRQUNELElBQUksY0FBYyxHQUFHLEtBQUssRUFBRSxDQUFDO1FBQzdCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDakMsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDcEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLHNCQUFzQjtvQkFDNUQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztnQkFDcEYsY0FBYyxDQUFDLElBQUksQ0FBQztvQkFDbkIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO29CQUNoQixHQUFHLEVBQUUsR0FBRztpQkFDUixDQUFDLENBQUE7YUFDRjtTQUNEO1FBQ0QsY0FBYyxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDL0MsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQ3RDO0lBR0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUM5QixJQUFJLGdCQUFnQixHQUFHLEtBQUssRUFBRSxDQUFDO0lBQy9CLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzlCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUdwQixJQUFJLENBQUMseUJBQXlCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzttQkFDeEUsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLGVBQWUsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDN0QsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQzNDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDL0MsTUFBTSxHQUFHLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLFlBQVksR0FBRyxLQUFLLENBQUM7Z0JBQy9GLGdCQUFnQixDQUFDLElBQUksQ0FBQztvQkFDckIsSUFBSSxFQUFFLFlBQVk7b0JBQ2xCLElBQUksRUFBRSxJQUFJO29CQUNWLEdBQUcsRUFBRSxHQUFHO2lCQUNSLENBQUMsQ0FBQTthQUNGO1NBQ0Q7S0FDRDtJQUVELHNCQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsV0FBVyxJQUFJLFVBQVUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7UUFDekYsTUFBTSxVQUFVLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRCxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFN0MsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3ZCLElBQUcsVUFBVSxFQUFFO1lBQ2QsVUFBVSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQzNDO2FBQ0k7WUFDSixVQUFVLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDekM7UUFDRCxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFdkIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzdELFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUd2QixVQUFVLENBQUMsMEJBQTBCLENBQUMsTUFBTSxFQUFFLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQyxDQUFDO1FBQzFGLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUd2QixJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDbkIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvQixVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdkIsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNqRCxJQUFJLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0IsVUFBVSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQzFEO2FBQ0Q7aUJBQU07Z0JBQ04sVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM5QjtZQUNELFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUN2QjtRQU9ELFNBQVMsaUJBQWlCLENBQUMsVUFBdUM7WUFDakUsSUFBSSxJQUFJLEdBQUcsS0FBSyxFQUFnQixDQUFDO1lBQ2pDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDeEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNoRixJQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtvQkFDZixJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQzswQkFDN0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDN0QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNyRTtZQUNGLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBR0QsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDcEMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNqQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdkIsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7U0FDNUY7UUFHRCxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUMzQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdkIsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztTQUNsRztRQUVELFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQXFCNUIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFHSCxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUM7QUFDakMsTUFBTSxlQUFlLEdBQUcsc0JBQXNCLENBQUM7QUFDL0Msc0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxXQUFXLElBQUksVUFBVSxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUN6RixNQUFNLFVBQVUsR0FBRyxJQUFJLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWhELFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUU3QyxVQUFVLENBQUMsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7SUFDeEQsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBRXZCLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQ3JDLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzNDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QixRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3pDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QyxVQUFVLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDSCxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDeEIsQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLEVBQUU7SUFDL0MsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ2pCLEtBQUssc0JBQXNCO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7Z0JBQ3RELGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxRQUFRLElBQUksUUFBUSxxQkFBcUIsUUFBUSxJQUFJLFFBQVEsSUFBSSxDQUFDLENBQUM7WUFDN0YsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNO1FBRVIsS0FBSyx5QkFBeUI7WUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO2dCQUMzQyxhQUFhLENBQUMsSUFBSSxDQUNoQix1Q0FBdUMsT0FBTyxLQUFLLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGFBQWEsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUMzRyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNO1FBRVIsS0FBSyx1QkFBdUI7WUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUU7Z0JBQ2pDLGFBQWEsQ0FBQyxJQUFJLENBQUMsdUNBQXVDLE9BQU8sSUFBSSxDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNO1FBRVIsS0FBSyxlQUFlO1lBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBQzlELElBQUksRUFBQyxlQUFlLGFBQWYsZUFBZSx1QkFBZixlQUFlLENBQUUsTUFBTSxDQUFBLElBQUksRUFBQyxlQUFlLGFBQWYsZUFBZSx1QkFBZixlQUFlLENBQUUsTUFBTSxDQUFBLEVBQUU7b0JBQ3hELGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsY0FBYyw2Q0FBNkMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDakk7Z0JBQ0QsSUFBSSxlQUFlLGFBQWYsZUFBZSx1QkFBZixlQUFlLENBQUUsTUFBTSxFQUFFO29CQUMzQixhQUFhLENBQUMsSUFBSSxDQUNoQixjQUFjLElBQUksQ0FBQyxjQUFjLDZDQUE2QyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUN6SixDQUFDO2lCQUNIO2dCQUNELElBQUksZUFBZSxhQUFmLGVBQWUsdUJBQWYsZUFBZSxDQUFFLE1BQU0sRUFBRTtvQkFDM0IsZUFBZSxhQUFmLGVBQWUsdUJBQWYsZUFBZSxDQUFFLE9BQU8sQ0FBQyxDQUFDLGVBQWUsRUFBRSxFQUFFO3dCQUMzQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsZUFBZSwyQ0FBMkMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDakgsQ0FBQyxFQUFFO2lCQUNKO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNO1FBRVI7WUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUN6RDtJQUVELE9BQU8sYUFBYSxDQUFDO0FBQ3ZCLENBQUMsQ0FBQyJ9