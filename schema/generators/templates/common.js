"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyValue = exports.sortBy = exports.getObjectKeys = void 0;
exports.getObjectKeys = Object.keys;
exports.sortBy = (array, propertyName) => array.sort((a, b) => a[propertyName].localeCompare(b[propertyName]));
exports.getPropertyValue = (entityName, property) => {
    if (property.type === 'discriminator') {
        return `${entityName.endsWith('Event') ? 'Event' : 'Context'}Types.enum.${entityName}`;
    }
    if (property.type === 'array') {
        return property.items.type;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQU9hLFFBQUEsYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFvRCxDQUFDO0FBSzVFLFFBQUEsTUFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQU12RyxRQUFBLGdCQUFnQixHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxFQUFFO0lBQ3ZELElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxlQUFlLEVBQUU7UUFDckMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxjQUFjLFVBQVUsRUFBRSxDQUFDO0tBQ3hGO0lBQ0QsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtRQUM3QixPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0tBQzVCO0FBQ0gsQ0FBQyxDQUFDIn0=