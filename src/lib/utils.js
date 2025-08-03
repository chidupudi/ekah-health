// src/lib/utils.js

// Utility function to combine classes (similar to clsx/classnames)
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};