'use client';

import React, { useState } from 'react';
import { useSubmitEquivalenceForm, useSubmitResidenceForm } from '../../lib/hooks/useForms';
import { toast } from 'react-toastify';
import ProtectedRoute from '@/components/ProtectedRoute';

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

const FormsPage: React.FC = () => {
    const [submissionMessage, setSubmissionMessage] = useState('');

    const handleFormSubmit = () => {
        setSubmissionMessage("Merci pour votre confiance. Un conseiller vous contactera dans les 24 heures. Vous recevrez également les tarifs et les moyens de paiement par e-mail.");
        window.scrollTo(0, 0);
    };

    return (
        <ProtectedRoute>
            <div className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-blue-900">📝 Formulaires de services</h1>
                        <p className="text-lg text-slate-600 mt-2">Remplissez le formulaire correspondant à votre besoin.</p>
                    </div>

                    {submissionMessage && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-8" role="alert">
                            <p className="font-bold">Soumis !</p>
                            <p>{submissionMessage}</p>
                        </div>
                    )}
                    
                    <FormSection id="equivalence" title="🎓 Formulaire Équivalence de diplôme" subtitle="Fournissez les informations nécessaires pour la demande d'équivalence.">
                        <FormulaireEquivalence onSubmitSuccess={handleFormSubmit} />
                    </FormSection>

                    <FormSection id="residence" title="🧩 Formulaire Résidence Permanente (CSQ et Fédéral)" subtitle="Mettez à jour votre dossier de résidence permanente avec nous.">
                        <FormulaireResidence onSubmitSuccess={handleFormSubmit} />
                    </FormSection>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default FormsPage;