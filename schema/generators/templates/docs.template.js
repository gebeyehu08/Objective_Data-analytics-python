"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const DocusaurusWriter_1 = require("../writers/DocusaurusWriter");
const common_1 = require("./common");
const destination = '../generated/docs/';
common_1.getEntityNames().forEach((entityName) => {
    var _a, _b;
    const entityCategory = entityName.endsWith('Event') ? 'event' : 'context';
    const entity = common_1.getEntityByName(entityName);
    const entityProperties = common_1.getEntityProperties(entity);
    const entityParents = common_1.getEntityParents(entity);
    const primaryDescription = common_1.getEntityMarkdownDescription(entity, 'primary');
    const admonitionDescription = common_1.getEntityMarkdownDescription(entity, 'admonition');
    const validationRules = (_b = (_a = entity.validation) === null || _a === void 0 ? void 0 : _a.rules) !== null && _b !== void 0 ? _b : null;
    const isAbstract = entityName.startsWith('Abstract');
    const isLocationContext = entityParents.includes('AbstractLocationContext');
    const isGlobalContext = entityParents.includes('AbstractGlobalContext');
    const isEvent = entityCategory == 'event';
    let requiredContexts = [];
    if (isEvent && validationRules) {
        validationRules.forEach((validationRule) => {
            const ruleType = validationRule.type;
            if (ruleType == 'RequiresLocationContext' || ruleType == 'RequiresGlobalContext') {
                requiredContexts.push({
                    'ruleType': ruleType,
                    'context': validationRule.scope[0].context
                });
            }
        });
    }
    const folderPrefix = isAbstract ? 'abstracts' : isLocationContext ? 'location-' : isGlobalContext ? 'global-' : '';
    const fullFolderName = `${folderPrefix}${isAbstract ? '' : `${entityCategory}s`}`;
    templating_1.Generator.generate({ outputFile: `${destination}/${fullFolderName}/${entityName}.md` }, (writer) => {
        const docsWriter = new DocusaurusWriter_1.DocusaurusWriter(writer);
        docsWriter.writeH1(entityName);
        docsWriter.writeLine();
        docsWriter.writeLine(primaryDescription);
        docsWriter.writeLine();
        docsWriter.writeLine("import Mermaid from '@theme/Mermaid'");
        docsWriter.writeLine();
        docsWriter.writeMermaidChart(entityName, entityProperties, entityParents, requiredContexts, "Diagram: " + entityName);
        docsWriter.writeLine();
        if (requiredContexts) {
            docsWriter.writeH3('Requires');
            docsWriter.writeLine();
            if (requiredContexts.length > 0) {
                for (let i = 0; i < requiredContexts.length; i++) {
                    let requiredContext = requiredContexts[i];
                    let ruleType = requiredContext.ruleType.toString();
                    let context = requiredContext.context.toString();
                    debugger;
                    if (ruleType == 'RequiresLocationContext' || ruleType == 'RequiresGlobalContext') {
                        const url = (ruleType == 'RequiresLocationContext' ? '../location' : '../global') +
                            '-contexts/' + context + '.md';
                        docsWriter.writeRequiredContext(context, url);
                    }
                }
            }
            else {
                docsWriter.writeLine('None.');
            }
            docsWriter.writeLine();
        }
        let properties = [[]];
        common_1.getObjectKeys(entityProperties).forEach((entityPropertyName) => {
            const { type, description } = entityProperties[entityPropertyName];
            properties.push(["**" + entityPropertyName.toString() + "**", type, description, ""]);
        });
        docsWriter.writeH3('Properties');
        docsWriter.writeLine();
        docsWriter.writeTable(['', 'type', 'description', 'contains'], properties);
        docsWriter.writeEndOfLine();
        docsWriter.writeLine(admonitionDescription);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsa0VBQStEO0FBQy9ELHFDQVFrQjtBQUVsQixNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQU96Qyx1QkFBYyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7O0lBQ3RDLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzFFLE1BQU0sTUFBTSxHQUFHLHdCQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0MsTUFBTSxnQkFBZ0IsR0FBRyw0QkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyRCxNQUFNLGFBQWEsR0FBRyx5QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxNQUFNLGtCQUFrQixHQUFHLHFDQUE0QixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzRSxNQUFNLHFCQUFxQixHQUFHLHFDQUE0QixDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNqRixNQUFNLGVBQWUsZUFBRyxNQUFNLENBQUMsVUFBVSwwQ0FBRSxLQUFLLG1DQUFJLElBQUksQ0FBQztJQUV6RCxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JELE1BQU0saUJBQWlCLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUN4RSxNQUFNLE9BQU8sR0FBRyxjQUFjLElBQUksT0FBTyxDQUFDO0lBRzFDLElBQUksZ0JBQWdCLEdBQUcsRUFB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