
const minioUrl = import.meta.env.VITE_MINIO_URL;

export function buildMinioUrl(filename: string): string {
    return minioUrl + '/' + filename;
}

export function extractName(filename: string): string {
    return filename.slice(filename.indexOf("-")+1);
}