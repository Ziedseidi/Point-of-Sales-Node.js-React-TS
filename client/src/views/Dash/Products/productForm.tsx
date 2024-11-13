import React from 'react';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface InputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  required?: boolean;
  errors: FieldErrors<any>;
  className?: string;
  options?: Option[];
}

const Input: React.FC<InputProps> = ({ id, label, type = 'text', register, required = false, errors, className, options }) => {
  return (
    <div className={`flex flex-col ${type === 'textarea' || type === 'file' ? 'col-span-3' : ''} ${className}`}>
      <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      {type === 'select' ? (
        <select
          id={id}
          {...register(id, { required })}
          className="border border-gray-300 p-3 rounded w-full text-gray-700 text-sm"
        >
          <option value="">{label}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          {...register(id, { required })}
          className="border border-gray-300 p-3 rounded w-full h-24 text-gray-700 text-sm"
          placeholder={label}
        />
      ) : type === 'file' ? (
        <input
          id={id}
          type="file"
          {...register(id)}
          className="border border-gray-300 p-3 rounded w-full text-gray-700 text-sm"
          required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          {...register(id, { required })}
          className="border border-gray-300 p-3 rounded w-full text-gray-700 text-sm"
          placeholder={label}
        />
      )}
      {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]?.message}</p>}
    </div>
  );
};

interface Field {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: Option[];
}

interface ProductFormProps {
  fields: Field[];
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  onSubmit: UseFormHandleSubmit<any>;
  onCancel: () => void;
  error?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ fields, register, errors, onSubmit, onCancel, error }) => {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-3 gap-x-6 gap-y-4">
      {fields.map((field) => (
        <Input
          key={field.id}
          id={field.id}
          label={field.placeholder || field.label}
          type={field.type}
          register={register}
          required={field.required}
          errors={errors}
          options={field.options}
          className={field.type === 'file' ? 'col-span-3' : ''}
        />
      ))}
      {error && <p className="text-red-500 text-sm mt-1 col-span-3">{error}</p>}
      <div className="mt-6 flex justify-end space-x-4 col-span-3">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
          onClick={onSubmit}
        >
          Save
        </button>
        <button
          type="button"
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
