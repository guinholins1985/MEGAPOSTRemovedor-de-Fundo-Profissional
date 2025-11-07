
import React from 'react';
import { Spinner } from './Spinner';

interface ImagePreviewProps {
  title: string;
  src: string | null;
  isLoading?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ title, src, isLoading = false }) => {
  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <div className="relative aspect-square w-full bg-slate-200 rounded-lg overflow-hidden border border-slate-300 flex items-center justify-center checkerboard">
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10">
            <div className="w-12 h-12">
                <svg className="animate-spin h-full w-full text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <p className="text-white mt-4">Removendo o fundo...</p>
          </div>
        )}
        {src ? (
          <img src={src} alt={title} className="object-contain h-full w-full" />
        ) : (
          !isLoading && <span className="text-slate-500">Prévia da imagem</span>
        )}
      </div>
    </div>
  );
};
