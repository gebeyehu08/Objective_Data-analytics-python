"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const MarkdownWriter_1 = require("../writers/MarkdownWriter");
const common_1 = require("./common");
const destination = '../generated/docs/';
common_1.getEntityNames().forEach((entityName) => {
    const entityCategory = entityName.endsWith('Event') ? 'event' : 'context';
    const entity = common_1.getEntityByName(entityName);
    const entityProperties = common_1.getEntityProperties(entity);
    const entityParents = common_1.getEntityParents(entity);
    const primaryDescription = common_1.getEntityMarkdownDescription(entity, 'primary');
    const admonition = common_1.getEntityMarkdownDescription(entity, 'admonition');
    const isAbstract = entityName.startsWith('Abstract');
    const isLocationContext = entityParents.includes('AbstractLocationContext');
    const isGlobalContext = entityParents.includes('AbstractGlobalContext');
    const folderPrefix = isAbstract ? 'abstracts' : isLocationContext ? 'location_' : isGlobalContext ? 'global_' : '';
    const fullFolderName = `${folderPrefix}${isAbstract ? '' : `${entityCategory}s`}`;
    templating_1.Generator.generate({ outputFile: `${destination}/${fullFolderName}/${entityName}.md` }, (writer) => {
        const docsWriter = new MarkdownWriter_1.MarkdownWriter(writer);
        docsWriter.writeH1(entityName);
        docsWriter.writeLine(primaryDescription);
        docsWriter.writeLine();
        docsWriter.writeH3('Properties');
        common_1.getObjectKeys(entityProperties).forEach((entityPropertyName) => {
            const { type, description } = entityProperties[entityPropertyName];
            docsWriter.writeLine(`\`${type}\` ${entityPropertyName.toString()}: ${description}`);
        });
        docsWriter.writeEndOfLine();
        docsWriter.writeLine(admonition);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsOERBQTJEO0FBQzNELHFDQU9rQjtBQUVsQixNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQUV6Qyx1QkFBYyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7SUFDdEMsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDMUUsTUFBTSxNQUFNLEdBQUcsd0JBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMzQyxNQUFNLGdCQUFnQixHQUFHLDRCQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELE1BQU0sYUFBYSxHQUFHLHlCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9DLE1BQU0sa0JBQWtCLEdBQUcscUNBQTRCLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNFLE1BQU0sVUFBVSxHQUFHLHFDQUE0QixDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztJQUV0RSxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JELE1BQU0saUJBQWlCLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUV4RSxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuSCxNQUFNLGNBQWMsR0FBRyxHQUFHLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBRWxGLHNCQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsV0FBVyxJQUFJLGNBQWMsSUFBSSxVQUFVLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBa0IsRUFBRSxFQUFFO1FBQzdHLE1BQU0sVUFBVSxHQUFHLElBQUksK0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9CLFVBQVUsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN6QyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7UUFJdkIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVqQyxzQkFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsa0JBQWtCLEVBQUUsRUFBRTtZQUM3RCxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDbkUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksTUFBTSxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZGLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRTVCLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFJbkMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9