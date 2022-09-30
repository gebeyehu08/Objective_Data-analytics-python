import { z } from 'zod';

/**
 * A refinement that checks whether the given context type is present in the subject contexts or Event
 */
export const requiresContext =
  ({ contexts }) =>
  (subject, ctx) => {
    const allContexts = Array.isArray(subject) ? subject : [...subject.location_stack, ...subject.global_contexts];

    contexts.forEach(({context, position}) => {
      const contextIndex = allContexts.findIndex(({ _type }) => _type === context);

      if (contextIndex < 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${context} is required.` });
      }

      if (contextIndex >= 0 && position !== undefined && position !== contextIndex) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${context} is required at position ${position}.` });
      }
    })
  };

/**
 * A refinement that checks whether the given context type is present only once in the subject contexts or Event
 */
export const uniqueContext =
  ({ contextType, by }) =>
  (subject, ctx) => {
    const findDuplicatedContexts = (allContexts) => {
      const contexts = contextType ? allContexts.filter((context) => context._type === contextType) : allContexts;
      const seenContexts = [];

      return contexts.filter((context) => {
        if (
          seenContexts.find((seenContext) => {
            let matchCount = 0;
            by.forEach((propertyToMatch) => {
              const seenProperty = seenContext[propertyToMatch];
              const contextProperty = context[propertyToMatch];

              if (seenProperty !== undefined && contextProperty !== undefined && seenProperty === contextProperty) {
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
    };

    let duplicatedContexts;
    if (Array.isArray(subject)) {
      duplicatedContexts = findDuplicatedContexts(subject);
    } else {
      duplicatedContexts = [
        ...findDuplicatedContexts(subject.location_stack),
        ...findDuplicatedContexts(subject.global_contexts),
      ];
    }

    duplicatedContexts.forEach((duplicatedContext) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `No duplicate Contexts allowed (same \`${by.join('` and `')}\`): ${duplicatedContext._type}:${
          duplicatedContext.id
        }`,
      });
    });
  };
