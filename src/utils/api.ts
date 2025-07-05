import axios from "axios";

export async function fetchPost(url, formData) {
    const response = await fetch(import.meta.env.VITE_API_URL + url, {
        method: 'post',
        body: formData
    });
    const data = await response.json();
    return data;
}

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});