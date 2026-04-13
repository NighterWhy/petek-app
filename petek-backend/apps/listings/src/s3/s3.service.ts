import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor() {
    this.region = process.env.AWS_S3_REGION ?? '';
    this.bucket = process.env.AWS_S3_BUCKET_NAME ?? '';

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      },
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const extension = file.originalname.split('.').pop();
    const key = `listings/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.client.send(command);
    } catch (error) {
      throw new InternalServerErrorException(`S3 upload failed: ${(error as Error).message}`);
    }

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
