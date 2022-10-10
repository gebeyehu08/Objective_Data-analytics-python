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
    const folderPrefix = isAbstract ? 'abstracts' : isLocationContext ? 'location-' : isGlobalContext ? 'global-' : '';
    const fullFolderName = `${folderPrefix}${isAbstract ? '' : `${entityCategory}s`}`;
    templating_1.Generator.generate({ outputFile: `${destination}/${fullFolderName}/${entityName}.md` }, (writer) => {
        const docsWriter = new DocusaurusWriter_1.DocusaurusWriter(writer);
        docsWriter.writeH1(entityName);
        docsWriter.writeLine();
        docsWriter.writeLine(primaryDescription);
        docsWriter.writeLine();
        if (isEvent) {
            docsWriter.writeH3('Requires');
            docsWriter.writeLine();
            if (validationRules) {
                validationRules.forEach((validationRule) => {
                    const ruleType = validationRule.type;
                    if (ruleType == 'RequiresLocationContext' || ruleType == 'RequiresGlobalContext') {
                        const requiredContext = validationRule.scope[0].context;
                        const url = (ruleType == 'RequiresLocationContext' ? '../location' : '../global') + '-contexts/'
                            + requiredContext + '.md';
                        docsWriter.writeRequiredContext(requiredContext, url);
                    }
                });
            }
            else {
                docsWriter.writeLine('None.');
            }
            docsWriter.writeLine();
        }
        docsWriter.writeH3('Properties');
        common_1.getObjectKeys(entityProperties).forEach((entityPropertyName) => {
            const { type, description } = entityProperties[entityPropertyName];
            docsWriter.writeLine(`\`${type}\` ${entityPropertyName.toString()}: ${description}`);
        });
        docsWriter.writeEndOfLine();
        docsWriter.writeLine(admonitionDescription);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsa0VBQStEO0FBQy9ELHFDQVFrQjtBQUVsQixNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQUV6Qyx1QkFBYyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7O0lBQ3RDLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzFFLE1BQU0sTUFBTSxHQUFHLHdCQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0MsTUFBTSxnQkFBZ0IsR0FBRyw0QkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyRCxNQUFNLGFBQWEsR0FBRyx5QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxNQUFNLGtCQUFrQixHQUFHLHFDQUE0QixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzRSxNQUFNLHFCQUFxQixHQUFHLHFDQUE0QixDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNqRixNQUFNLGVBQWUsZUFBRyxNQUFNLENBQUMsVUFBVSwwQ0FBRSxLQUFLLG1DQUFJLElBQUksQ0FBQztJQUV6RCxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JELE1BQU0saUJBQWlCLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUN4RSxNQUFNLE9BQU8sR0FBRyxjQUFjLElBQUksT0FBTyxDQUFDO0lBRTFDLE1BQU0sWUFBWSxHQUFHLFVBQVUs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