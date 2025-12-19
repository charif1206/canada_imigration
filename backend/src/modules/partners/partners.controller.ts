import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { PartnersService } from './partners.service';
import { PartnerSubmissionDto } from './dto/partner-submission.dto';
import {
  PartnerSubmissionResponse,
  PartnerSubmission,
} from './interfaces/partners.interface';

/**
 * Partners Controller
 * Handles all partner application endpoints
 * 
 * Endpoints:
 * - POST /partners - Submit partner application (optional auth)
 * - GET /partners - Get all partner applications (protected)
 * - GET /partners/:id - Get partner by ID (protected)
 */
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  // ========================================
  // PUBLIC/OPTIONAL AUTH ENDPOINTS
  // ========================================

  /**
   * Submit partner application
   * Authentication is optional. If authenticated, client ID is associated with submission.
   * @param partnerDto - Partner submission data
   * @param req - Request object containing optional JWT user info
   * @returns Partner submission response
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OptionalJwtAuthGuard)
  async submitPartnerApplication(
    @Body() partnerDto: PartnerSubmissionDto,
    @Request() req?: any,
  ): Promise<PartnerSubmissionResponse> {
    const clientId = req?.user?.sub;
    return this.partnersService.submitPartnerApplication(partnerDto, clientId);
  }

  // ========================================
  // PROTECTED ENDPOINTS
  // ========================================

  /**
   * Get all partner submissions
   * Requires authentication.
   * @returns Array of partner submissions
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllPartners(): Promise<PartnerSubmission[]> {
    return this.partnersService.getAllPartners();
  }

  /**
   * Get partner submission by ID
   * Requires authentication.
   * @param id - Partner submission ID
   * @returns Partner submission or null
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPartnerById(@Param('id') id: string): Promise<PartnerSubmission | null> {
    return this.partnersService.getPartnerById(id);
  }
}
