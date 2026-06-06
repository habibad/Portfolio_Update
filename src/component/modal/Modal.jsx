import React from 'react';
import { Download, X } from 'lucide-react';
import Resume_pdf from '../../assets/Md_Anikur_Rahaman.pdf';

function Modal({ showPdfModal, setShowPdfModal, darkMode }) {
  if (!showPdfModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className={`relative w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Modal Header */}
        <div className={`flex justify-between items-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <h2 className="text-xl font-bold">My Resume</h2>
          <div className="flex space-x-3">
            {/* Download Button */}
            <a
              href={Resume_pdf}
              download
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors`}
              title="Download Resume"
            >
              <Download size={20} />
            </a>
            {/* Close Button */}
            <button
              onClick={() => setShowPdfModal(false)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors`}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="h-[calc(90vh-72px)] overflow-auto">
          <iframe
            src={Resume_pdf}
            className="w-full h-full"
            title="Resume PDF"
          />
        </div>
      </div>
    </div>
  );
}

export default Modal;
