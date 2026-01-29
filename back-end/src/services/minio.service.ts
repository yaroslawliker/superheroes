import { Client as MinioClient } from "minio"



export class MinioService {
    minioClient: MinioClient
    bucketName: string

    constructor(minioClient: MinioClient, bucketName: string){
        this.minioClient = minioClient;
        this.bucketName = bucketName;

        this.initMinio();
    }
    
    /**
     * Creates a bucket if absent and sets the public read policy
     */
    async initMinio() {
        const exists = await this.minioClient.bucketExists(this.bucketName);
        
        if (!exists) {
            await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
            console.log(`Bucker "${this.bucketName}" created.`);

            const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                Effect: 'Allow',
                Principal: { AWS: ['*'] },
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                },
            ],
            };

            await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
            console.log(`Bucket "${this.bucketName}" is now public.`);
        }
    };

    /**
     * Saves files, generating a unique name for everyone
     * @param files the files to save
     * @returns name of created files
     */
    saveFiles(files: Express.Multer.File[]) {
        // Saving files to minIO
        const uploadPromises = files.map(async (file) => {
            const fileName = this.generateFileName(file.originalname)
            
            await this.minioClient.putObject(
                this.bucketName,
                fileName,
                file.buffer,
                file.size,
                { 'Content-Type': file.mimetype }
            );
            
            return fileName; 
        });

        return Promise.all(uploadPromises);
    }

    generateFileName(originalFileName: string): string {
        return `${Date.now()}-${originalFileName}`;
    }


    removeFiles(filenames: string[]) {
        return this.minioClient.removeObjects(this.bucketName, filenames);
    }

}