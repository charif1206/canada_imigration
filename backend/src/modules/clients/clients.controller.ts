import { Controller, Post, Body, Get, Param, Patch, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createClient(createClientDto);
  }

  @Get()
  async getAllClients() {
    return this.clientsService.getAllClients();
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
}