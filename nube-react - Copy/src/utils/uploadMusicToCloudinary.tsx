import axios from "axios";

// Función para subir archivos MP3 a Cloudinary
const uploadMusicToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);  // Archivo MP3
  formData.append("upload_preset", "audio_upload");  // Nombre del preset (asegúrate de que está configurado correctamente)
  formData.append("cloud_name", "dnf9b6wun");  // Tu cloud_name de Cloudinary

  try {
    // Hacer la solicitud POST al endpoint de audio de Cloudinary
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dnf9b6wun/raw/upload", // Endpoint para cargar archivos de tipo audio
      formData
    );
    console.log("Archivo de audio subido con éxito:", res.data);
    return res.data.secure_url;  // La URL del archivo MP3 subido
  } catch (error) {
    console.error("Error al subir la música a Cloudinary:", error);
    throw new Error("Error al subir el audio");
  }
};

export { uploadMusicToCloudinary };
