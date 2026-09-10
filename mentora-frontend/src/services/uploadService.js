import { apiRequest } from "./api";

export async function uploadImage(token, file) {
    const formData = new FormData();
    formData.append("image", file);

    return apiRequest("/upload", {
        method: "POST",
        token,
        body: formData,
    });
}