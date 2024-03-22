import { MCV2_AWS_ACCESS_KEY, MCV2_AWS_SECRET_KEY } from './server-env';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';

export class S3Service {
  private static client = new S3Client({
    region: 'us-west-2',
    credentials: {
      secretAccessKey: MCV2_AWS_SECRET_KEY,
      accessKeyId: MCV2_AWS_ACCESS_KEY,
    },
  });

  private static putObject(params: PutObjectCommandInput) {
    const command = new PutObjectCommand(params);
    return this.client.send(command);
  }

  public static async saveSvg(params: {
    chainId: number;
    frameSlug: string;
    file: File | Blob;
  }) {
    const { chainId, file, frameSlug } = params;
    const key = `${chainId}/${frameSlug}/image.svg`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await this.putObject({
      ACL: 'public-read',
      Bucket: 'mint-club-v2',
      Key: key,
      Body: buffer,
    });

    const url = `https://mint-club-v2.s3.us-west-2.amazonaws.com/${key}`;

    return url;
  }
}
