import os
import json5  # type: ignore
import json

version = '1-0-0'
schema_file = '../../../../../../schema/base_schema.json5'


def get_sp_schema(schema, context_name):

    context = schema['contexts'][context_name]

    required_properties = ['id']
    properties = {
        "id": {
            "type": "string",
            "description": "some id"
        }
    }

    if 'properties' in context:
        for property_name in context['properties']:
            property_type = ['string']
            if 'optional' not in context['properties'][property_name] or context['properties'][property_name]['optional'] == False:
                if property_name not in required_properties:
                    required_properties.append(property_name)
            else:
                property_type = ['string', 'null']
            properties[property_name] = {
                "type": property_type,
                "description": context['properties'][property_name]['description']
            }

    sp_schema = {
        "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
        "description": context['description'],
        "self": {
            "vendor": "io.objectiv.context",
            "name": context_name,
            "format": "jsonschema",
            "version": version
        },
        "type": "object",
        "properties": properties,
        "additionalProperties": True,
        "required": required_properties
    }


    return json.dumps(sp_schema, indent=4)


with open(schema_file, 'r') as sfd:
    schema_data = sfd.read()

    schema = json5.loads(schema_data)
    for context in schema['contexts']:
        print(f'found context: {context}')
        if not os.path.isdir(context):
            os.mkdir(context)
            os.mkdir(f'{context}/jsonschema')


        sp_schema = get_sp_schema(schema, context)
        with open(f'{context}/jsonschema/{version}', 'w+') as sp_schema_file:
            sp_schema_file.write(sp_schema)




