"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const DocsWriter_1 = require("../writers/DocsWriter");
templating_1.Generator.generateFromModel({ outputFile: '../generated/docs.md' }, (writer, model) => {
    const ts = new DocsWriter_1.DocsWriter(writer);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jcy50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRvY3MudGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxzREFBa0Q7QUFFbEQsc0RBQW1EO0FBRW5ELHNCQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRSxVQUFVLEVBQUUsc0JBQXNCLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsS0FBc0IsRUFBRSxFQUFFO0lBQ2pILE1BQU0sRUFBRSxHQUFHLElBQUksdUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVwQyxDQUFDLENBQUMsQ0FBQyJ9