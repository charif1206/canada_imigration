import {
  EquivalenceFormData,
  ResidenceFormData,
  PartnerFormData,
} from '../interfaces/forms.interface';
import { EquivalenceFormDto } from '../dto/equivalence-form.dto';
import { ResidenceFormDto } from '../dto/residence-form.dto';
import { PartnerFormDto } from '../dto/partner-form.dto';
import { FORM_TYPES } from '../constants/forms.constants';

/**
 * Create equivalence form data object
 * @param dto - Equivalence form DTO
 * @param fileUrl - Uploaded file URL (optional)
 * @returns Formatted equivalence form data
 */
export function createEquivalenceFormData(
  dto: EquivalenceFormDto,
  fileUrl: string | null,
): EquivalenceFormData {
  return {
    type: FORM_TYPES.EQUIVALENCE,
    email: dto.email,
    telephone: dto.telephone,
    prenom: dto.prenom,
    nom: dto.nom,
    adresse: dto.adresse,
    codePostal: dto.codePostal,
    niveau: dto.niveau,
    universite: dto.universite,
    titreLicence: dto.titreLicence,
    titreMaster: dto.titreMaster || null,
    anneeDebut: dto.anneeDebut,
    anneeObtentionLicence: dto.anneeObtentionLicence,
    anneeObtentionMaster: dto.anneeObtentionMaster || null,
    portfolioUrl: fileUrl,
    submittedAt: new Date(),
  };
}

/**
 * Create residence form data object
 * @param dto - Residence form DTO
 * @param fileUrl - Uploaded file URL (optional)
 * @returns Formatted residence form data
 */
export function createResidenceFormData(
  dto: ResidenceFormDto,
  fileUrl: string | null,
): ResidenceFormData {
  return {
    type: FORM_TYPES.RESIDENCE,
    nomComplet: dto.nomComplet,
    dateNaissance: dto.dateNaissance,
    paysResidence: dto.paysResidence,
    programme: dto.programme,
    numeroDossier: dto.numeroDossier,
    etape: dto.etape,
    diplome: dto.diplome || null,
    anneesEtudes: dto.anneesEtudes || null,
    anneesExperience: dto.anneesExperience || null,
    situationFamiliale: dto.situationFamiliale || null,
    fileUrl: fileUrl,
    submittedAt: new Date(),
  };
}

/**
 * Create partner form data object
 * @param dto - Partner form DTO
 * @returns Formatted partner form data
 */
export function createPartnerFormData(dto: PartnerFormDto): PartnerFormData {
  return {
    type: FORM_TYPES.PARTNER,
    agencyName: dto.agencyName,
    managerName: dto.managerName,
    email: dto.email,
    phone: dto.phone,
    address: dto.address || null,
    city: dto.city || null,
    clientCount: dto.clientCount || null,
    message: dto.message || null,
    submittedAt: new Date(),
  };
}

/**
 * Generate form ID
 * @param formType - Type of form
 * @returns Unique form ID
 */
export function generateFormId(formType: 'EQUIVALENCE' | 'RESIDENCE' | 'PARTNER'): string {
  const prefixes = {
    EQUIVALENCE: 'EQUIV',
    RESIDENCE: 'RESID',
    PARTNER: 'PARTNER',
  };
  
  return `${prefixes[formType]}-${Date.now()}`;
}
