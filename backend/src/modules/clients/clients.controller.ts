import { Controller, Post, Body, Get, Param, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ValidateClientDto } from './dto/validate-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

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