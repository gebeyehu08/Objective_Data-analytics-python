import { z } from 'zod';

/**
 * A refinement that checks whether the given context type is present in the subject contexts
 */
const requiresContext =
  ({ context, position }) =>
  (contexts, ctx) => {
    const locationContextIndex = contexts.findIndex((context) => context._type === context);

    if (!locationContextIndex) {
      let message = `Location Context ${context} is required for ${ctx.name}`;
      if (position !== undefined) {
        message = `${message} at position ${position}`;
      }
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${message}.` });
    }
  };

/**
 * A refinement that checks whether the given context type is present only once in the subject contexts
 */
const uniqueContext =
  ({ context }) =>
  (contexts, ctx) => {
    // TODO
  };
