import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PartnersService } from './partners.service';
import { PartnerSubmissionDto } from './dto/partner-submission.dto';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async submitPartnerApplication(@Body() partnerDto: PartnerSubmissionDto) {
    return this.partnersService.submitPartnerApplication(partnerDto);
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
