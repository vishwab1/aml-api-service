import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { appConfiguration } from '../config';

const { bucketName } = appConfiguration;

const s3Client = new S3Client();

export const getTemplateSignedUrl = async (folderName: string, fileName: string, expiry: number) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: `${folderName}/${fileName}`,
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * expiry || 300,
  });
  return { error: false, url, message: 'success' };
};

export const uploadSignedUrl = async (folderName: string, process_id: string, fileName: string, expiry: number) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `${folderName}/${process_id}/${fileName}`,
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * expiry || 300,
  });
  return {
    error: !url,
    url,
    message: url ? 'success' : undefined,
  };
};

export const getQuestionSignedUrl = async (folderName: string, fileName: string, expiry: number) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: `${folderName}/${fileName}`,
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * expiry || 300,
  });
  return { error: false, url, message: 'success' };
};

export const getAllCloudFolder = async (folderPath: string) => {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: folderPath,
  });
  const s3Objects = await s3Client.send(command);
  const { Contents } = s3Objects;
  return { error: false, Contents, message: 'success' };
};
