"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const MarkdownWriter_1 = require("../writers/MarkdownWriter");
templating_1.Generator.generateFromModel({ outputFile: '../generated/docs.md' }, (writer, model) => {
    const docsWriter = new MarkdownWriter_1.MarkdownWriter(writer);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFFbEQsOERBQTJEO0FBRTNELHNCQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRSxVQUFVLEVBQUUsc0JBQXNCLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsS0FBc0IsRUFBRSxFQUFFO0lBQ2pILE1BQU0sVUFBVSxHQUFHLElBQUksK0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVoRCxDQUFDLENBQUMsQ0FBQyJ9