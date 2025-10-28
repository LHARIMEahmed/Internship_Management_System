import React, { useState } from 'react';

/**
 * Composant réutilisable pour créer une section d'accordéon avec Tailwind CSS
 * @param {string} id - ID unique de la section
 * @param {string} title - Titre de la section
 * @param {boolean} isOpen - Si la section est ouverte initialement
 * @param {React.ReactNode} children - Contenu de la section
 * @returns {JSX.Element}
 */
const AccordionSection = ({ id, title, isOpen = false, children }) => {
  const [open, setOpen] = useState(isOpen);
  
  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <h2 className="mb-0">
        <button 
          className={`group relative flex w-full items-center rounded-t-lg border-0 bg-white px-5 py-4 text-left text-base font-semibold text-gray-800 transition ${open ? 'bg-blue-50' : ''}`}
          type="button" 
          onClick={toggleOpen}
          aria-expanded={open}
        >
          <span className="flex-1">{title}</span>
          <span className={`ml-auto h-5 w-5 transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>
      </h2>
      <div 
        id={id} 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="p-5 border-t border-gray-200 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionSection;