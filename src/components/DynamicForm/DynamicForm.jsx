import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeNumberValue, sanitizeValues, resolveFieldOptions } from '../../utils/validation.js';
import { validateFields } from '../../utils/configHelpers.js';
import { SpinnerIcon } from '../icons/index.js';

function getFieldType(field) {
  return field.type || field.inputType || 'text';
}

function getFieldValue(field, value) {
  return getFieldType(field) === 'number' ? (value === '' || value === null || value === undefined ? '' : String(value)) : value ?? '';
}

function getDependentFields(schema, fieldName) {
  return schema.filter((field) => Array.isArray(field.dependsOn) && field.dependsOn.includes(fieldName));
}

function FieldFeedback({ error, hint }) {
  if (error) {
    return <span className="mdm-field__error" role="alert">{error}</span>;
  }

  if (hint) {
    return <span className="mdm-field__hint">{hint}</span>;
  }

  return null;
}

function DynamicForm({
  schema = [],
  initialValues = {},
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onCancel,
  context = {},
  className = '',
  loading = false
}) {
  const initialFormValues = useMemo(() => sanitizeValues(initialValues, schema), [initialValues, schema]);
  const [values, setValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialFormValues);
    setErrors({});
  }, [initialFormValues]);

  const fieldOptionsMap = useMemo(
    () =>
      schema.reduce((accumulator, field) => {
        accumulator[field.name] = resolveFieldOptions(field, {
          values,
          context,
          field
        });
        return accumulator;
      }, {}),
    [context, schema, values]
  );

  const handleChange = useCallback((field, nextValue) => {
    const fieldType = getFieldType(field);
    const normalizedValue = fieldType === 'number' ? normalizeNumberValue(nextValue) : nextValue;
    const dependentFields = getDependentFields(schema, field.name);
    const nextValues = {
      ...values,
      [field.name]: normalizedValue
    };

    dependentFields.forEach((dependentField) => {
      nextValues[dependentField.name] = '';
    });

    setValues(nextValues);

    setErrors((currentErrors) => {
      const validationTargets = [field, ...dependentFields];
      const validationErrors = validateFields(nextValues, validationTargets, context);
      const nextErrors = { ...currentErrors };

      validationTargets.forEach((targetField) => {
        if (validationErrors[targetField.name]) {
          nextErrors[targetField.name] = validationErrors[targetField.name];
        } else {
          delete nextErrors[targetField.name];
        }
      });

      return nextErrors;
    });
  }, [context, schema, values]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    const validationErrors = validateFields(values, schema, context);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit?.(sanitizeValues(values, schema));
  }, [context, onSubmit, schema, values]);

  const preventNegativeKeys = useCallback((event) => {
    if (['-', 'e', 'E', '+'].includes(event.key)) {
      event.preventDefault();
    }
  }, []);

  return (
    <form className={`mdm-form ${className}`.trim()} onSubmit={handleSubmit}>
      {schema.map((field) => {
        const fieldType = getFieldType(field);
        const fieldError = errors[field.name];
        const options = fieldOptionsMap[field.name] || [];
        const inputId = `mdm-field-${field.name}`;

        const sharedProps = {
          value: getFieldValue(field, values[field.name]),
          onChange: (nextValue) => handleChange(field, nextValue?.target ? nextValue.target.value : nextValue),
          error: fieldError,
          field,
          values,
          context,
          options,
          inputId
        };

        return (
          <div className="mdm-field" key={field.name}>
            <label className="mdm-field__label" htmlFor={inputId}>
              {field.label}
              {field.validation?.required || field.required ? <span className="mdm-field__required">*</span> : null}
            </label>

            {typeof field.render === 'function' ? (
              field.render(sharedProps)
            ) : fieldType === 'dropdown' ? (
              <div className="mdm-selectWrap">
                <select
                  id={inputId}
                  className={`mdm-input ${fieldError ? 'mdm-input--error' : ''}`.trim()}
                  value={sharedProps.value}
                  onChange={(event) => sharedProps.onChange(event.target.value)}
                >
                  <option value="">{field.placeholder || `Select ${field.label}`}</option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : fieldType === 'number' ? (
              <input
                id={inputId}
                className={`mdm-input ${fieldError ? 'mdm-input--error' : ''}`.trim()}
                type="number"
                min={field.validation?.min ?? field.min ?? 0}
                step={field.step ?? 'any'}
                inputMode="numeric"
                value={sharedProps.value}
                placeholder={field.placeholder || field.label}
                onKeyDown={preventNegativeKeys}
                onChange={(event) => sharedProps.onChange(event.target.value)}
              />
            ) : (
              <input
                id={inputId}
                className={`mdm-input ${fieldError ? 'mdm-input--error' : ''}`.trim()}
                type="text"
                value={sharedProps.value}
                placeholder={field.placeholder || field.label}
                onChange={(event) => sharedProps.onChange(event.target.value)}
              />
            )}

            <FieldFeedback error={fieldError} hint={field.description} />
          </div>
        );
      })}

      <div className="mdm-form__actions">
        <button className="mdm-button mdm-button--primary" type="submit" disabled={loading}>
          {loading ? <SpinnerIcon className="mdm-spinner--inline" /> : null}
          {submitLabel}
        </button>
        {onCancel ? (
          <button className="mdm-button mdm-button--secondary" type="button" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default memo(DynamicForm);
