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
import { PartnerFormDto } from './dto/partner-form.dto';
import { FormSubmissionResponse, FormSubmission } from './interfaces/forms.interface';
import { FILE_UPLOAD_CONFIG } from './constants/forms.constants';

/**
 * Configure multer storage for file uploads
 */
const storage = diskStorage({
  destination: FILE_UPLOAD_CONFIG.UPLOAD_DIRECTORY,
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

/**
 * Forms Controller
 * Handles all form submission endpoints
 * 
 * Endpoints:
 * - POST /forms/equivalence - Submit equivalence form with file upload
 * - POST /forms/residence - Submit residence form with file upload
 * - POST /forms/partner - Submit partner application
 * - GET /forms - Get all form submissions (protected)
 * - GET /forms/:id - Get form by ID (protected)
 */
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  // ========================================
  // FORM SUBMISSION ENDPOINTS
  // ========================================

  /**
   * Submit equivalence form
   * Requires authentication. Accepts portfolio file upload.
   * @param equivalenceFormDto - Equivalence form data
   * @param file - Portfolio file (optional)
   * @param req - Request object containing JWT user info
   * @returns Form submission response
   */
  @Post('equivalence')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('portfolio', { storage }))
  async submitEquivalenceForm(
    @Body() equivalenceFormDto: EquivalenceFormDto,
    @UploadedFile() file?: any,
    @Request() req?: any,
  ): Promise<FormSubmissionResponse> {
    const clientId = req?.user?.sub;
    return this.formsService.submitEquivalenceForm(equivalenceFormDto, file, clientId);
  }

  /**
   * Submit residence form
   * Requires authentication. Accepts document file upload.
   * @param residenceFormDto - Residence form data
   * @param file - Document file (optional)
   * @param req - Request object containing JWT user info
   * @returns Form submission response
   */
  @Post('residence')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('fileUpload', { storage }))
  async submitResidenceForm(
    @Body() residenceFormDto: ResidenceFormDto,
    @UploadedFile() file?: any,
    @Request() req?: any,
  ): Promise<FormSubmissionResponse> {
    const clientId = req?.user?.sub;
    return this.formsService.submitResidenceForm(residenceFormDto, file, clientId);
  }

  /**
   * Submit partner application
   * Requires authentication. No file upload.
   * @param partnerFormDto - Partner form data
   * @param req - Request object containing JWT user info
   * @returns Form submission response
   */
  @Post('partner')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async submitPartnerForm(
    @Body() partnerFormDto: PartnerFormDto,
    @Request() req?: any,
  ): Promise<FormSubmissionResponse> {
    const clientId = req?.user?.sub;
    return this.formsService.submitPartnerForm(partnerFormDto, clientId);
  }

  // ========================================
  // FORM RETRIEVAL ENDPOINTS (Protected)
  // ========================================

  /**
   * Get all form submissions
   * Requires authentication. Returns all forms with client information.
   * @returns Array of form submissions
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllForms(): Promise<FormSubmission[]> {
    return this.formsService.getAllForms();
  }

  /**
   * Get form submission by ID
   * Requires authentication. Returns single form with client information.
   * @param id - Form submission ID
   * @returns Form submission or null
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getFormById(@Param('id') id: string): Promise<FormSubmission | null> {
    return this.formsService.getFormById(id);
  }
}
