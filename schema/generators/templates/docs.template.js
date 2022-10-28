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
        if (entity.inheritedProperties.length) {
            docsWriter.writeH3('Inherited Properties');
            entity.inheritedProperties.forEach((entityProperty) => {
                const { name, type, description, internal, optional, nullable, _overridden } = entityProperty;
                if (!internal) {
                    docsWriter.writeLine(`${name.toString()}: \`${type}\` ${_overridden ? '[overridden] ' : ''}${optional ? '[optional] ' : ''}${nullable ? '[nullable] ' : ''}- ${description}`);
                }
            });
            docsWriter.writeEndOfLine();
        }
        if (entity.properties.length) {
            docsWriter.writeH3('Properties');
            entity.properties.forEach((entityProperty) => {
                const { name, type, description, internal, optional, nullable, _inherited } = entityProperty;
                if (!internal) {
                    docsWriter.writeLine(`${name.toString()}: \`${type}\` ${_inherited ? '[inherited] ' : ''}${optional ? '[optional] ' : ''}${nullable ? '[nullable] ' : ''}- ${description}`);
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
                    includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.forEach((includedContext) => {
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