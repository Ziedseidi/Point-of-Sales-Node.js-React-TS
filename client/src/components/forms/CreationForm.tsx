import React, { useState } from 'react';

interface FieldConfig {
  name: string;
  label: string;
  type: string; // E.g., "text", "file", "number", etc.
  placeholder?: string;
  value?: string;
}

interface PopupFormProps {
  fields: FieldConfig[];
  onSubmit: (formData: { [key: string]: any }, file?: File | null) => void;
  onCancel: () => void;
  initialValues?: { [key: string]: any };
  title: string;
  submitButtonLabel: string;
}

const CreationForm: React.FC<PopupFormProps> = ({
  fields,
  onSubmit,
  onCancel,
  initialValues = {},
  title,
  submitButtonLabel,
}) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>(initialValues);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = event.target;
    if (type === 'file' && files) {
      setFile(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, file);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="mb-4" key={field.name}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                placeholder={field.placeholder}
                onChange={handleChange}
                className="mt-1 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="mr-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              {submitButtonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreationForm;
