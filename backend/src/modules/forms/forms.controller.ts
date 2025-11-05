import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FormsService } from './forms.service';
import { EquivalenceFormDto } from './dto/equivalence-form.dto';
import { ResidenceFormDto } from './dto/residence-form.dto';

// Configure multer storage
const storage = diskStorage({
  destination: './uploads/forms',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post('equivalence')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('portfolio', { storage }))
  async submitEquivalenceForm(
    @Body() equivalenceFormDto: EquivalenceFormDto,
    @UploadedFile() file?: any,
  ) {
    return this.formsService.submitEquivalenceForm(equivalenceFormDto, file);
  }

  @Post('residence')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('fileUpload', { storage }))
  async submitResidenceForm(
    @Body() residenceFormDto: ResidenceFormDto,
    @UploadedFile() file?: any,
  ) {
    return this.formsService.submitResidenceForm(residenceFormDto, file);
  }
}
