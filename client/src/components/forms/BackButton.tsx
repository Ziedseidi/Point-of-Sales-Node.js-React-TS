import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  backTo?: string; // URL vers laquelle naviguer si spécifiée, sinon revenir en arrière
  className?: string; // Classe CSS personnalisée pour le style
  title?: string; // Texte du bouton
}

const BackButton: React.FC<BackButtonProps> = ({ backTo, className, title = 'Back' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (backTo) {
      navigate(backTo); // Navigate to the specified URL if backTo is provided
    } else {
      navigate(-1); // Go back to the previous page
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
      title={title}
    >
      {title}
    </button>
  );
};

export default BackButton;
