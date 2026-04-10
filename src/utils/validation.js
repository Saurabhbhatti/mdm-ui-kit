export function isNil(value) {
  return value === null || value === undefined;
}

export function isBlank(value) {
  return isNil(value) || String(value).trim() === '';
}

export function normalizeNumberValue(value) {
  if (value === '' || value === null || value === undefined) {
    return '';
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return '';
  }

  return Math.max(0, numericValue);
}

export function isNegativeNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return false;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue < 0;
}

function getValidationRule(field, key, fallback = undefined) {
  if (field.validation && Object.prototype.hasOwnProperty.call(field.validation, key)) {
    return field.validation[key];
  }

  if (Object.prototype.hasOwnProperty.call(field, key)) {
    return field[key];
  }

  return fallback;
}

export function validateField(value, field = {}, context = {}) {
  const label = field.label || field.name || 'Field';
  const type = field.type || field.inputType || 'text';
  const required = Boolean(getValidationRule(field, 'required', false));
  const min = getValidationRule(field, 'min');
  const noNegative = getValidationRule(field, 'noNegative', type === 'number');
  const pattern = getValidationRule(field, 'pattern');
  const customValidate = getValidationRule(field, 'validate');

  if (required && isBlank(value)) {
    return `${label} is required.`;
  }

  if (type === 'number') {
    if (isBlank(value)) {
      return required ? `${label} is required.` : '';
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return `${label} must be a valid number.`;
    }

    if (noNegative && numericValue < 0) {
      return `${label} cannot be negative.`;
    }

    if (typeof min === 'number' && numericValue < min) {
      return `${label} must be at least ${min}.`;
    }
  }

  if (pattern) {
    const matcher = pattern instanceof RegExp ? pattern : new RegExp(pattern);
    if (!matcher.test(String(value ?? ''))) {
      return `${label} is invalid.`;
    }
  }

  if (typeof customValidate === 'function') {
    const customError = customValidate(value, context);
    if (typeof customError === 'string' && customError) {
      return customError;
    }
    if (customError === false) {
      return `${label} is invalid.`;
    }
  }

  return '';
}

export function validateValues(values, fields = [], context = {}) {
  const errors = {};

  fields.forEach((field) => {
    const error = validateField(values[field.name], field, context);
    if (error) {
      errors[field.name] = error;
    }
  });

  return errors;
}

export function sanitizeValues(values = {}, fields = []) {
  return fields.reduce((accumulator, field) => {
    const currentValue = values[field.name];
    const type = field.type || field.inputType || 'text';

    if (type === 'number') {
      accumulator[field.name] = normalizeNumberValue(currentValue);
      return accumulator;
    }

    accumulator[field.name] = isNil(currentValue) ? '' : currentValue;
    return accumulator;
  }, {});
}

export function resolveFieldOptions(field, context = {}) {
  const options = field.options;

  if (typeof options === 'function') {
    return options(context) || [];
  }

  return Array.isArray(options) ? options : [];
}

export function buildFieldErrorMap(fields = [], values = {}, context = {}) {
  return validateValues(values, fields, context);
}
