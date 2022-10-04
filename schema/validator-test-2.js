/*
 * Copyright 2022 Objectiv B.V.
 */

import { z } from 'zod';

const Child = z.object({ id: z.string(), _type: z.literal('Child') });
const Parent = z.discriminatedUnion('_type', [z.object({ id: z.string(), _type: z.literal('Parent') }), Child]);

Parent.parse({ _type: 'Child', id: 'child-id' }); // => { _type: 'Child', id: 'child-id' }
Parent.parse({ _type: 'Parent', id: 'parent-id' }); // => { _type: 'Parent', id: 'parent-id' }

const People = z.discriminatedUnion('_type', [Parent, Child]);
