import React from 'react';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

// Interface pour les options des listes déroulantes
interface Option {
  value: string;
  label: string;
}

interface InputProps {
  id: string;
  label: string;
  type?: string;
  register: UseFormRegister<any>;
  required?: boolean;
  errors: FieldErrors<any>;
  className?: string;
  options?: Option[]; 
}

const Input: React.FC<InputProps> = ({ id, label, type = 'text', register, required = false, errors, className, options }) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      {type === 'select' ? (
        <select
          id={id}
          {...register(id, { required })}
          className="p-3 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          {...register(id, { required })}
          className="p-3 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      )}
      {errors[id] && <span className="text-red-500 text-sm">{errors[id]?.message}</span>}
    </div>
  );
};

interface DynamicFormProps {
  fields: { id: string; label: string; type?: string; required?: boolean; options?: Option[] }[];
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  onSubmit: UseFormHandleSubmit<any>;
  error?: string;
  layout?: 'stacked' | 'grid' | 'grid3'; // Support pour différents layouts de grille
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, register, errors, onSubmit, error, layout = 'stacked' }) => {
  let layoutClasses = '';

  switch (layout) {
    case 'grid':
      layoutClasses = 'grid grid-cols-1 gap-6 md:grid-cols-2'; // 2 colonnes sur écrans moyens
      break;
    case 'grid3':
      layoutClasses = 'grid grid-cols-1 gap-6 md:grid-cols-3'; // 3 colonnes sur écrans moyens
      break;
    default:
      layoutClasses = 'space-y-6'; // Par défaut empilé
      break;
  }

  return (
    <form onSubmit={onSubmit} className={layoutClasses}>
      {fields.map((field) => (
        <Input
          key={field.id}
          id={field.id}
          label={field.label}
          type={field.type}
          register={register}
          required={field.required}
          errors={errors}
          options={field.options} // Passez les options pour les champs de sélection
          className="w-full"
        />
      ))}
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </form>
  );
};

export default DynamicForm;
