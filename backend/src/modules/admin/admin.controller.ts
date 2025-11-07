import { Controller, Get, Post, Param, Patch, Query, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('messages')
  async getAllMessages() {
    return this.adminService.getAllMessages();
  }

  @Patch('messages/:id/read')
  async markMessageAsRead(@Param('id') id: string) {
    return this.adminService.markMessageAsRead(id);
  }

  @Get('clients/recent')
  async getRecentClients(@Query('limit') limit?: string) {
    return this.adminService.getRecentClients(limit ? parseInt(limit) : 10);
  }

  @Get('clients/pending')
  async getPendingValidations(@Query('limit') limit?: string) {
    return this.adminService.getPendingValidations(limit ? parseInt(limit) : 10);
  }

  @Patch('clients/:clientId/validate')
  async validatePendingClient(
    @Param('clientId') clientId: string,
    @Request() req,
  ) {
    const adminId = req.user.sub;
    const adminUsername = req.user.username;
    return this.adminService.validatePendingClient(clientId, adminId, adminUsername);
  }
}