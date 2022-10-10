"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const DocusaurusWriter_1 = require("../writers/DocusaurusWriter");
const common_1 = require("./common");
const destination = '../generated/docs/';
common_1.getEntityNames().forEach((entityName) => {
    var _a, _b, _c;
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
    let entityParentsWithProperties = [];
    let entityDeepCopy = JSON.parse(JSON.stringify(entity));
    const entityOwnProperties = (_c = entityDeepCopy['properties']) !== null && _c !== void 0 ? _c : {};
    entityParents.forEach(parent => {
        let parentEntity = common_1.getEntityByName(parent);
        parentEntity.name = parent;
        if (parentEntity.properties) {
            for (const [key, value] of Object.entries(parentEntity.properties)) {
                delete entityOwnProperties[key];
            }
            ;
        }
        entityParentsWithProperties.push(parentEntity);
    });
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
        docsWriter.writeMermaidChart(entityName, entityOwnProperties, entityParentsWithProperties, requiredContexts, "Diagram: " + entityName);
        docsWriter.writeLine();
        if (requiredContexts) {
            docsWriter.writeH3('Requires');
            docsWriter.writeLine();
            if (requiredContexts.length > 0) {
                for (let i = 0; i < requiredContexts.length; i++) {
                    let requiredContext = requiredContexts[i];
                    let ruleType = requiredContext.ruleType.toString();
                    let context = requiredContext.context.toString();
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