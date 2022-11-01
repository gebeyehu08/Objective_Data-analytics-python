"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const IgluWriter_1 = require("../writers/IgluWriter");
const parser_1 = require("./parser");
const destination = '../generated/snowplow/';
const format = 'jsonschema';
const version = base_schema_json_1.default.version.base_schema.replace(/\./g, '-');
const vendor = 'io.objectiv';
templating_1.Generator.generate({ outputFile: `${destination}${vendor}/location_stack/${format}/${version}` }, (writer) => {
    const igluWriter = new IgluWriter_1.IgluWriter(writer);
    const locationStack = parser_1.getEntity('LocationStack');
    const name = 'location_stack';
    const description = locationStack.getDescription({ type: 'text', target: 'primary' }).replace(/\n/g, '');
    igluWriter.writeSelfDescribingEntity({
        vendor,
        name,
        description,
        properties: [
            {
                name,
                description,
                type: locationStack.type,
                items: ['object'],
                minItems: 1,
            },
        ],
    });
});
parser_1.getContexts().forEach((context) => {
    const contextsVendor = `${vendor}.context`;
    const outputFile = `${destination}${contextsVendor}/${context.name}/${format}/${version}`;
    const description = context.getDescription({ type: 'text', target: 'primary' }).replace(/\n/g, '');
    templating_1.Generator.generate({ outputFile }, (writer) => {
        const igluWriter = new IgluWriter_1.IgluWriter(writer);
        igluWriter.writeSelfDescribingEntity({
            vendor: contextsVendor,
            name: context.name,
            description: description,
            properties: context.properties,
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWdsdS50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlnbHUudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSxzREFBa0Q7QUFDbEQsOEVBQThDO0FBQzlDLHNEQUFtRDtBQUNuRCxxQ0FBa0Q7QUFFbEQsTUFBTSxXQUFXLEdBQUcsd0JBQXdCLENBQUM7QUFDN0MsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBQzVCLE1BQU0sT0FBTyxHQUFHLDBCQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRWpFLE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQztBQUM3QixzQkFBUyxDQUFDLFFBQVEsQ0FDaEIsRUFBRSxVQUFVLEVBQUUsR0FBRyxXQUFXLEdBQUcsTUFBTSxtQkFBbUIsTUFBTSxJQUFJLE9BQU8sRUFBRSxFQUFFLEVBQzdFLENBQUMsTUFBa0IsRUFBRSxFQUFFO0lBQ3JCLE1BQU0sVUFBVSxHQUFHLElBQUksdUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUUxQyxNQUFNLGFBQWEsR0FBRyxrQkFBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ2pELE1BQU0sSUFBSSxHQUFHLGdCQUFnQixDQUFDO0lBQzlCLE1BQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFekcsVUFBVSxDQUFDLHlCQUF5QixDQUFDO1FBQ25DLE1BQU07UUFDTixJQUFJO1FBQ0osV0FBVztRQUNYLFVBQVUsRUFBRTtZQUNWO2dCQUNFLElBQUk7Z0JBQ0osV0FBVztnQkFDWCxJQUFJLEVBQUUsYUFBYSxDQUFDLElBQUk7Z0JBQ3hCLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFDakIsUUFBUSxFQUFFLENBQUM7YUFDWjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUNGLENBQUM7QUFFRixvQkFBVyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7SUFDaEMsTUFBTSxjQUFjLEdBQUcsR0FBRyxNQUFNLFVBQVUsQ0FBQztJQUMzQyxNQUFNLFVBQVUsR0FBRyxHQUFHLFdBQVcsR0FBRyxjQUFjLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxNQUFNLElBQUksT0FBTyxFQUFFLENBQUM7SUFDMUYsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVuRyxzQkFBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUMsTUFBa0IsRUFBRSxFQUFFO1FBQ3hELE1BQU0sVUFBVSxHQUFHLElBQUksdUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUxQyxVQUFVLENBQUMseUJBQXlCLENBQUM7WUFDbkMsTUFBTSxFQUFFLGNBQWM7WUFDdEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO1lBQ2xCLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtTQUMvQixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=