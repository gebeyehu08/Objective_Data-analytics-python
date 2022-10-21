/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, TextWriter } from '@yellicode/core';

export type ObjectDefinition = {
  name?: string,
  properties: string | number | boolean | object | Array<string>,
  closeWithComma: boolean
}

export type ArrayDefinition = {
  name?: string,
  items: Array<string>,
  closeWithComma: boolean
}

export class JSONWriter extends CodeWriter {
  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '    ';
  }

  public writeArray(array: ArrayDefinition) {
    this.writeLine(array.name ? `"${array.name}": [`: ']');
    this.increaseIndent();
    array.items.forEach((item, index) => {
      this.writeIndent();
      this.write(`"${item}"`);
      this.writeEndOfLine(index < array.items.length - 1 ? ',' : '')
    })
    this.decreaseIndent();
    this.writeIndent();
    this.write(`]`)
    array.closeWithComma && this.write(`,`)
    this.writeEndOfLine(``)
  }

  public writeObject(object: ObjectDefinition) {
    this.writeLine(object.name ? `"${object.name}": {`: '{');
    this.increaseIndent();
    const propertyKeys = Object.keys(object.properties);
    propertyKeys.forEach((propertyKey, index) => {
      const propertyValue = object.properties[propertyKey]
      if(typeof propertyValue === 'string') {
        this.writeIndent();
        this.write(`"${propertyKey}": "${sanitizeString(propertyValue)}"`)
        this.writeEndOfLine(index < propertyKeys.length - 1 ? ',' : '')
      } else if(typeof propertyValue === 'number' || typeof propertyValue === 'boolean') {
        this.writeIndent();
        this.write(`"${propertyKey}": ${propertyValue}`)
        this.writeEndOfLine(index < propertyKeys.length - 1 ? ',' : '')
      } else if(Array.isArray(propertyValue)) {
        this.writeArray({
          name: 'required',
          items: propertyValue,
          closeWithComma: index < propertyKeys.length - 1,
        });
      } else {
        this.writeObject({
          name: propertyKey,
          properties: propertyValue,
          closeWithComma: index < propertyKeys.length - 1,
        })
      }
    })
    this.decreaseIndent();
    this.writeIndent();
    this.write(`}`)
    object.closeWithComma && this.write(`,`)
    this.writeEndOfLine(``)
  }
}

const sanitizeString = (string) => {
  return string.replace(/\n/g, '');
}
