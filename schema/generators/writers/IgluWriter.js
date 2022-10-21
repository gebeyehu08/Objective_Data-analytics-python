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
        this.write(JSON.stringify(content, null, 4));
    }
    writeSelfDescribingEntity(entity) {
        const sanitizedProperties = JSON.parse(JSON.stringify(entity.properties));
        Object.keys(entity.properties).forEach((property) => {
            internalProperties.forEach((internalProperty) => delete sanitizedProperties[property][internalProperty]);
        });
        this.writeJSON({
            $schema: `http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/${format}/${version}#`,
            description: entity.description,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWdsdVdyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIklnbHVXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUEsMENBQXlEO0FBQ3pELDhFQUE4QztBQUU5QyxNQUFNLE9BQU8sR0FBRywwQkFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNqRSxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUM7QUFDN0IsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBZTVCLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUUxQyxNQUFhLFVBQVcsU0FBUSxpQkFBVTtJQUN4QyxZQUFZLE1BQWtCO1FBQzVCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFFTSxTQUFTLENBQUMsT0FBWTtRQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSx5QkFBeUIsQ0FBQyxNQUFzQztRQUNyRSxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMxRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNsRCxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsT0FBTyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDM0csQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2IsT0FBTyxFQUFFLHlFQUF5RSxNQUFNLElBQUksT0FBTyxHQUFHO1lBQ3RHLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVztZQUMvQixJQUFJLEVBQUU7Z0JBQ0osTUFBTTtnQkFDTixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7Z0JBQ2pCLE1BQU07Z0JBQ04sT0FBTzthQUNSO1lBQ0QsSUFBSSxFQUFFLFFBQVE7WUFDZCxVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLG9CQUFvQixFQUFFLEtBQUs7WUFDM0IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztpQkFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7aUJBQzlDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUN2QixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFqQ0QsZ0NBaUNDIn0=