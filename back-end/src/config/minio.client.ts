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

export const initMinio = async () => {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
    console.log(`Bucker "${BUCKET_NAME}" created.`);

    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
        },
      ],
    };

    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    console.log(`Bucket "${BUCKET_NAME}" is now public.`);
  }
};