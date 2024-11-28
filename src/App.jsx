import { useState } from "react";
import axios from "axios";
import { FiUpload, FiDownload } from "react-icons/fi";
import { motion } from "framer-motion";

const App = () => {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState(""); // Nuevo estado para el enlace de descarga
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Por favor, selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setMessage("Subiendo archivo...");
      const response = await axios.post("http://localhost:3000/compile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Manejar respuesta
      const { message: serverMessage, downloadLink: serverLink } = response.data;
      setMessage(serverMessage || "Archivo subido y compilado con éxito.");
      setDownloadLink(serverLink || ""); // Guardar enlace de descarga
      setError("");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setMessage("");
      setError("Hubo un error al compilar el archivo.");
    }
  };

  const handleDownload = async () => {
    if (!downloadLink) {
      setError("No hay ningún archivo para descargar.");
      return;
    }

    try {
      setMessage("Iniciando descarga...");
      const response = await axios.get(`http://localhost:3000${downloadLink}`, {
        responseType: "blob",
      });

      // Crear un enlace para descargar el archivo
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = downloadLink.split("/").pop(); // Extraer nombre del archivo
      link.click();
      setMessage("Descarga completada.");
      setError("");
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      setMessage("");
      setError("Hubo un error al descargar el archivo.");
    }
  };

  // Modal para mensajes de éxito o error
  const Modal = () => {
    if (!message && !error) return null;

    return (
      <motion.div
        className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className={`bg-white p-6 rounded-lg shadow-xl max-w-sm w-full ${error ? "bg-red-100" : "bg-green-100"}`}
        >
          <h3 className="text-xl font-semibold text-gray-800">{error ? "Error" : "Éxito"}</h3>
          <p className="text-gray-600">{error || message}</p>
          <button
            onClick={() => {
              setMessage("");
              setError("");
            }}
            className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Gestión de Archivos .pwn y .amx</h1>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card de Subida de Archivos */}
        <motion.div
          className="p-6 border border-gray-300 rounded-lg bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FiUpload className="text-2xl text-blue-500" /> Subir archivo .pwn
          </h2>
          <form onSubmit={handleUpload} className="flex flex-col gap-4 items-center">
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all duration-300 mt-4"
            >
              Subir y Compilar
            </button>
          </form>
        </motion.div>

        {/* Card de Descarga de Archivos */}
        <motion.div
          className="p-6 border border-gray-300 rounded-lg bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FiDownload className="text-2xl text-green-500" /> Descargar archivo compilado
          </h2>
          {downloadLink ? (
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all duration-300 w-full"
            >
              Descargar Archivo
            </button>
          ) : (
            <p className="text-gray-500">Sube un archivo para habilitar la descarga.</p>
          )}
        </motion.div>
      </div>

      <Modal />
    </div>
  );
};

export default App;
