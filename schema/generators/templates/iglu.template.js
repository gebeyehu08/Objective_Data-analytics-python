"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const JSONWriter_1 = require("../writers/JSONWriter");
const parser_1 = require("./parser");
const destination = '../generated/snowplow/';
const version = base_schema_json_1.default.version.base_schema.replace(/\./g, '-');
const vendor = "io.objectiv";
templating_1.Generator.generate({ outputFile: `${destination}location_stack/jsonschema/${version}` }, (writer) => {
    const jsonWriter = new JSONWriter_1.JSONWriter(writer);
    const locationStack = parser_1.getEntity('LocationStack');
    const name = "location_stack";
    const description = locationStack.getDescription({ type: 'text', target: 'primary' }).replace(/\n/g, '');
    jsonWriter.writeJSON({
        $schema: `http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/${version}#`,
        description,
        self: {
            vendor,
            name,
            format: 'jsonschema',
            version,
        },
        type: 'object',
        properties: {
            [name]: {
                type: 'array',
                description,
                minItems: 1,
            }
        },
        additionalProperties: false,
        required: [
            name
        ]
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWdsdS50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlnbHUudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSxzREFBa0Q7QUFDbEQsOEVBQThDO0FBQzlDLHNEQUFtRDtBQUNuRCxxQ0FBcUM7QUFFckMsTUFBTSxXQUFXLEdBQUcsd0JBQXdCLENBQUE7QUFDNUMsTUFBTSxPQUFPLEdBQUcsMEJBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDakUsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDO0FBRTdCLHNCQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsV0FBVyw2QkFBNkIsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUM5RyxNQUFNLFVBQVUsR0FBRyxJQUFJLHVCQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFMUMsTUFBTSxhQUFhLEdBQUcsa0JBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNqRCxNQUFNLElBQUksR0FBRyxnQkFBZ0IsQ0FBQztJQUM5QixNQUFNLFdBQVcsR0FBRyxhQUFhLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXpHLFVBQVUsQ0FBQyxTQUFTLENBQUM7UUFDbkIsT0FBTyxFQUFFLG9GQUFvRixPQUFPLEdBQUc7UUFDdkcsV0FBVztRQUNYLElBQUksRUFBRTtZQUNKLE1BQU07WUFDTixJQUFJO1lBQ0osTUFBTSxFQUFFLFlBQVk7WUFDcEIsT0FBTztTQUNSO1FBQ0QsSUFBSSxFQUFFLFFBQVE7UUFDZCxVQUFVLEVBQUU7WUFDVixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNOLElBQUksRUFBRSxPQUFPO2dCQUNiLFdBQVc7Z0JBQ1gsUUFBUSxFQUFFLENBQUM7YUFDWjtTQUNGO1FBQ0Qsb0JBQW9CLEVBQUUsS0FBSztRQUMzQixRQUFRLEVBQUU7WUFDUixJQUFJO1NBQ0w7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQyJ9