import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { appConfiguration } from '../config';

const { bucketName, bulkUploadFolder, presignedUrlExpiry } = appConfiguration;

const s3Client = new S3Client();

export const getPresignedUrl = async (fileName: string) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: presignedUrlExpiry,
  });
  return {
    error: !url,
    url,
    message: url ? 'success' : 'error getting signed url',
  };
};

export const uploadUrl = async (process_id: string, fileName: string) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `${bulkUploadFolder}/${process_id}/${fileName}`,
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: presignedUrlExpiry,
  });
  return {
    error: !url,
    url,
    message: url ? 'success' : undefined,
  };
};
