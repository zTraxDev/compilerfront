import { useState } from "react";
import axios from "axios";
import { FiUpload, FiDownload } from "react-icons/fi";
import { motion } from "framer-motion";

const App = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
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
      await axios.post("http://localhost:3000/compile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Archivo subido y compilado con éxito.");
      setError("");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setMessage("");
      setError("Hubo un error al compilar el archivo.");
    }
  };

  const handleDownload = async () => {
    if (!filename) {
      setError("Por favor, ingresa el nombre del archivo.");
      return;
    }

    try {
      setMessage("Iniciando descarga...");
      const response = await axios.get(`http://localhost:3000/download/${filename}.amx`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.amx`;
      link.click();
      setMessage("Descarga completada.");
      setError("");
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      setMessage("");
      setError("Hubo un error al descargar el archivo.");
    }
  };

  const Modal = () => {
    if (!message && !error) return null;

    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className={`bg-white p-6 rounded-lg shadow-lg max-w-sm w-full transform ${
            error ? "border-red-500" : "border-green-500"
          } border-t-4`}
        >
          <h3 className={`text-xl font-bold mb-2 ${error ? "text-red-600" : "text-green-600"}`}>
            {error ? "Error" : "Éxito"}
          </h3>
          <p className="text-gray-600">{error || message}</p>
          <button
            onClick={() => {
              setMessage("");
              setError("");
            }}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center p-4">
      <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-8">
        Gestión de Archivos <span className="text-blue-500">.pwn</span> y <span className="text-green-500">.amx</span>
      </h1>

      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Upload Card */}
        <motion.div
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiUpload className="text-3xl text-blue-500" />
            Subir archivo .pwn
          </h2>
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <input
              type="file"
              accept=".pwn"
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all"
            >
              Subir y Compilar
            </button>
          </form>
        </motion.div>

        {/* Download Card */}
        <motion.div
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiDownload className="text-3xl text-green-500" />
            Descargar archivo compilado
          </h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Ingresa el nombre del archivo"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleDownload}
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all"
            >
              Descargar .amx
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <Modal />
    </div>
  );
};

export default App;
