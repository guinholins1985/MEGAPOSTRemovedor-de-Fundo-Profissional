
import React, { useState, useCallback } from 'react';
import { removeBackground } from './services/geminiService';
import { UploadIcon } from './components/UploadIcon';
import { Spinner } from './components/Spinner';
import { ImagePreview } from './components/ImagePreview';

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Por favor, selecione um arquivo de imagem válido.');
        return;
      }
      
      setFile(selectedFile);
      setProcessedImage(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveBackground = useCallback(async () => {
    if (!originalImage || !file) return;

    setIsLoading(true);
    setError(null);
    setProcessedImage(null);

    try {
      const base64Data = originalImage.split(',')[1];
      const newBase64Data = await removeBackground(base64Data, file.type);
      setProcessedImage(`data:image/png;base64,${newBase64Data}`);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao remover o fundo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, file]);
  
  const handleDownload = () => {
    if (!processedImage || !file) return;
    const link = document.createElement('a');
    link.href = processedImage;
    const nameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
    link.download = `${nameWithoutExtension}-sem-fundo.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Removedor de Fundo Profissional</h1>
          <p className="mt-3 text-lg text-slate-600">Com a tecnologia do Gemini AI, remova fundos de imagens com um clique.</p>
        </header>

        <main className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 flex flex-col items-center justify-center bg-slate-100 rounded-lg p-6 border-2 border-dashed border-slate-300">
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center text-center w-full">
                <UploadIcon />
                <span className="mt-4 text-xl font-semibold text-slate-700">Arraste ou clique para enviar</span>
                <span className="mt-1 text-sm text-slate-500">PNG, JPG, WEBP, etc.</span>
              </label>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
              
              {originalImage && (
                <button
                  onClick={handleRemoveBackground}
                  disabled={isLoading}
                  className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                      Processando...
                    </>
                  ) : (
                    'Remover Fundo'
                  )}
                </button>
              )}
            </div>

            <div className="lg:col-span-3">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                  <strong className="font-bold">Erro: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                <ImagePreview title="Original" src={originalImage} />
                <ImagePreview title="Sem Fundo" src={processedImage} isLoading={isLoading} />
              </div>
              {processedImage && !isLoading && (
                 <button
                  onClick={handleDownload}
                  className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
                >
                  Baixar Imagem
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
