import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

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
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post("http://localhost:3000/compile", formData, {
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
    <div>
      <h2>Subir archivo .pwn</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".pwn" onChange={handleFileChange} />
        <button type="submit">Subir y Compilar</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default FileUpload;
