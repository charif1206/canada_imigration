import { Controller, Get, Post, Param, Patch, Query, UseGuards, Request, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'moderator')
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

  @Get('clients/all')
  async getAllClients(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getAllClients(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
  }

  @Get('clients/pending')
  async getPendingValidations(@Query('limit') limit?: string) {
    return this.adminService.getPendingValidations(limit ? parseInt(limit) : 10);
  }

  @Get('clients/pending/equivalence')
  async getPendingEquivalence() {
    return this.adminService.getPendingByFormType('equivalence');
  }

  @Get('clients/pending/residence')
  async getPendingResidence() {
    return this.adminService.getPendingByFormType('residence');
  }

  @Get('clients/pending/partner')
  async getPendingPartner() {
    return this.adminService.getPendingByFormType('partner');
  }

  @Get('clients/recently-validated')
  async getRecentlyValidated(@Query('limit') limit?: string) {
    return this.adminService.getRecentlyValidatedClients(limit ? parseInt(limit) : 20);
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

  @Patch('clients/:clientId/forms/equivalence/validate')
  async validateEquivalenceForm(@Param('clientId') clientId: string) {
    return this.adminService.validateFormSubmission(clientId, 'equivalence', 'validated');
  }

  @Patch('clients/:clientId/forms/equivalence/reject')
  async rejectEquivalenceForm(@Param('clientId') clientId: string, @Body('reason') reason: string) {
    return this.adminService.validateFormSubmission(clientId, 'equivalence', 'rejected', reason);
  }

  @Patch('clients/:clientId/forms/residence/validate')
  async validateResidenceForm(@Param('clientId') clientId: string) {
    return this.adminService.validateFormSubmission(clientId, 'residence', 'validated');
  }

  @Patch('clients/:clientId/forms/residence/reject')
  async rejectResidenceForm(@Param('clientId') clientId: string, @Body('reason') reason: string) {
    return this.adminService.validateFormSubmission(clientId, 'residence', 'rejected', reason);
  }

  @Patch('clients/:clientId/forms/partner/validate')
  async validatePartnerForm(@Param('clientId') clientId: string) {
    return this.adminService.validateFormSubmission(clientId, 'partner', 'validated');
  }

  @Patch('clients/:clientId/forms/partner/reject')
  async rejectPartnerForm(@Param('clientId') clientId: string, @Body('reason') reason: string) {
    return this.adminService.validateFormSubmission(clientId, 'partner', 'rejected', reason);
  }

  @Get('clients/:clientId/forms/:formType')
  async getClientFormSubmission(@Param('clientId') clientId: string, @Param('formType') formType: string) {
    return this.adminService.getClientFormSubmission(clientId, formType);
  }
}
