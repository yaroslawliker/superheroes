
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export function buildBackendUrl(path: string): string {
    return backendUrl + path;
}