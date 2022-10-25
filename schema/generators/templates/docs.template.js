"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const MarkdownWriter_1 = require("../writers/MarkdownWriter");
const parser_1 = require("./parser");
const destination = '../generated/docs/';
[...parser_1.getContexts(), ...parser_1.getEvents()].forEach((entity) => {
    const entityCategory = entity.isEvent ? 'event' : 'context';
    const primaryDescription = entity.getDescription({ type: 'markdown', target: 'primary' });
    const admonitionDescription = entity.getDescription({ type: 'markdown', target: 'admonition' });
    const isAbstract = entity.isAbstract;
    const isLocationContext = entity.isLocationContext;
    const isGlobalContext = entity.isGlobalContext;
    const folderPrefix = isAbstract ? 'abstracts' : isLocationContext ? 'location_' : isGlobalContext ? 'global_' : '';
    const fullFolderName = `${folderPrefix}${isAbstract ? '' : `${entityCategory}s`}`;
    templating_1.Generator.generate({ outputFile: `${destination}/${fullFolderName}/${entity.name}.md` }, (writer) => {
        const docsWriter = new MarkdownWriter_1.MarkdownWriter(writer);
        docsWriter.writeH1(entity.name);
        docsWriter.writeLine(primaryDescription);
        docsWriter.writeLine();
        if (entity.parent) {
            docsWriter.writeH3('Parent');
            docsWriter.writeLine(entity.parent.name);
            docsWriter.writeEndOfLine();
        }
        if (entity.parents.length) {
            docsWriter.writeH3('All Parents');
            docsWriter.writeLine(entity.parents.map(({ name }) => name).join(' > '));
            docsWriter.writeEndOfLine();
        }
        if (entity.ownChildren.length) {
            docsWriter.writeH3('Own Children');
            docsWriter.writeLine(entity.ownChildren.map(({ name }) => name).join(', '));
            docsWriter.writeEndOfLine();
        }
        if (entity.children.length) {
            docsWriter.writeH3('All Children');
            docsWriter.writeLine(entity.children.map(({ name }) => name).join(', '));
            docsWriter.writeEndOfLine();
        }
        if (entity.ownProperties.length) {
            docsWriter.writeH3('Own Properties');
            entity.ownProperties.forEach((entityProperty) => {
                const { name, type, description, internal } = entityProperty;
                if (!internal) {
                    docsWriter.writeLine(`\`${type}\` ${name.toString()}: ${description}`);
                }
            });
            docsWriter.writeEndOfLine();
        }
        if (entity.inheritedProperties.length) {
            docsWriter.writeH3('Inherited Properties');
            entity.inheritedProperties.forEach((entityProperty) => {
                const { name, type, description, internal } = entityProperty;
                if (!internal) {
                    docsWriter.writeLine(`\`${type}\` ${name.toString()}: ${description}`);
                }
            });
            docsWriter.writeEndOfLine();
        }
        if (entity.properties.length) {
            docsWriter.writeH3('All Properties');
            entity.properties.forEach((entityProperty) => {
                const { name, type, description, internal } = entityProperty;
                if (!internal) {
                    docsWriter.writeLine(`\`${type}\` ${name.toString()}: ${description}`);
                }
            });
            docsWriter.writeEndOfLine();
        }
        docsWriter.writeLine(admonitionDescription);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsOERBQTJEO0FBQzNELHFDQUFrRDtBQUVsRCxNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQUV6QyxDQUFDLEdBQUcsb0JBQVcsRUFBRSxFQUFFLEdBQUcsa0JBQVMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7SUFDcEQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDNUQsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUMxRixNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBRWhHLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDckMsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFDbkQsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUUvQyxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuSCxNQUFNLGNBQWMsR0FBRyxHQUFHLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENB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