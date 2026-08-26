// Safely escapes regex metacharacters from user input to prevent regex injection

export const escapeRegex = (string) => {
  if (typeof string !== "string") return ""
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}