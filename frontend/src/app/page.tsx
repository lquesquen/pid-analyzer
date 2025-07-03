'use client';

import { useState } from 'react';
import FileUpload from '../components/FileUpload';

interface AnalysisResults {
  pipelines: number;
  valves: number;
  instruments: number;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<AnalysisResults>({
    pipelines: 0,
    valves: 0,
    instruments: 0
  });

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8000/api/analyze-pid', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error processing file');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">PID Analyzer</h1>
        
        <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload P&ID</h2>
          <FileUpload onFileSelect={handleFileSelect} />
          {file && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Selected file: <span className="font-medium">{file.name}</span>
              </p>
              {isProcessing && (
                <div className="mt-2">
                  <p className="text-sm text-blue-600">Processing file...</p>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Detected Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Pipelines</h3>
              <p className="text-3xl font-bold text-blue-600">{results.pipelines}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">Valves</h3>
              <p className="text-3xl font-bold text-green-600">{results.valves}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium text-purple-800 mb-2">Instruments</h3>
              <p className="text-3xl font-bold text-purple-600">{results.instruments}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}