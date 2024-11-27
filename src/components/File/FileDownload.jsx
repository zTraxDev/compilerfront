import React, { useState } from "react";
import axios from "axios";

// Componente Modal
const Modal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h3 className="text-xl font-semibold">Mensaje</h3>
        <p>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

const FileUpload = ({ setMessage }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Por favor, selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setMessage("Subiendo archivo...");
      await axios.post("http://localhost:3000/compile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Archivo subido y compilado con éxito.");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setMessage("Hubo un error al compilar el archivo.");
    }
  };

  return (
    <div className="p-4 mb-6 border border-gray-300 rounded">
      <h2 className="text-xl font-semibold">Subir archivo .pwn</h2>
      <form onSubmit={handleUpload} className="mt-4">
        <input
          type="file"
          accept=".pwn"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Subir y Compilar
        </button>
      </form>
    </div>
  );
};

const FileDownload = ({ setMessage }) => {
  const [filename, setFilename] = useState("");

  const handleDownload = async () => {
    if (!filename) {
      setMessage("Por favor, ingresa el nombre del archivo.");
      return;
    }

    try {
      setMessage("Iniciando descarga...");
      const response = await axios.get(`http://localhost:3000/download/${filename}.amx`, {
        responseType: "blob",
      });

      // Crear un enlace para descargar el archivo
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.amx`;
      link.click();
      setMessage("Descarga completada.");
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      setMessage("Hubo un error al descargar el archivo.");
    }
  };

  return (
    <div className="p-4 mb-6 border border-gray-300 rounded">
      <h2 className="text-xl font-semibold">Descargar archivo compilado</h2>
      <input
        type="text"
        placeholder="Ingresa el nombre del archivo (sin .amx)"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        className="border border-gray-300 p-2 rounded mb-4"
      />
      <button
        onClick={handleDownload}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Descargar .amx
      </button>
    </div>
  );
};

const App = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Gestión de Archivos .pwn y .amx</h1>
      <FileUpload setMessage={setMessage} />
      <FileDownload setMessage={setMessage} />
      <Modal message={message} onClose={() => setMessage("")} />
    </div>
  );
};

export default App;
