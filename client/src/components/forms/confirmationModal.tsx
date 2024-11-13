export const ConfirmationModal: React.FC<{
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
    icon: JSX.Element;
  }> = ({ isOpen, onConfirm, onCancel, message, icon }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-md w-1/3">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">{icon}</div>
            <h3 className="text-lg font-semibold">{message}</h3>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };
  