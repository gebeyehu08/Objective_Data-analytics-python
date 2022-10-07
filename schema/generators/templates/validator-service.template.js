"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const JavaScriptWriter_1 = require("../writers/JavaScriptWriter");
const glob_1 = __importDefault(require("glob"));
const validatorFolder = '../../validator/';
templating_1.Generator.generateFromModel({ outputFile: `${validatorFolder}/validator-service.js` }, (writer) => {
    const jsWriter = new JavaScriptWriter_1.JavaScriptWriter(writer);
    jsWriter.writeFile('validator-service.template.static.ts');
    jsWriter.writeEndOfLine();
    const validatorFiles = glob_1.default.sync(`${validatorFolder}/validator-v*.js`);
    validatorFiles.forEach((validator) => {
        const validatorVersion = validator.replace(`${validatorFolder}validator-v`, '').replace('.js', '');
        jsWriter.writeLine(`versions.push('${validatorVersion.toString()}');`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLXNlcnZpY2UudGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2YWxpZGF0b3Itc2VydmljZS50ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUtBLHNEQUFrRDtBQUNsRCxrRUFBK0Q7QUFDL0QsZ0RBQXdCO0FBRXhCLE1BQU0sZUFBZSxHQUFHLGtCQUFrQixDQUFDO0FBRTNDLHNCQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxlQUFlLHVCQUF1QixFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDNUcsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU5QyxRQUFRLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7SUFFM0QsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBRTFCLE1BQU0sY0FBYyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxlQUFlLGtCQUFrQixDQUFDLENBQUM7SUFDdkUsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO1FBQ25DLE1BQU0sZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLGVBQWUsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbkcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==