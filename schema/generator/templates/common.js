"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeEnumerations = exports.sortEnumMembers = exports.getObjectKeys = void 0;
exports.getObjectKeys = Object.keys;
exports.sortEnumMembers = (members) => members.sort((a, b) => a.name.localeCompare(b.name));
exports.writeEnumerations = (writer, model) => {
    writer.writeEnumeration({
        export: true,
        name: "ContextTypes",
        members: exports.sortEnumMembers(exports.getObjectKeys(model.contexts).map((_type) => ({ name: _type })))
    });
    writer.writeLine();
    writer.writeEnumeration({
        export: true,
        name: "EventTypes",
        members: exports.sortEnumMembers(exports.getObjectKeys(model.events).map((_type) => ({ name: _type })))
    });
    writer.writeLine();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVFhLFFBQUEsYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFvRCxDQUFDO0FBRTVFLFFBQUEsZUFBZSxHQUFHLENBQTZCLE9BQVksRUFBRSxFQUFFLENBQzFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUUzQyxRQUFBLGlCQUFpQixHQUFHLENBQUMsTUFBc0MsRUFBRSxLQUFzQixFQUFFLEVBQUU7SUFDbEcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO1FBQ3RCLE1BQU0sRUFBRSxJQUFJO1FBQ1osSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLHVCQUFlLENBQUMscUJBQWEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQztLQUN6RixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7SUFFbkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDO1FBQ3RCLE1BQU0sRUFBRSxJQUFJO1FBQ1osSUFBSSxFQUFFLFlBQVk7UUFDbEIsT0FBTyxFQUFFLHVCQUFlLENBQUMscUJBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQztLQUN2RixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDckIsQ0FBQyxDQUFBIn0=