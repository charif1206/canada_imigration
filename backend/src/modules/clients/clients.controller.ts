import { Controller, Post, Body, Get, Param, Patch, HttpCode, HttpStatus, UseGuards, Request, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ValidateClientDto } from './dto/validate-client.dto';
import { ClientRegisterDto } from './dto/client-register.dto';
import { ClientLoginDto } from './dto/client-login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: ClientRegisterDto) {
    return this.clientsService.registerClient(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: ClientLoginDto) {
    return this.clientsService.loginClient(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.clientsService.getClientProfile(req.user.sub);
  }

  @Get()
  async getAllClients(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.clientsService.getAllClients(pageNum, limitNum);
  }

  @Get(':id')
  async getClientById(@Param('id') id: string) {
    return this.clientsService.getClientById(id);
  }

  @Get(':id/validation-status')
  async getValidationStatus(@Param('id') id: string) {
    return this.clientsService.getValidationStatus(id);
  }

  @Patch(':id/validate')
  @UseGuards(JwtAuthGuard)
  async validateClient(
    @Param('id') id: string,
    @Body() validateDto: ValidateClientDto,
  ) {
    return this.clientsService.validateClient(id, validateDto);
  }

  @Post('messages')
  @HttpCode(HttpStatus.CREATED)
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.clientsService.createMessage(createMessageDto);
  }

  @Get(':id/messages')
  async getClientMessages(@Param('id') id: string) {
    return this.clientsService.getClientMessages(id);
  }

  /**
   * Verify client email with token
   * Public route - no authentication required
   */
  @Get('auth/verify-email')
  async verifyEmail(@Body() body: { token: string }) {
    return this.clientsService.verifyEmail(body.token);
  }

  /**
   * Resend verification email
   * Public route - no authentication required
   */
  @Post('auth/resend-verification')
  async resendVerification(@Body() body: { email: string }) {
    return this.clientsService.resendVerificationEmail(body.email);
  }

  /**
   * Request password reset (forgot password)
   * Public route - no authentication required
   */
  @Post('auth/forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    return this.clientsService.forgotPassword(body.email);
  }

  /**
   * Reset password with token
   * Public route - no authentication required
   */
  @Post('auth/reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.clientsService.resetPassword(body.token, body.newPassword);
  }
}