import { useState } from 'react';

export default function UploadBox({ onFileSelect }) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        onFileSelect(null);
    };

    return (
        <div className="w-full max-w-2xl">
            {!selectedFile ? (
                <label
                    className={`uploader-drag-area ${dragActive ? 'active border-primary bg-purple-50' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleChange}
                    />

                    <div className="flex flex-col items-center gap-4">
                        <div className={`text-6xl transition-transform ${dragActive ? 'scale-110' : ''}`}>
                            📄
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Drop your File here
                            </h3>
                            <p className="text-gray-600">
                                or click to browse files
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Supports PDF, DOC, DOCX up to 50MB
                        </p>
                    </div>
                </label>
            ) : (
                <div className="uploader-selected-file">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">📄</div>
                        <div className="flex flex-col">
                            <p className="font-semibold text-gray-800">{selectedFile.name}</p>
                            <p className="text-sm text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleRemove}
                        className="text-red-500 hover:text-red-700 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition"
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
}