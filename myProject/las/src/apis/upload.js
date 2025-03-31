import axios from "axios";

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post("/upload", formData);
  return response.data;
}
export default uploadFile;