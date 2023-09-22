import { Injectable } from '@nestjs/common';
import { fromFetch } from 'rxjs/fetch';
import Jimp from 'jimp';
//
import { config } from 'src/config';
import { throwClientError } from 'src/utils/response.util';
import { join } from 'path';

const fs = require('fs');

@Injectable()
export class UploadService {
  async uploadFile(image: string, name: string) {
    return fromFetch(
      `${config.imgBB_Base_Url}/upload?key=${config.imgBB_API_Key}&name=${name}&image=${image}`,
    ).subscribe((res) => {
      console.log(
        '🚀 ~ file: upload.service.ts:29 ~ UploadService ~ upload ~ res:',
        res,
      );

      return res;
    });
  }

  public async downsizeImage(
    file: Express.Multer.File,
    width: number,
    quality = 100,
    blur: boolean,
  ): Promise<{
    path: string;
    originalname: string;
    filename: string;
    mimetype: string;
    destination: string;
    size: number;
  }> {
    try {
      const filePath = join(__dirname, file.path);

      const imageFile = await Jimp.read(file.path);
      const image = imageFile.resize(width, Jimp.AUTO).quality(quality);
      
      if (blur) image.blur(2);
      await image.writeAsync(filePath);
      const stats = fs.statSync(filePath);

      return {
        originalname: file.originalname,
        path: filePath,
        filename: 'resized_' + file.filename,
        mimetype: file.mimetype,
        destination: file.destination,
        size: stats.size,
      };
    } catch (e) {
      throwClientError('Error while downsizing file');
    }
  }
}
