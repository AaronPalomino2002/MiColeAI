const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getAuthHeader() {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export const api = {
    get: async (endpoint: string) => {
        const authHeader = await getAuthHeader();
        const headers: HeadersInit = authHeader ? authHeader : {};
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Something went wrong");
        }
        return response.json();
    },

    post: async (endpoint: string, body: any) => {
        const authHeader = await getAuthHeader();
        const headers: HeadersInit = authHeader
            ? { "Content-Type": "application/json", ...authHeader }
            : { "Content-Type": "application/json" };
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Something went wrong");
        }
        return response.json();
    },

    patch: async (endpoint: string, body: any) => {
        const authHeader = await getAuthHeader();
        const headers: HeadersInit = authHeader
            ? { "Content-Type": "application/json", ...authHeader }
            : { "Content-Type": "application/json" };
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Something went wrong");
        }
        return response.json();
    },

    postForm: async (endpoint: string, formData: FormData) => {
        const authHeader = await getAuthHeader();
        const headers: HeadersInit = authHeader ? authHeader : {};
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers,
            body: formData,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Something went wrong");
        }
        return response.json();
    },
};
