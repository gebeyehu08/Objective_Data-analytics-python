import { z } from 'zod';

/**
 * A refinement that checks whether the given context type is present in the subject contexts
 */
export const requiresContext =
  ({ context, position }) =>
  (subject, ctx) => {
    const contexts = Array.isArray(subject) ? subject : [...subject.location_stack, ...subject.global_contexts];
    const contextIndex = contexts.findIndex(({ _type }) => _type === context);

    if (contextIndex < 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${context} is required.` });
    }

    if (contextIndex >= 0 && position !== undefined && position !== contextIndex) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${context} is required at position ${position}.` });
    }
  };

/**
 * A refinement that checks whether the given context type is present only once in the subject contexts
 */
export const uniqueContext =
  ({ contextType, by }) =>
  (allContexts, ctx) => {
    const contexts = contextType ? allContexts.filter((context) => context._type === contextType) : allContexts;
    const seenContexts = [];

    const duplicatedContexts = contexts.filter((context) => {
      if (
        seenContexts.find((seenContext) => {
          let matchCount = 0;
          by.forEach((propertyToMatch) => {
            if (seenContext[propertyToMatch] === context[propertyToMatch]) {
              matchCount++;
            }
          });
          return matchCount === by.length;
        })
      ) {
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
