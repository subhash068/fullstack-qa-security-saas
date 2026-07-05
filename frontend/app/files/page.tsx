'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { HardDrive, Upload, Download, Trash2, FileText, FileCode, FileSpreadsheet, Image } from 'lucide-react';

interface UploadedFile {
  id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchFiles = async () => {
    try {
      const res = await api.get('/files');
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setMessage('Uploading file...');
      await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('File uploaded successfully!');
      setSelectedFile(null);
      fetchFiles();
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Upload failed.');
    }
  };

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const response = await api.get(`/files/${fileId}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setMessage('Failed to download file.');
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      await api.delete(`/files/${fileId}`);
      setMessage('File deleted successfully.');
      fetchFiles();
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Failed to delete file.');
    }
  };

  const getFileIcon = (mime: string) => {
    if (mime.includes('image')) return <Image className="h-6 w-6 text-blue-500" />;
    if (mime.includes('json') || mime.includes('javascript')) return <FileCode className="h-6 w-6 text-purple-500" />;
    if (mime.includes('pdf')) return <FileText className="h-6 w-6 text-red-500" />;
    return <FileText className="h-6 w-6 text-slate-500" />;
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <p className="text-slate-500">Loading files...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Secure File Vault</h1>
          <p className="mt-2 text-sm text-slate-500">Secure storage with file size validation, MIME type checks, and tenant verification.</p>
        </div>

        {message && (
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Upload card */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800 h-fit">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-indigo-500" />
              Upload Document
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-350 dark:border-slate-800 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <HardDrive className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                <span className="text-sm font-semibold text-indigo-600 block">
                  {selectedFile ? selectedFile.name : 'Select files to upload'}
                </span>
                <span className="text-xs text-slate-400 block mt-1">PDF, PNG, JPEG, JSON, or TXT up to 5MB</span>
              </div>

              <button
                type="submit"
                disabled={!selectedFile}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50"
              >
                Upload File
              </button>
            </form>
          </div>

          {/* Files List column */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-indigo-500" />
              Your Uploaded Files
            </h2>

            {files.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No files uploaded yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {files.map((file) => (
                  <div key={file.id} className="py-4 flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      {getFileIcon(file.mime_type)}
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block text-sm">{file.filename}</span>
                        <span className="text-xs text-slate-400 font-mono">
                          {(file.file_size / 1024).toFixed(1)} KB | Uploaded: {new Date(file.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(file.id, file.filename)}
                        className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 text-slate-500 hover:text-red-650 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
