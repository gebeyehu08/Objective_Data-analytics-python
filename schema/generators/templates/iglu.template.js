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
templating_1.Generator.generate({ outputFile: `${destination}location_stack/${format}/${version}` }, (writer) => {
    const igluWriter = new IgluWriter_1.IgluWriter(writer);
    const locationStack = parser_1.getEntity('LocationStack');
    const name = 'location_stack';
    const description = locationStack.getDescription({ type: 'text', target: 'primary' });
    igluWriter.writeSelfDescribingEntity({
        name,
        description: description,
        properties: {
            [name]: {
                type: 'array',
                description,
                isRequired: true,
                minItems: 1,
            },
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWdsdS50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlnbHUudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSxzREFBa0Q7QUFDbEQsOEVBQThDO0FBQzlDLHNEQUFtRDtBQUNuRCxxQ0FBcUM7QUFFckMsTUFBTSxXQUFXLEdBQUcsd0JBQXdCLENBQUM7QUFDN0MsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBQzVCLE1BQU0sT0FBTyxHQUFHLDBCQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRWpFLHNCQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsV0FBVyxrQkFBa0IsTUFBTSxJQUFJLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDN0csTUFBTSxVQUFVLEdBQUcsSUFBSSx1QkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTFDLE1BQU0sYUFBYSxHQUFHLGtCQUFTLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDakQsTUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUM7SUFDOUIsTUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFFdEYsVUFBVSxDQUFDLHlCQUF5QixDQUFDO1FBQ25DLElBQUk7UUFDSixXQUFXLEVBQUUsV0FBVztRQUN4QixVQUFVLEVBQUU7WUFDVixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNOLElBQUksRUFBRSxPQUFPO2dCQUNiLFdBQVc7Z0JBQ1gsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFFBQVEsRUFBRSxDQUFDO2FBQ1o7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=