import axios from "axios";

const uploadMusicToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);  
  formData.append("upload_preset", "audio_upload"); 
  formData.append("cloud_name", "dnf9b6wun"); 

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dnf9b6wun/raw/upload", 
      formData
    );
    console.log("Archivo de audio subido con éxito:", res.data);
    return res.data.secure_url;  
  } catch (error) {
    console.error("Error al subir la música a Cloudinary:", error);
    throw new Error("Error al subir el audio");
  }
};

export { uploadMusicToCloudinary };
