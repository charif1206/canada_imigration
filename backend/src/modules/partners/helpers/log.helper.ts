/**
 * Format log message with placeholders
 * @param template - Message template with {placeholder}
 * @param values - Values to replace placeholders
 * @returns Formatted message
 */
export function formatLogMessage(template: string, values: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}
