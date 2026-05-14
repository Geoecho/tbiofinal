import type { z } from "zod";

/**
 * Zod v4-compatible resolver for react-hook-form.
 * Replaces @hookform/resolvers/zod which doesn't handle Zod v4 error structure.
 */
export function zodResolver(schema: z.ZodType<any>) {
  return async (values: Record<string, any>) => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const fieldErrors: Record<string, { type: string; message: string }> = {};

    for (const issue of result.error.issues) {
      const path = issue.path.map(String).join(".");
      if (path && !fieldErrors[path]) {
        fieldErrors[path] = {
          type: issue.code,
          message: issue.message,
        };
      }
    }

    return { values: {}, errors: fieldErrors };
  };
}
