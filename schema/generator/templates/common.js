"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeEnumerations = exports.writeCopyright = exports.sortEnumMembers = exports.getObjectKeys = void 0;
exports.getObjectKeys = Object.keys;
exports.sortEnumMembers = (members) => members.sort((a, b) => a.name.localeCompare(b.name));
exports.writeCopyright = (writer) => {
    writer.writeLine(`/*\n * Copyright ${new Date().getFullYear()} Objectiv B.V.\n */\n`);
};
exports.writeEnumerations = (writer, model) => {
    writer.writeEnumeration({
        export: true,
        name: "ContextTypes",
        members: exports.sortEnumMembers(exports.getObjectKeys(model.contexts).map((_type) => ({ name: _type }))),
    });
    writer.writeLine();
    writer.writeEnumeration({
        export: true,
        name: "EventTypes",
        members: exports.sortEnumMembers(exports.getObjectKeys(model.events).map((_type) => ({ name: _type }))),
    });
    writer.writeLine();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVFhLFFBQUEsYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUVqQixDQUFDO0FBRVAsUUFBQSxlQUFlLEdBQUcsQ0FBNkIsT0FBWSxFQUFFLEVBQUUsQ0FDMUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTFDLFFBQUEsY0FBYyxHQUFHLENBQUMsTUFBc0MsRUFBRyxFQUFFO0lBQ3hFLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLHVCQUF1QixDQUFDLENBQUM7QUFDeEYsQ0FBQyxDQUFBO0FBRVksUUFBQSxpQkFBaUIsR0FBRyxDQUMvQixNQUFzQyxFQUN0QyxLQUFzQixFQUN0QixFQUFFO0lBQ0YsTUFBTSxDQUFDLGdCQUFnQixDQUFDO1FBQ3RCLE1BQU0sRUFBRSxJQUFJO1FBQ1osSUFBSSxFQUFFLGNBQWM7UUFDcEIsT0FBTyxFQUFFLHVCQUFlLENBQ3RCLHFCQUFhLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQ2hFO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBRW5CLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztRQUN0QixNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxZQUFZO1FBQ2xCLE9BQU8sRUFBRSx1QkFBZSxDQUN0QixxQkFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUM5RDtLQUNGLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNyQixDQUFDLENBQUMifQ==