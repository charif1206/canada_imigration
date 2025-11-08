import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('portfolio', { storage }))
  async submitEquivalenceForm(
    @Body() equivalenceFormDto: EquivalenceFormDto,
    @UploadedFile() file?: any,
    @Request() req?: any,
  ) {
    const clientId = req?.user?.sub; // Extract clientId from JWT
    return this.formsService.submitEquivalenceForm(equivalenceFormDto, file, clientId);
  }

  @Post('residence')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('fileUpload', { storage }))
  async submitResidenceForm(
    @Body() residenceFormDto: ResidenceFormDto,
    @UploadedFile() file?: any,
    @Request() req?: any,
  ) {
    const clientId = req?.user?.sub; // Extract clientId from JWT
    return this.formsService.submitResidenceForm(residenceFormDto, file, clientId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllForms() {
    return this.formsService.getAllForms();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getFormById(@Param('id') id: string) {
    return this.formsService.getFormById(id);
  }
}
