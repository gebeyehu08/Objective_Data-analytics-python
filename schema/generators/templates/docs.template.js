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
    const entityOwnProperties = common_1.getEntityOwnProperties(entity);
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
    function getRequiredContextsFromValidationRules(validationRules) {
        let requiredContexts = [];
        if (isEvent && validationRules) {
            validationRules.forEach((validationRule) => {
                const ruleType = validationRule.type;
                if (ruleType == 'RequiresLocationContext' || ruleType == 'RequiresGlobalContext') {
                    requiredContexts.push({
                        'contextClass': (ruleType == 'RequiresLocationContext' ? 'location' : 'global'),
                        'contextType': (ruleType == 'RequiresLocationContext' ? 'LocationContext' : 'GlobalContext'),
                        'contextName': validationRule.scope[0].context
                    });
                }
            });
        }
        return requiredContexts;
    }
    function getSubCategoryFromEntity(entity) {
        let subCategory = "";
        let parents = common_1.getEntityParents(entity);
        if (entity.name.startsWith('Abstract')) {
            subCategory = "Abstract";
        }
        else if (parents.includes('AbstractLocationContext')) {
            subCategory = "LocationContext";
        }
        else if (parents.includes('AbstractGlobalContext')) {
            subCategory = "GlobalContext";
        }
        else if (entityName.endsWith('Event')) {
            subCategory = "Event";
        }
        return subCategory;
    }
    let requiredContexts = getRequiredContextsFromValidationRules(validationRules);
    const entityParentsWithProperties = [];
    for (let i = 0; i < entityParents.length; i++) {
        let parent = entityParents[i];
        const parentEntity = common_1.getEntityByName(parent);
        parentEntity.properties = common_1.getEntityOwnProperties(parentEntity);
        ;
        parentEntity.name = parent;
        parentEntity.requiredContexts = (parentEntity.validation && parentEntity.validation.rules)
            ? getRequiredContextsFromValidationRules(parentEntity.validation.rules)
            : [];
        parentEntity.subCategory = getSubCategoryFromEntity(parentEntity);
        entityParentsWithProperties.push(parentEntity);
    }
    const entityChildren = common_1.getChildren(entityName);
    if (entityName == 'MediaEvent') {
        console.log("CHILDREN FOUND: ", entityChildren);
    }
    templating_1.Generator.generate({ outputFile: `${destination}/${fullFolderName}/${entityName}.md` }, (writer) => {
        const docsWriter = new DocusaurusWriter_1.DocusaurusWriter(writer);
        docsWriter.writeH1(entityName);
        docsWriter.writeLine();
        docsWriter.writeLine(primaryDescription);
        docsWriter.writeLine();
        docsWriter.writeLine("import Mermaid from '@theme/Mermaid'");
        docsWriter.writeLine();
        docsWriter.writeMermaidChartForEntity(entityName, entityOwnProperties, requiredContexts, entityParentsWithProperties, entityChildren, "Diagram: " + entityName);
        docsWriter.writeLine();
        if (requiredContexts) {
            docsWriter.writeH3('Requires');
            docsWriter.writeLine();
            if (requiredContexts.length > 0) {
                for (let i = 0; i < requiredContexts.length; i++) {
                    let rc = requiredContexts[i];
                    const url = '../' + rc.contextClass + '-contexts/' + rc.contextName + '.md';
                    docsWriter.writeRequiredContext(rc.contextName, url, rc.contextType);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsa0VBQStEO0FBQy9ELHFDQVVrQjtBQUVsQixNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQVF6Qyx1QkFBYyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7O0lBQ3RDLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzFFLE1BQU0sTUFBTSxHQUFHLHdCQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0MsTUFBTSxtQkFBbUIsR0FBRywrQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzRCxNQUFNLGdCQUFnQixHQUFHLDRCQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELE1BQU0sYUFBYSxHQUFHLHlCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9DLE1BQU0sa0JBQWtCLEdBQUcscUNBQTRCLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNFLE1BQU0scUJBQXFCLEdBQUcscUNBQTRCLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2pGLE1BQU0sZUFBZSxlQUFHLE1BQU0sQ0FBQyxVQUFVLDBDQUFFLEtBQUssbUNBQUksSUFBSSxDQUFDO0lBRXpELE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckQsTUFBTSxpQkFBaUIsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDNUUsTUFBTSxlQUFlLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3hFLE1BQU0sT0FBTyxH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