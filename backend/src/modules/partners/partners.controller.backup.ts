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

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OptionalJwtAuthGuard)
  async submitPartnerApplication(
    @Body() partnerDto: PartnerSubmissionDto,
    @Request() req,
  ) {
    const clientId = req.user?.sub; // Get the authenticated client ID if available
    return this.partnersService.submitPartnerApplication(partnerDto, clientId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllPartners() {
    return this.partnersService.getAllPartners();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPartnerById(@Param('id') id: string) {
    return this.partnersService.getPartnerById(id);
  }
}
