import { S3 } from 'aws-sdk';
import { Logger, Injectable } from '@nestjs/common';
import { extname } from "path";

@Injectable()
export class AmazonS3Service {

  generateFileName = ( file ) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    return name + randomName + fileExtName;
  };

  async upload(file,directory)
  {
    const imageName = this.generateFileName(file);
    await this.uploadS3(file.buffer, process.env.AWS_S3_BUCKET, 'public/' + directory + '/' + imageName );
    return directory + '/' + imageName;
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      CreateBucketConfiguration:
      {
        LocationConstraint: process.env.AWS_DEFAULT_REGION
      }
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    });
  }

}