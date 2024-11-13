// Modal.tsx
import { IoMdClose } from 'react-icons/io';
import { useCallback, useEffect, useState } from 'react';
import SubmitBtn from './SubmitBtn';

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  children?: React.ReactNode;  // Utilisation de `children` pour le contenu du modal
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
  children,  // Utilisation des `children`
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) return;
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) return;
    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) return;
    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-neutral-800/70 dark:bg-gray-200/40'>
      <div className='relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 h-full lg:h-auto md:h-auto'>
        <div
          className={`transition-transform duration-300 transform ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        >
          <div className='flex flex-col h-full border-0 rounded-lg shadow-lg relative w-full bg-white dark:bg-gray-900 outline-none'>
            {/* Header */}
            <div className='flex items-center p-6 rounded-t justify-center relative border-b border-gray-300 dark:border-orange-500 dark:text-orange-500'>
              <button
                onClick={handleClose}
                className='absolute left-9 p-1 border-0 hover:opacity-70 transition'
              >
                <IoMdClose size={18} />
              </button>
              <div className='text-xl font-bold'>{title}</div>
            </div>
            {/* Body */}
            <div className='relative p-6 flex-auto'>{children}</div>
            {/* Footer */}
            <div className='flex flex-col gap-2 p-6'>
              <div className='flex flex-row items-center gap-4 w-full'>
                {secondaryAction && secondaryActionLabel && (
                  <SubmitBtn
                    outline
                    disabled={disabled}
                    label={secondaryActionLabel}
                    onClick={handleSecondaryAction}
                  />
                )}
                <SubmitBtn disabled={disabled} label={actionLabel} onClick={handleSubmit} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
