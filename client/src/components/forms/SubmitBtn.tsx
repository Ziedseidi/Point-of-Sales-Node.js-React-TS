// File: SubmitBtn.tsx
import React from 'react';

const SubmitBtn: React.FC<{ buttonText: string }> = ({ buttonText }) => (
  <button
    type="submit"
    className="flex w-full items-center justify-center gap-3.5 rounded-xl border border-stroke bg-blue-600 p-4 text-white font-medium hover:bg-opacity-70 dark:border-strokedark dark:bg-blue-700 dark:hover:bg-opacity-70"
  >
    {buttonText}
  </button>
);

export default SubmitBtn;
