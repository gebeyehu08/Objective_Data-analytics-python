const { z } = require('zod');

/**
 * This map is used by refinements to easily access required context entities and run validation checks.
 */
let entityMap;

/**
 * A refinement that checks whether the given context type is present in the subject contexts or Event
 */
const requiresContext =
  ({ scope }) =>
  (subject, ctx) => {
    const allContexts = Array.isArray(subject) ? subject : [...subject.location_stack, ...subject.global_contexts];

    scope.forEach(({ context, position }) => {
      const contextIndex = allContexts.findIndex(
        (contextToVerify) => entityMap[context].safeParse(contextToVerify).success
      );

      if (contextIndex < 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${context} is required.` });
      }

      if (contextIndex >= 0 && position !== undefined && position !== contextIndex) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${context} is required at position ${position}.` });
      }
    });
  };

/**
 * A refinement that checks whether the given context type is present only once in the subject contexts or Event
 */
const uniqueContext =
  ({ scope }) =>
  (subject, ctx) => {
    const findDuplicatedContexts = (allContexts, includeContexts, excludeContexts, by) => {
      const contexts = allContexts.filter(({ _type }) => {
        if (excludeContexts) {
          return !excludeContexts.includes(_type);
        }
        if (includeContexts) {
          return includeContexts.includes(_type);
        }

        return true;
      });

      const seenContexts = [];

      return contexts.filter((contextEntity) => {
        if (
          seenContexts.find((seenContext) => {
            let matchCount = 0;
            by.forEach((propertyToMatch) => {
              const seenProperty = seenContext[propertyToMatch];
              const contextProperty = contextEntity[propertyToMatch];

              if (seenProperty !== undefined && contextProperty !== undefined && seenProperty === contextProperty) {
                matchCount++;
              }
            });
            return matchCount === by.length;
          })
        ) {
          return true;
        }

        seenContexts.push(contextEntity);
        return false;
      });
    };

    scope.forEach(({ includeContexts, excludeContexts, by }) => {
      let duplicatedContexts;
      if (Array.isArray(subject)) {
        duplicatedContexts = findDuplicatedContexts(subject, includeContexts, excludeContexts, by);
      } else {
        duplicatedContexts = [
          ...findDuplicatedContexts(subject.location_stack, includeContexts, excludeContexts, by),
          ...findDuplicatedContexts(subject.global_contexts, includeContexts, excludeContexts, by),
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
    });
  };

/**
 * A refinement that checks whether the specified property matches between two contexts.
 */
const matchContextProperty =
  ({ scope }) =>
  (subject, ctx) => {
    const allContexts = Array.isArray(subject) ? subject : [...subject.location_stack, ...subject.global_contexts];

    scope.forEach(({ contextA, contextB, property }) => {
      const contexts = allContexts.filter(({ _type }) => _type === contextA || _type === contextB);

      const groupsByProperty = contexts.reduce((accumulator, item) => {
        (accumulator[item[property]] = accumulator[item[property]] || []).push(item);
        return accumulator;
      }, {});

      if (Object.keys(groupsByProperty).length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `\`${contextA}\` and \`${contextB}\` must have matching \`${property}\` properties.`,
        });
      }
    });
  };
