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
        if (entity.rules.length) {
            docsWriter.writeH3('Validation Rules');
            let ruleSummaries = [];
            entity.rules.forEach((entityRule) => {
                getRuleSummaries(entityRule, ruleSummaries);
            });
            [...new Set(ruleSummaries)]
                .sort((a, b) => a.localeCompare(b))
                .forEach((ruleSummary) => docsWriter.writeLine(ruleSummary));
            docsWriter.writeEndOfLine();
        }
        docsWriter.writeLine(admonitionDescription);
    });
});
const getRuleSummaries = (rule, ruleSummaries) => {
    switch (rule.type) {
        case 'MatchContextProperty':
            rule.scope.forEach(({ contextA, contextB, property }) => {
                ruleSummaries.push(`${contextA}.${property} must equal ${contextB}.${property}`);
            });
            break;
        case 'RequiresLocationContext':
            rule.scope.forEach(({ context, position }) => {
                ruleSummaries.push(`Location Stack must contain ${context}${position !== undefined ? ` at index ${position}` : ''}`);
            });
            break;
        case 'RequiresGlobalContext':
            rule.scope.forEach(({ context }) => {
                ruleSummaries.push(`Global Contexts must contain ${context}`);
            });
            break;
        case 'UniqueContext':
            rule.scope.forEach(({ excludeContexts, includeContexts, by }) => {
                if (!(excludeContexts === null || excludeContexts === void 0 ? void 0 : excludeContexts.length) && !(includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.length)) {
                    ruleSummaries.push(`${rule._inheritedFrom} items must be unique by their ${by.join('+')}`);
                }
                if (excludeContexts === null || excludeContexts === void 0 ? void 0 : excludeContexts.length) {
                    ruleSummaries.push(`${rule._inheritedFrom} items must be unique by their ${by.join('+')}, except ${excludeContexts.join(',')}`);
                }
                if (includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.length) {
                    includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.forEach(includedContext => {
                        ruleSummaries.push(`${includedContext} must be unique by their ${by.join('+')}`);
                    });
                }
            });
            break;
        default:
            throw new Error(`Cannot summarize rule ${rule.type}`);
    }
    return ruleSummaries;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFDbEQsOERBQTJEO0FBQzNELHFDQUFrRDtBQUVsRCxNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztBQUV6QyxDQUFDLEdBQUcsb0JBQVcsRUFBRSxFQUFFLEdBQUcsa0JBQVMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7SUFDcEQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDNUQsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUMxRixNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBRWhHLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDckMsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFDbkQsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUUvQyxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuSCxNQUFNLGNBQWMsR0FBRyxHQUFHLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENB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