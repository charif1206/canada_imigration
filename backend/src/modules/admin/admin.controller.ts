import { Controller, Get, Post, Param, Patch, Query, UseGuards, Request, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

/**
 * Admin Controller - Dashboard & Form Management
 * 
 * Manages:
 * - Dashboard statistics (overview of all forms)
 * - Client management (list, search, filter)
 * - Form validation (approve/reject submissions)
 * 
 * All endpoints require: JWT token + 'admin' or 'moderator' role
 */
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'moderator')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ========== DASHBOARD & OVERVIEW ==========

  /**
   * GET /admin/dashboard
   * Returns overview statistics for admin dashboard
   * Shows: total clients, validated/pending forms for each type (equivalence, residence, partner)
   */
  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ========== CLIENT LISTING & SEARCH ==========

  /**
   * GET /admin/clients/recent?limit=10
   * Returns most recently updated clients
   * Used for: Quick access to active clients
   */
  @Get('clients/recent')
  async getRecentClients(@Query('limit') limit?: string) {
    return this.adminService.getRecentClients(limit ? parseInt(limit) : 10);
  }

  /**
   * GET /admin/clients/all?page=1&limit=10
   * Returns paginated list of all clients
   * Used for: Browse all clients with pagination
   */
  @Get('clients/all')
  async getAllClients(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getAllClients(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
  }

  // ========== PENDING FORMS - GENERAL ==========

  /**
   * GET /admin/clients/pending?limit=10
   * Returns all clients with pending form submissions
   * Used for: Quick overview of all pending validations
   */
  @Get('clients/pending')
  async getPendingValidations(@Query('limit') limit?: string) {
    return this.adminService.getPendingValidations(limit ? parseInt(limit) : 10);
  }

  // ========== PENDING FORMS - BY TYPE ==========

  /**
   * GET /admin/clients/pending/equivalence
   * Returns clients waiting for equivalence form approval
   * Used for: Equivalence form review queue
   */
  @Get('clients/pending/equivalence')
  async getPendingEquivalence() {
    return this.adminService.getPendingByFormType('equivalence');
  }

  /**
   * GET /admin/clients/pending/residence
   * Returns clients waiting for residence form approval
   * Used for: Residence form review queue
   */
  @Get('clients/pending/residence')
  async getPendingResidence() {
    return this.adminService.getPendingByFormType('residence');
  }

  /**
   * GET /admin/clients/pending/partner
   * Returns clients waiting for partner/agency application approval
   * Used for: Partner approval queue
   */
  @Get('clients/pending/partner')
  async getPendingPartner() {
    return this.adminService.getPendingByFormType('partner');
  }

  // ========== RECENTLY VALIDATED ==========

  /**
   * GET /admin/clients/recently-validated?limit=20
   * Returns clients whose forms were recently approved
   * Used for: Audit trail, verification of recent decisions
   */
  @Get('clients/recently-validated')
  async getRecentlyValidated(@Query('limit') limit?: string) {
    return this.adminService.getRecentlyValidatedClients(limit ? parseInt(limit) : 20);
  }

  // ========== VALIDATION ACTIONS ==========

  /**
   * PATCH /admin/clients/:clientId/validate
   * Marks client as validated (general approval)
   * Used for: Approve entire client profile
   */
  @Patch('clients/:clientId/validate')
  async validatePendingClient(
    @Param('clientId') clientId: string,
    @Request() req,
  ) {
    const adminId = req.user.sub;
    const adminUsername = req.user.username;
    return this.adminService.validatePendingClient(clientId, adminId, adminUsername);
  }

  // ========== EQUIVALENCE FORM ACTIONS ==========

  /**
   * PATCH /admin/clients/:clientId/forms/equivalence/validate
   * Approves equivalence form
   * Status changes: pending → validated
   */
  @Patch('clients/:clientId/forms/equivalence/validate')
  async validateEquivalenceForm(@Param('clientId') clientId: string) {
    return this.adminService.validateFormSubmission(clientId, 'equivalence', 'validated');
  }

  /**
   * PATCH /admin/clients/:clientId/forms/equivalence/reject
   * Rejects equivalence form with reason
   * Status changes: pending → rejected
   * Body: { reason: "Missing documents" }
   */
  @Patch('clients/:clientId/forms/equivalence/reject')
  async rejectEquivalenceForm(@Param('clientId') clientId: string, @Body('reason') reason: string) {
    return this.adminService.validateFormSubmission(clientId, 'equivalence', 'rejected', reason);
  }

  // ========== RESIDENCE FORM ACTIONS ==========

  /**
   * PATCH /admin/clients/:clientId/forms/residence/validate
   * Approves residence form
   * Status changes: pending → validated
   */
  @Patch('clients/:clientId/forms/residence/validate')
  async validateResidenceForm(@Param('clientId') clientId: string) {
    return this.adminService.validateFormSubmission(clientId, 'residence', 'validated');
  }

  /**
   * PATCH /admin/clients/:clientId/forms/residence/reject
   * Rejects residence form with reason
   * Status changes: pending → rejected
   * Body: { reason: "Incomplete information" }
   */
  @Patch('clients/:clientId/forms/residence/reject')
  async rejectResidenceForm(@Param('clientId') clientId: string, @Body('reason') reason: string) {
    return this.adminService.validateFormSubmission(clientId, 'residence', 'rejected', reason);
  }

  // ========== PARTNER FORM ACTIONS ==========

  /**
   * PATCH /admin/clients/:clientId/forms/partner/validate
   * Approves partner/agency application
   * Status changes: pending → validated
   */
  @Patch('clients/:clientId/forms/partner/validate')
  async validatePartnerForm(@Param('clientId') clientId: string) {
    return this.adminService.validateFormSubmission(clientId, 'partner', 'validated');
  }

  /**
   * PATCH /admin/clients/:clientId/forms/partner/reject
   * Rejects partner/agency application with reason
   * Status changes: pending → rejected
   * Body: { reason: "Invalid credentials" }
   */
  @Patch('clients/:clientId/forms/partner/reject')
  async rejectPartnerForm(@Param('clientId') clientId: string, @Body('reason') reason: string) {
    return this.adminService.validateFormSubmission(clientId, 'partner', 'rejected', reason);
  }

  // ========== FORM DETAILS ==========

  /**
   * GET /admin/clients/:clientId/forms/:formType
   * Retrieves full details of a submitted form
   * Parameters:
   *   - clientId: Client ID
   *   - formType: 'equivalence', 'residence', or 'partner'
   * Used for: Review form before approving/rejecting
   */
  @Get('clients/:clientId/forms/:formType')
  async getClientFormSubmission(@Param('clientId') clientId: string, @Param('formType') formType: string) {
    return this.adminService.getClientFormSubmission(clientId, formType);
  }
}

