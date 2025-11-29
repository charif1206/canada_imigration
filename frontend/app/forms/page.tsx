'use client';

import React, { useState, useEffect } from 'react';
import { useSubmitEquivalenceForm, useSubmitResidenceForm } from '../../lib/hooks/useForms';
import { toast } from 'react-toastify';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/useAuth';

const InputField: React.FC<{ label: string; type: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; placeholder?: string; error?: string; }> = ({ label, type, name, value, onChange, required = true, placeholder, error }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent sm:text-sm transition ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);

const SelectField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: {value: string, label: string}[]; required?: boolean; placeholder: string; error?: string; }> = ({ label, name, value, onChange, options, required = true, placeholder, error }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent sm:text-sm rounded-md transition ${error ? 'border-red-500' : 'border-gray-300'}`}
        >
            <option value="">{placeholder}</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);


const FormSection: React.FC<{ title: string; subtitle: string; children: React.ReactNode; id: string; }> = ({ title, subtitle, children, id }) => (
    <section id={id} className="mb-16 scroll-mt-24">
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="mb-6 text-center md:text-start">
                <h2 className="text-2xl font-bold text-blue-900">{title}</h2>
                <p className="text-slate-500 mt-1">{subtitle}</p>
            </div>
            {children}
        </div>
    </section>
);

const FormulaireEquivalence: React.FC<{onSubmitSuccess: () => void}> = ({onSubmitSuccess}) => {
    const [formData, setFormData] = useState({
        prenom: '', nom: '', adresse: '', codePostal: '', niveau: '', universite: '',
        titreLicence: '', titreMaster: '', anneeDebut: '', anneeObtentionLicence: '',
        anneeObtentionMaster: '', email: '', telephone: ''
    });
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const submitEquivalenceMutation = useSubmitEquivalenceForm();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('❌ File size must be less than 5MB');
                return;
            }
            setFile(file);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.prenom.trim()) newErrors.prenom = 'First name is required';
        if (!formData.nom.trim()) newErrors.nom = 'Last name is required';
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
        if (!formData.telephone.trim()) newErrors.telephone = 'Phone number is required';
        if (!formData.universite.trim()) newErrors.universite = 'University is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('❌ Please fill all required fields correctly');
            return;
        }
        
        // Create FormData for multipart upload
        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });
        if (file) {
            submitData.append('portfolio', file);
        }
        
        // Submit using React Query mutation
        submitEquivalenceMutation.mutate(submitData, {
            onSuccess: () => {
                toast.success('✅ Formulaire d\'équivalence soumis avec succès! Un conseiller vous contactera dans les 24 heures.');
                onSubmitSuccess();
                // Reset form
                setFormData({
                    prenom: '', nom: '', adresse: '', codePostal: '', niveau: '', universite: '',
                    titreLicence: '', titreMaster: '', anneeDebut: '', anneeObtentionLicence: '',
                    anneeObtentionMaster: '', email: '', telephone: ''
                });
                setFile(null);
                setErrors({});
            },
            onError: (error: unknown) => {
                const errorMessage = error instanceof Error ? error.message : 'Échec de la soumission du formulaire. Veuillez réessayer.';
                toast.error(`❌ ${errorMessage}`);
            },
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-6">
                <InputField label="Prénom" type="text" name="prenom" value={formData.prenom} onChange={handleChange} error={errors.prenom} />
                <InputField label="Nom" type="text" name="nom" value={formData.nom} onChange={handleChange} error={errors.nom} />
                <InputField label="Adresse" type="text" name="adresse" value={formData.adresse} onChange={handleChange} />
                <InputField label="Code postal" type="text" name="codePostal" value={formData.codePostal} onChange={handleChange} />
                <SelectField label="Niveau final le plus élevé" name="niveau" value={formData.niveau} onChange={handleChange} options={[{value:'Licence', label:'Licence'}, {value:'Master', label:'Master'}, {value:'Doctorat', label:'Doctorat'}]} placeholder="Sélectionnez..." />
                <InputField label="Université" type="text" name="universite" value={formData.universite} onChange={handleChange} error={errors.universite} />
                <InputField label="Titre du diplôme de licence" type="text" name="titreLicence" value={formData.titreLicence} onChange={handleChange} />
                <InputField label="Titre du master" type="text" name="titreMaster" value={formData.titreMaster} onChange={handleChange} required={false} />
                <InputField label="Année de début d'étude" type="text" name="anneeDebut" value={formData.anneeDebut} onChange={handleChange} />
                <InputField label="Année d'obtention de la licence" type="text" name="anneeObtentionLicence" value={formData.anneeObtentionLicence} onChange={handleChange} />
                <InputField label="Année d'obtention du master" type="text" name="anneeObtentionMaster" value={formData.anneeObtentionMaster} onChange={handleChange} required={false} />
                <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
                <InputField label="Numéro de téléphone" type="tel" name="telephone" value={formData.telephone} onChange={handleChange} error={errors.telephone} />
                <div className="md:col-span-2">
                    <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">Portfolio (PDF, optional)</label>
                    <input type="file" name="portfolio" id="portfolio" accept=".pdf" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
                    {file && <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>}
                </div>
            </div>
            <button 
                type="submit" 
                disabled={submitEquivalenceMutation.isPending}
                className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-red-300 disabled:cursor-not-allowed"
            >
                {submitEquivalenceMutation.isPending ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                    </span>
                ) : (
                    'Soumettre'
                )}
            </button>
        </form>
    );
};

const FormulaireResidence: React.FC<{onSubmitSuccess: () => void}> = ({onSubmitSuccess}) => {
    const [formData, setFormData] = useState({
        nomComplet: '', dateNaissance: '', paysResidence: '', programme: '', 
        numeroDossier: '', etape: ''
    });
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const submitResidenceMutation = useSubmitResidenceForm();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('❌ File size must be less than 5MB');
                return;
            }
            setFile(file);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.nomComplet.trim()) newErrors.nomComplet = 'Full name is required';
        if (!formData.dateNaissance) newErrors.dateNaissance = 'Date of birth is required';
        if (!formData.paysResidence.trim()) newErrors.paysResidence = 'Country is required';
        if (!formData.programme) newErrors.programme = 'Program is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('❌ Please fill all required fields correctly');
            return;
        }
        
        // Create FormData for multipart upload
        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });
        if (file) {
            submitData.append('fileUpload', file);
        }
        
        // Submit using React Query mutation
        submitResidenceMutation.mutate(submitData, {
            onSuccess: () => {
                toast.success('✅ Formulaire de résidence soumis avec succès! Un conseiller vous contactera dans les 24 heures.');
                onSubmitSuccess();
                // Reset form
                setFormData({
                    nomComplet: '', dateNaissance: '', paysResidence: '', programme: '', 
                    numeroDossier: '', etape: ''
                });
                setFile(null);
                setErrors({});
            },
            onError: (error: unknown) => {
                const errorMessage = error instanceof Error ? error.message : 'Échec de la soumission du formulaire. Veuillez réessayer.';
                toast.error(`❌ ${errorMessage}`);
            },
        });
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-6">
                <InputField label="Nom / Prénom" type="text" name="nomComplet" value={formData.nomComplet} onChange={handleChange} required error={errors.nomComplet} />
                <InputField label="Date de naissance" type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} required error={errors.dateNaissance} />
                <InputField label="Pays de résidence" type="text" name="paysResidence" value={formData.paysResidence} onChange={handleChange} required error={errors.paysResidence} />
                <SelectField label="Programme d'immigration" name="programme" value={formData.programme} onChange={handleChange} options={[{value:'Quebec', label:'Québec'}, {value:'Entree Express', label:'Entrée Express'}]} placeholder="Sélectionnez..." required error={errors.programme} />
                <InputField label="Numéro de dossier" type="text" name="numeroDossier" value={formData.numeroDossier} onChange={handleChange} />
                <SelectField label="Étape actuelle" name="etape" value={formData.etape} onChange={handleChange} options={['DF', 'ARDF', 'IVM', 'VMF', 'GU', 'PPR'].map(o => ({value: o, label: o}))} placeholder="Sélectionnez..." />
                <div className="md:col-span-2">
                    <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">Pièce jointe (PDF)</label>
                    <input type="file" name="fileUpload" id="fileUpload" accept=".pdf" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
                    {file && <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>}
                </div>
            </div>
            <button 
                type="submit"
                disabled={submitResidenceMutation.isPending}
                className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-red-300 disabled:cursor-not-allowed"
            >
                {submitResidenceMutation.isPending ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                    </span>
                ) : (
                    'Soumettre'
                )}
            </button>
        </form>
    );
};

// Helper function to calculate time remaining until resubmission
const calculateTimeRemaining = (rejectedAt: string): { canResubmit: boolean; hoursLeft: number; minutesLeft: number } => {
    const rejectedTime = new Date(rejectedAt).getTime();
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const elapsed = now - rejectedTime;
    const remaining = twentyFourHours - elapsed;
    
    if (remaining <= 0) {
        return { canResubmit: true, hoursLeft: 0, minutesLeft: 0 };
    }
    
    const hoursLeft = Math.floor(remaining / (60 * 60 * 1000));
    const minutesLeft = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return { canResubmit: false, hoursLeft, minutesLeft };
};

// Status display component
const FormStatusDisplay: React.FC<{
    status: string | null;
    rejectedAt: string | null;
    rejectionReason: string | null;
    formTitle: string;
}> = ({ status, rejectedAt, rejectionReason, formTitle }) => {
    if (status === 'validated') {
        return (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-md">
                <div className="flex items-center">
                    <div className="shrink-0">
                        <svg className="h-10 w-10 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-green-800">✅ {formTitle} validé !</h3>
                        <p className="mt-2 text-sm text-green-700">
                            Félicitations ! Votre demande a été approuvée par notre équipe. Un conseiller vous contactera prochainement.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    
    if (status === 'pending') {
        return (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-md">
                <div className="flex items-center">
                    <div className="shrink-0">
                        <svg className="h-10 w-10 text-blue-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-blue-800">⏳ En attente de validation</h3>
                        <p className="mt-2 text-sm text-blue-700">
                            Votre {formTitle.toLowerCase()} est en cours de traitement. Un conseiller vous contactera dans les 24 heures. Vous recevrez également les tarifs et les moyens de paiement par e-mail.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    
    if (status === 'rejected' && rejectedAt) {
        const { canResubmit, hoursLeft, minutesLeft } = calculateTimeRemaining(rejectedAt);
        
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md">
                <div className="flex items-center">
                    <div className="shrink-0">
                        <svg className="h-10 w-10 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-red-800">❌ {formTitle} rejeté</h3>
                        {rejectionReason && (
                            <p className="mt-2 text-sm text-red-700">
                                <strong>Raison :</strong> {rejectionReason}
                            </p>
                        )}
                        {!canResubmit ? (
                            <p className="mt-2 text-sm font-semibold text-red-800">
                                🕒 Vous pouvez soumettre à nouveau les données après {hoursLeft}h {minutesLeft}min
                            </p>
                        ) : (
                            <p className="mt-2 text-sm font-semibold text-green-700">
                                ✅ Vous pouvez maintenant soumettre à nouveau le formulaire
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    
    return null;
};

const FormsPage: React.FC = () => {
    const { client, refreshAuth } = useAuth();
    
    // Temporary state to show pending immediately after submission (persisted in localStorage per user)
    // Initialize from localStorage based on current user
    const [isSendingTemporarilyEquivalence, setIsSendingTemporarilyEquivalence] = useState(() => {
        if (typeof window !== 'undefined' && client?.id) {
            return localStorage.getItem(`temp_sending_equivalence_${client.id}`) === 'true';
        }
        return false;
    });
    
    const [isSendingTemporarilyResidence, setIsSendingTemporarilyResidence] = useState(() => {
        if (typeof window !== 'undefined' && client?.id) {
            return localStorage.getItem(`temp_sending_residence_${client.id}`) === 'true';
        }
        return false;
    });
    
    // Clear temporary flags when backend confirms submission OR clean up old user flags
    useEffect(() => {
        if (!client?.id) return;
        
        // Clean up flags from other users
        if (typeof window !== 'undefined') {
            const allKeys = Object.keys(localStorage);
            allKeys.forEach(key => {
                if (key.startsWith('temp_sending_') && !key.includes(client.id)) {
                    localStorage.removeItem(key);
                }
            });
        }
        
        // Remove this user's temporary flags when backend confirms status is no longer pending
        // (i.e., when admin has validated or rejected)
        if (isSendingTemporarilyEquivalence && client?.isSendingFormulaireEquivalence) {
            if (client?.equivalenceStatus === 'validated' || client?.equivalenceStatus === 'rejected') {
                localStorage.removeItem(`temp_sending_equivalence_${client.id}`);
                setIsSendingTemporarilyEquivalence(false);
            }
        }
        if (isSendingTemporarilyResidence && client?.isSendingFormulaireResidence) {
            if (client?.residenceStatus === 'validated' || client?.residenceStatus === 'rejected') {
                localStorage.removeItem(`temp_sending_residence_${client.id}`);
                setIsSendingTemporarilyResidence(false);
            }
        }
    }, [client?.id, client?.isSendingFormulaireEquivalence, client?.isSendingFormulaireResidence, client?.equivalenceStatus, client?.residenceStatus, isSendingTemporarilyEquivalence, isSendingTemporarilyResidence]);
    
    // Auto-refresh every 5 minutes to check for status updates
    useEffect(() => {
        const interval = setInterval(() => {
            refreshAuth();
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, [refreshAuth]);
    
    const handleEquivalenceSubmit = async () => {
        if (!client?.id) return;
        // Set temporary flag in localStorage (user-specific)
        localStorage.setItem(`temp_sending_equivalence_${client.id}`, 'true');
        setIsSendingTemporarilyEquivalence(true);
        window.scrollTo(0, 0);
        // Refresh auth data to get updated status from backend
        await refreshAuth();
    };

    const handleResidenceSubmit = async () => {
        if (!client?.id) return;
        // Set temporary flag in localStorage (user-specific)
        localStorage.setItem(`temp_sending_residence_${client.id}`, 'true');
        setIsSendingTemporarilyResidence(true);
        window.scrollTo(0, 0);
        // Refresh auth data to get updated status from backend
        await refreshAuth();
    };
    
    // Check if forms can be resubmitted based on rejection time
    const canResubmitEquivalence = client?.equivalenceStatus !== 'rejected' || 
        (client?.equivalenceRejectedAt && calculateTimeRemaining(client.equivalenceRejectedAt).canResubmit);
    
    const canResubmitResidence = client?.residenceStatus !== 'rejected' || 
        (client?.residenceRejectedAt && calculateTimeRemaining(client.residenceRejectedAt).canResubmit);

    return (
        <ProtectedRoute>
            <div className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-blue-900">📝 Formulaires de services</h1>
                        <p className="text-lg text-slate-600 mt-2">Remplissez le formulaire correspondant à votre besoin.</p>
                    </div>
                    
                    <FormSection id="equivalence" title="🎓 Formulaire Équivalence de diplôme" subtitle="Fournissez les informations nécessaires pour la demande d&apos;équivalence.">
                        {(client?.isSendingFormulaireEquivalence && !canResubmitEquivalence) || isSendingTemporarilyEquivalence ? (
                            <FormStatusDisplay 
                                status={isSendingTemporarilyEquivalence ? 'pending' : (client?.equivalenceStatus || null)}
                                rejectedAt={client?.equivalenceRejectedAt || null}
                                rejectionReason={client?.equivalenceRejectionReason || null}
                                formTitle="Formulaire d'équivalence"
                            />
                        ) : (
                            <>
                                {client?.equivalenceStatus === 'rejected' && canResubmitEquivalence && (
                                    <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                                        <p className="text-sm text-yellow-700">
                                            ℹ️ Votre précédente soumission a été rejetée. Vous pouvez maintenant soumettre à nouveau le formulaire avec les corrections nécessaires.
                                        </p>
                                    </div>
                                )}
                                <FormulaireEquivalence onSubmitSuccess={handleEquivalenceSubmit} />
                            </>
                        )}
                    </FormSection>

                    <FormSection id="residence" title="🧩 Formulaire Résidence Permanente (CSQ et Fédéral)" subtitle="Mettez à jour votre dossier de résidence permanente avec nous.">
                        {(client?.isSendingFormulaireResidence && !canResubmitResidence) || isSendingTemporarilyResidence ? (
                            <FormStatusDisplay 
                                status={isSendingTemporarilyResidence ? 'pending' : (client?.residenceStatus || null)}
                                rejectedAt={client?.residenceRejectedAt || null}
                                rejectionReason={client?.residenceRejectionReason || null}
                                formTitle="Formulaire de résidence"
                            />
                        ) : (
                            <>
                                {client?.residenceStatus === 'rejected' && canResubmitResidence && (
                                    <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                                        <p className="text-sm text-yellow-700">
                                            ℹ️ Votre précédente soumission a été rejetée. Vous pouvez maintenant soumettre à nouveau le formulaire avec les corrections nécessaires.
                                        </p>
                                    </div>
                                )}
                                <FormulaireResidence onSubmitSuccess={handleResidenceSubmit} />
                            </>
                        )}
                    </FormSection>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default FormsPage;