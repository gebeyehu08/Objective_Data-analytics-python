"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const DocusaurusWriter_1 = require("../writers/DocusaurusWriter");
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
        const docsWriter = new DocusaurusWriter_1.DocusaurusWriter(writer);
        docsWriter.writeH1(entity.name);
        docsWriter.writeLine();
        docsWriter.writeLine(primaryDescription);
        docsWriter.writeLine();
        docsWriter.writeLine("import Mermaid from '@theme/Mermaid'");
        docsWriter.writeLine();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsa0VBQStEO0FBQy9ELHFDQUFrRDtBQUVsRCxNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQUV6QyxDQUFDLEdBQUcsb0JBQVcsRUFBRSxFQUFFLEdBQUcsa0JBQVMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7SUFDckQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDNUQsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUMxRixNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBRWhHLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDckMsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFDbkQsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUUvQyxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuSCxNQUFNLGNBQWMsR0FBRyxHQUFHLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENB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