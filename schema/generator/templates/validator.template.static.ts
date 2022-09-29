import { z } from 'zod';

/**
 * A refinement that checks whether the given context type is present in the subject contexts
 */
const requiresContext =
  ({ context, position }) =>
  (contexts, ctx) => {
    const contextIndex = contexts.findIndex((context) => context._type === context);

    if (!contextIndex) {
      let message = `Context ${context} is required for ${ctx.name}`;
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
  ({ contextType, by }) =>
  (allContexts, ctx) => {
    const contexts = contextType ? allContexts.filter(context => context._type === contextType) : allContexts;
    const seenContexts = [];

    // TODO implement `by`
    const duplicatedContexts = contexts.filter((context) => {
      if (seenContexts.find((seenContext) => seenContext._type === context._type && seenContext.id === context.id)) {
        return true;
      }

      seenContexts.push(context);
      return false;
    });

    duplicatedContexts.forEach((duplicatedContext) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `No duplicate Contexts allowed: ${duplicatedContext._type}:${duplicatedContext.id}`,
      });
    });
  };
