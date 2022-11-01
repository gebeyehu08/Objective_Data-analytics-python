"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgluWriter = void 0;
const core_1 = require("@yellicode/core");
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const version = base_schema_json_1.default.version.base_schema.replace(/\./g, '-');
const format = 'jsonschema';
const skipProperties = ['_type'];
class IgluWriter extends core_1.CodeWriter {
    constructor(writer) {
        super(writer);
        this.indentString = '    ';
    }
    writeJSON(content) {
        this.write(JSON.stringify(content, null, 4));
    }
    writeSelfDescribingEntity(entity) {
        const properties = mapSchemaPropertiesToIglu(entity.properties);
        this.writeJSON({
            $schema: `http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/${format}/${version}#`,
            description: entity.description,
            self: {
                vendor: entity.vendor,
                name: entity.name,
                format,
                version,
            },
            type: 'object',
            properties,
            additionalProperties: false,
            required: Object.values(entity.properties)
                .filter(({ name, optional }) => !optional && !skipProperties.includes(name))
                .map(({ name }) => name),
        });
    }
}
exports.IgluWriter = IgluWriter;
const mapSchemaPropertiesToIglu = (properties) => {
    let igluProperties = {};
    if (!properties.length) {
        return igluProperties;
    }
    properties
        .filter(({ name }) => !skipProperties.includes(name))
        .forEach((_a) => {
        var { name, type, nullable, description, internal, value, _rules, _inherited } = _a, otherAttributes = __rest(_a, ["name", "type", "nullable", "description", "internal", "value", "_rules", "_inherited"]);
        igluProperties[name] = Object.assign({ type: nullable ? [type, 'null'] : [type], description: description.replace(/\n/g, '') }, otherAttributes);
    });
    return igluProperties;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWdsdVdyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIklnbHVXcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQSwwQ0FBeUQ7QUFDekQsOEVBQThDO0FBRTlDLE1BQU0sT0FBTyxHQUFHLDBCQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2pFLE1BQU0sTUFBTSxHQUFHLFlBQVksQ0FBQztBQWtCNUIsTUFBTSxjQUFjLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUVqQyxNQUFhLFVBQVcsU0FBUSxpQkFBVTtJQUN4QyxZQUFZLE1BQWtCO1FBQzVCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFFTSxTQUFTLENBQUMsT0FBWTtRQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSx5QkFBeUIsQ0FBQyxNQUFzQztRQUNyRSxNQUFNLFVBQVUsR0FBRyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEUsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNiLE9BQU8sRUFBRSx5RUFBeUUsTUFBTSxJQUFJLE9BQU8sR0FBRztZQUN0RyxXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVc7WUFDL0IsSUFBSSxFQUFFO2dCQUNKLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtnQkFDckIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO2dCQUNqQixNQUFNO2dCQUNOLE9BQU87YUFDUjtZQUNELElBQUksRUFBRSxRQUFRO1lBQ2QsVUFBVTtZQUNWLG9CQUFvQixFQUFFLEtBQUs7WUFDM0IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztpQkFDdkMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDM0UsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDO1NBQzNCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTlCRCxnQ0E4QkM7QUFFRCxNQUFNLHlCQUF5QixHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUU7SUFDL0MsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBRXhCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO1FBQ3RCLE9BQU8sY0FBYyxDQUFDO0tBQ3ZCO0lBRUQsVUFBVTtTQUNQLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNwRCxPQUFPLENBQUMsQ0FBQyxFQUE4RixFQUFFLEVBQUU7WUFBbEcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxPQUFzQixFQUFqQixlQUFlLGNBQTVGLHdGQUE4RixDQUFGO1FBQ3BHLGNBQWMsQ0FBQyxJQUFJLENBQUMsbUJBQ2xCLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUN4QyxXQUFXLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQ3hDLGVBQWUsQ0FDbkIsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUwsT0FBTyxjQUFjLENBQUM7QUFDeEIsQ0FBQyxDQUFDIn0=