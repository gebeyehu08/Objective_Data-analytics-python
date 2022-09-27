/*
 * Copyright 2022 Objectiv B.V.
 */

export const getObjectKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

export const sortEnumMembers = <T extends { name: string }>(members: T[]) =>
  members.sort((a , b) => a.name.localeCompare(b.name));
