import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import s3 from '../config/s3.js';

export const uploadToS3 = async (file, folder = 'general') => {
  const ext = file.originalname.split('.').pop();
  const key = `${folder}/${randomUUID()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export const deleteFromS3 = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('.amazonaws.com/')) return;

  const key = imageUrl.split('.amazonaws.com/')[1];

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
    );
  } catch (error) {
    console.error('S3 delete error:', error.message);
  }
};
