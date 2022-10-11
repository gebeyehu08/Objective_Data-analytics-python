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
    function getRequiredContextsFromValidationRules(validationRules) {
        let requiredContexts = [];
        if (isEvent && validationRules) {
            validationRules.forEach((validationRule) => {
                const ruleType = validationRule.type;
                if (ruleType == 'RequiresLocationContext' || ruleType == 'RequiresGlobalContext') {
                    requiredContexts.push({
                        'contextClass': (ruleType == 'RequiresLocationContext' ? 'location' : 'global'),
                        'contextName': validationRule.scope[0].context
                    });
                }
            });
        }
        return requiredContexts;
    }
    let requiredContexts = getRequiredContextsFromValidationRules(validationRules);
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
        parentEntity.requiredContexts = (parentEntity.validation && parentEntity.validation.rules)
            ? getRequiredContextsFromValidationRules(parentEntity.validation.rules)
            : [];
        if (entityName == 'InputChangeEvent' && parentEntity.name == "InteractiveEvent") {
            debugger;
        }
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
        docsWriter.writeMermaidChartForEntity(entityName, entityOwnProperties, entityParentsWithProperties, requiredContexts, "Diagram: " + entityName);
        docsWriter.writeLine();
        if (requiredContexts) {
            docsWriter.writeH3('Requires');
            docsWriter.writeLine();
            if (requiredContexts.length > 0) {
                for (let i = 0; i < requiredContexts.length; i++) {
                    let requiredContext = requiredContexts[i];
                    let contextClass = requiredContext.contextClass;
                    let contextName = requiredContext.contextName;
                    const url = '../' + contextClass + '-contexts/' + contextName + '.md';
                    docsWriter.writeRequiredContext(contextName, url);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsa0VBQStEO0FBQy9ELHFDQVFrQjtBQUVsQixNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQU96Qyx1QkFBYyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7O0lBQ3RDLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzFFLE1BQU0sTUFBTSxHQUFHLHdCQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0MsTUFBTSxnQkFBZ0IsR0FBRyw0QkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyRCxNQUFNLGFBQWEsR0FBRyx5QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxNQUFNLGtCQUFrQixHQUFHLHFDQUE0QixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzRSxNQUFNLHFCQUFxQixHQUFHLHFDQUE0QixDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNqRixNQUFNLGVBQWUsZUFBRyxNQUFNLENBQUMsVUFBVSwwQ0FBRSxLQUFLLG1DQUFJLElBQUksQ0FBQztJQUV6RCxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JELE1BQU0saUJBQWlCLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUN4RSxNQUFNLE9BQU8sR0FBRyxjQUFjLElBQUksT0FBTyxDQUFDO0lBRTFDLFNBQVMsc0NBQXNDLENBQUMsZUFB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