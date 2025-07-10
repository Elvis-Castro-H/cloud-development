import axios from "axios";

const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file); 
  formData.append("upload_preset", "image_upload");
  formData.append("cloud_name", "dnf9b6wun"); 

  // Enviar la solicitud a Cloudinary
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dnf9b6wun/image/upload",
    formData
  );

  return res.data.secure_url; // Devuelve la URL de la imagen subida
};

export { uploadImageToCloudinary };
