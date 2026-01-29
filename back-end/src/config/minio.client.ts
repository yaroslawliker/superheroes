import * as Minio from 'minio';
import { env } from './env'


export const minioClient = new Minio.Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: false,
  accessKey: env.MINIO_USER,
  secretKey: env.MINIO_PASSWORD,
});

export const BUCKET_NAME = 'images';
