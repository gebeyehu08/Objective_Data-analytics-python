/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import {
  FunctionDefinition,
  TypeScriptWriter as OriginalTypeScriptWriter,
  VariableDefinition,
} from '@yellicode/typescript';
import { ParameterDefinition } from '@yellicode/typescript/dist/types/model';

type ES6FunctionDefinition = Omit<FunctionDefinition, 'description'> & {
  description?: string;
  export?: boolean;
};

export class TypeScriptWriter extends OriginalTypeScriptWriter {
  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '  ';
    writer.writeLine(`/*\n * Copyright ${new Date().getFullYear()} Objectiv B.V.\n */\n`);
  }

  writeMultiLineImports(moduleName: string, x: string[]) {
    this.writeLine(`import {\n${this.indentString}${x.join(`,\n${this.indentString}`)}\n} from '${moduleName}';`);
  }

  public writeES6ConstDeclaration(definition: VariableDefinition, kind: 'const' | 'let' = 'const'): this {
    if (definition.description) {
      this.writeJsDocLines(definition.description);
    }
    if (definition.export) {
      this.write(`export `);
    }
    if (definition.declare) {
      this.write('declare ');
    }
    this.write(`${kind} ${definition.name}`);
    if (definition.typeName) {
      this.write(`: ${definition.typeName}`);
    }
    return this;
  }

  public writeES6FunctionBlock(func: ES6FunctionDefinition, contents?: (writer: TypeScriptWriter) => void): this {
    if (func.description) {
      this.writeJsDocLines(func.description.split('\n'));
    }

    this.writeES6ConstDeclaration({
      name: func.name,
      typeName: null,
      export: func.export,
    });

    this.write(` = (`);

    this.writeProps({ propsName: 'props', parameters: func.parameters });

    this.write(`): ${func.returnTypeName} => `);

    contents && contents(this);

    return this;
  }

  public writeProps({ propsName, parameters }: { propsName: string; parameters: ParameterDefinition[] }) {
    this.writeLine(`${propsName}: {`);
    this.increaseIndent();

    parameters.forEach((parameter) => {
      this.writeLine(`${parameter.name}${parameter.isOptional ? '?:' : ':'} ${parameter.typeName},`);
    });

    this.decreaseIndent();
    this.write(`}`);
  }
}

export * from '@yellicode/typescript';
