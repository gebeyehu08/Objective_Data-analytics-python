"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const DocusaurusWriter_1 = require("../writers/DocusaurusWriter");
const parser_1 = require("./parser");
const destination = '../generated/docs/';
[...parser_1.getContexts(), ...parser_1.getEvents()].forEach((entity) => {
    var _a;
    const entityCategory = entity.isEvent ? 'event' : 'context';
    const primaryDescription = entity.getDescription({ type: 'markdown', target: 'primary' });
    const admonitionDescription = entity.getDescription({ type: 'markdown', target: 'admonition' });
    const isAbstract = entity.isAbstract;
    const isLocationContext = entity.isLocationContext;
    const isGlobalContext = entity.isGlobalContext;
    const folderPrefix = isAbstract ? 'abstracts' : isLocationContext ? 'location-' : isGlobalContext ? 'global-' : '';
    const fullFolderName = `${folderPrefix}${isAbstract ? '' : `${entityCategory}s`}`;
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
    templating_1.Generator.generate({ outputFile: `${destination}/${fullFolderName}/${entity.name}.md` }, (writer) => {
        const docsWriter = new DocusaurusWriter_1.DocusaurusWriter(writer);
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
                    docsWriter.writeRequiredContext(rc[0], rc[2], rc[1]);
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
                let name = '**' + p.name.replaceAll('_', '\\_') + ((p.optional || p.nullable) ? ' _[optional]_' : '')
                    + '**';
                rows.push([name, p.type, p.description.replace(/(\r\n|\n|\r)/gm, ""), p.value]);
            });
            return rows;
        }
        if (entity.ownProperties.length > 0) {
            docsWriter.writeH3('Properties');
            docsWriter.writeLine();
            docsWriter.writeTable(['', 'type', 'description', 'contains'], getPropertiesRows(entity.ownProperties));
        }
        docsWriter.writeH3('Inherited Properties');
        docsWriter.writeLine();
        docsWriter.writeTable(['', 'type', 'description', 'contains'], getPropertiesRows(entity.inheritedProperties));
        docsWriter.writeEndOfLine();
        docsWriter.writeLine(admonitionDescription);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsa0VBQStEO0FBQy9ELHFDQUFrRDtBQUVsRCxNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQUV6QyxDQUFDLEdBQUcsb0JBQVcsRUFBRSxFQUFFLEdBQUcsa0JBQVMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7O0lBQ3JELE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzVELE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDMUYsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUVoRyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3JDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBQ25ELE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFFL0MsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDbkgsTUFBTSxjQUFjLEdBQUcsR0FBRyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxD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