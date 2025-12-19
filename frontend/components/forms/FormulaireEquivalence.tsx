import React, { useState } from 'react';
import { useSubmitEquivalenceForm } from '@/lib/hooks/useForms';
import { toast } from 'react-toastify';
import { InputField, SelectField, FileUploadField, SubmitButton } from '@/components/forms';

interface FormulaireEquivalenceProps {
    onSubmitSuccess: () => void;
}

export const FormulaireEquivalence: React.FC<FormulaireEquivalenceProps> = ({ onSubmitSuccess }) => {
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
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
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

        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });
        if (file) {
            submitData.append('portfolio', file);
        }

        submitEquivalenceMutation.mutate(submitData, {
            onSuccess: () => {
                toast.success('✅ Formulaire d\'équivalence soumis avec succès! Un conseiller vous contactera dans les 24 heures.');
                onSubmitSuccess();
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
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-6">
                <InputField label="Prénom" type="text" name="prenom" value={formData.prenom} onChange={handleChange} error={errors.prenom} />
                <InputField label="Nom" type="text" name="nom" value={formData.nom} onChange={handleChange} error={errors.nom} />
                <InputField label="Adresse" type="text" name="adresse" value={formData.adresse} onChange={handleChange} />
                <InputField label="Code postal" type="text" name="codePostal" value={formData.codePostal} onChange={handleChange} />
                <SelectField
                    label="Niveau final le plus élevé"
                    name="niveau"
                    value={formData.niveau}
                    onChange={handleChange}
                    options={[
                        { value: 'Licence', label: 'Licence' },
                        { value: 'Master', label: 'Master' },
                        { value: 'Doctorat', label: 'Doctorat' }
                    ]}
                    placeholder="Sélectionnez..."
                />
                <InputField label="Université" type="text" name="universite" value={formData.universite} onChange={handleChange} error={errors.universite} />
                <InputField label="Titre du diplôme de licence" type="text" name="titreLicence" value={formData.titreLicence} onChange={handleChange} />
                <InputField label="Titre du master" type="text" name="titreMaster" value={formData.titreMaster} onChange={handleChange} required={false} />
                <InputField label="Année de début d'étude" type="text" name="anneeDebut" value={formData.anneeDebut} onChange={handleChange} />
                <InputField label="Année d'obtention de la licence" type="text" name="anneeObtentionLicence" value={formData.anneeObtentionLicence} onChange={handleChange} />
                <InputField label="Année d'obtention du master" type="text" name="anneeObtentionMaster" value={formData.anneeObtentionMaster} onChange={handleChange} required={false} />
                <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
                <InputField label="Numéro de téléphone" type="tel" name="telephone" value={formData.telephone} onChange={handleChange} error={errors.telephone} />
                <FileUploadField
                    label="Portfolio (PDF, optional)"
                    name="portfolio"
                    file={file}
                    onChange={handleFileChange}
                />
            </div>
            <SubmitButton
                isLoading={submitEquivalenceMutation.isPending}
                text="Soumettre"
            />
        </form>
    );
};
