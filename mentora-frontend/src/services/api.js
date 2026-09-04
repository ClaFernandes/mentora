const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, { method = "GET", body, token } = {}) {
    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || "Erro na comunicação com o servidor");
        error.status = response.status;
        throw error;
    }
    return data;
}