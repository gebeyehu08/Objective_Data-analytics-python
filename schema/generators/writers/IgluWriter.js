"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgluWriter = void 0;
const core_1 = require("@yellicode/core");
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const version = base_schema_json_1.default.version.base_schema.replace(/\./g, '-');
const vendor = 'io.objectiv';
const format = 'jsonschema';
const internalProperties = ['isRequired'];
class IgluWriter extends core_1.CodeWriter {
    constructor(writer) {
        super(writer);
        this.indentString = '    ';
    }
    writeJSON(content) {
        this.writeLine(JSON.stringify(content, null, 4));
    }
    writeSelfDescribingEntity(entity) {
        const sanitizedDescription = entity.description.replace(/\n/g, '');
        const sanitizedProperties = JSON.parse(JSON.stringify(entity.properties));
        Object.keys(entity.properties).forEach((property) => {
            internalProperties.forEach((internalProperty) => delete sanitizedProperties[property][internalProperty]);
        });
        this.writeJSON({
            $schema: `http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/${format}/${version}#`,
            description: sanitizedDescription,
            self: {
                vendor,
                name: entity.name,
                format,
                version,
            },
            type: 'object',
            properties: sanitizedProperties,
            additionalProperties: false,
            required: Object.entries(entity.properties)
                .filter(([_, property]) => property.isRequired)
                .map(([key]) => key),
        });
    }
}
exports.IgluWriter = IgluWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWdsdVdyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIklnbHVXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUEsMENBQXlEO0FBQ3pELDhFQUE4QztBQUU5QyxNQUFNLE9BQU8sR0FBRywwQkFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNqRSxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUM7QUFDN0IsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBZTVCLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUUxQyxNQUFhLFVBQVcsU0FBUSxpQkFBVTtJQUN4QyxZQUFZLE1BQWtCO1FBQzVCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFFTSxTQUFTLENBQUMsT0FBWTtRQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFTSx5QkFBeUIsQ0FBQyxNQUFzQztRQUNyRSxNQUFNLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNuRSxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMxRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNsRCxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsT0FBTyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDM0csQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2IsT0FBTyxFQUFFLHlFQUF5RSxNQUFNLElBQUksT0FBTyxHQUFHO1lBQ3RHLFdBQVcsRUFBRSxvQkFBb0I7WUFDakMsSUFBSSxFQUFFO2dCQUNKLE1BQU07Z0JBQ04sSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO2dCQUNqQixNQUFNO2dCQUNOLE9BQU87YUFDUjtZQUNELElBQUksRUFBRSxRQUFRO1lBQ2QsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixvQkFBb0IsRUFBRSxLQUFLO1lBQzNCLFFBQVEsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7aUJBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO2lCQUM5QyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDdkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBbENELGdDQWtDQyJ9