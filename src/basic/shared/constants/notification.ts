const TIMEOUT_MS = 3000;

const TYPES = {
  ERROR: "error",
  SUCCESS: "success",
  WARNING: "warning",
} as const;

export const NOTIFICATION = {
  TIMEOUT_MS,
  TYPES,
} as const;
