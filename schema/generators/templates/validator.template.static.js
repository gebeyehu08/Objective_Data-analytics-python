'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const zod_1 = require('zod');
const requiresContext =
  ({ context, position }) =>
  (contexts, ctx) => {
    const contextIndex = contexts.findIndex(({ _type }) => _type === context);
    if (contextIndex < 0) {
      ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: `${context} is required.` });
    }
    if (contextIndex >= 0 && position !== undefined && position !== contextIndex) {
      ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: `${context} is required at position ${position}.` });
    }
  };
const uniqueContext =
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
        code: zod_1.z.ZodIssueCode.custom,
        message: `No duplicate Contexts allowed: ${duplicatedContext._type}:${duplicatedContext.id}`,
      });
    });
  };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLnRlbXBsYXRlLnN0YXRpYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZhbGlkYXRvci50ZW1wbGF0ZS5zdGF0aWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBd0I7QUFLeEIsTUFBTSxlQUFlLEdBQ25CLENBQUMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUMxQixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUNoQixNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDO0lBRTFFLElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTtRQUNwQixHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sZUFBZSxFQUFFLENBQUMsQ0FBQztLQUNuRjtJQUVELElBQUksWUFBWSxJQUFJLENBQUMsSUFBSSxRQUFRLEtBQUssU0FBUyxJQUFJLFFBQVEsS0FBSyxZQUFZLEVBQUU7UUFDNUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLDRCQUE0QixRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDM0c7QUFDSCxDQUFDLENBQUM7QUFLSixNQUFNLGFBQWEsR0FDakIsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQ3hCLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQ25CLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO0lBQzVHLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUV4QixNQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUNyRCxJQUNFLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUNoQyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7WUFDbkIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUM3QixJQUFJLFdBQVcsQ0FBQyxlQUFlLENBQUMsS0FBSyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7b0JBQzdELFVBQVUsRUFBRSxDQUFDO2lCQUNkO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLFVBQVUsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxFQUNGO1lBQ0EsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0IsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLENBQUMsQ0FBQztJQUVILGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLGlCQUFpQixFQUFFLEVBQUU7UUFDL0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztZQUNYLElBQUksRUFBRSxPQUFDLENBQUMsWUFBWSxDQUFDLE1BQU07WUFDM0IsT0FBTyxFQUFFLGtDQUFrQyxpQkFBaUIsQ0FBQyxLQUFLLElBQUksaUJBQWlCLENBQUMsRUFBRSxFQUFFO1NBQzdGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIn0=
