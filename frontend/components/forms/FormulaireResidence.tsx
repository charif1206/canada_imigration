import React, { useState } from 'react';
import { useSubmitResidenceForm } from '@/lib/hooks/useForms';
import { toast } from 'react-toastify';
import { InputField, SelectField, FileUploadField, SubmitButton, DateInputWithAge } from '@/components/forms';

interface FormulaireResidenceProps {
    onSubmitSuccess: () => void;
}

export const FormulaireResidence: React.FC<FormulaireResidenceProps> = ({ onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        nomComplet: '', dateNaissance: '', paysResidence: '', programme: '',
        numeroDossier: '', etape: '', diplome: '', anneesEtudes: '',
        anneesExperience: '', situationFamiliale: ''
    });
    const [age, setAge] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const submitResidenceMutation = useSubmitResidenceForm();

    const calculateAge = (birthDate: string): number => {
        const today = new Date();
        const birth = new Date(birthDate);
        let calculatedAge = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            calculatedAge--;
        }
        return calculatedAge;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'dateNaissance' && value) {
            const calculatedAge = calculateAge(value);
            setAge(calculatedAge);

            if (calculatedAge < 18) {
                setErrors({ ...errors, dateNaissance: 'Vous devez avoir au moins 18 ans' });
            } else {
                const newErrors = { ...errors };
                delete newErrors.dateNaissance;
                setErrors(newErrors);
            }
        }

        setFormData({ ...formData, [name]: value });
        if (errors[name] && name !== 'dateNaissance') {
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

        if (!formData.nomComplet.trim()) newErrors.nomComplet = 'Le nom complet est requis';
        if (!formData.dateNaissance) {
            newErrors.dateNaissance = 'La date de naissance est requise';
        } else if (age !== null && age < 18) {
            newErrors.dateNaissance = 'Vous devez avoir au moins 18 ans';
        }
        if (!formData.paysResidence.trim()) newErrors.paysResidence = 'Le pays de résidence est requis';
        if (!formData.programme) newErrors.programme = 'Le programme est requis';
        if (!formData.diplome) newErrors.diplome = 'Le diplôme est requis';
        if (!formData.anneesEtudes) newErrors.anneesEtudes = 'Les années d\'études sont requises';
        if (!formData.anneesExperience) newErrors.anneesExperience = 'Les années d\'expérience sont requises';
        if (!formData.situationFamiliale) newErrors.situationFamiliale = 'La situation familiale est requise';

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
            submitData.append('fileUpload', file);
        }

        submitResidenceMutation.mutate(submitData, {
            onSuccess: () => {
                toast.success('✅ Formulaire de résidence soumis avec succès! Un conseiller vous contactera dans les 24 heures.');
                onSubmitSuccess();
                setFormData({
                    nomComplet: '', dateNaissance: '', paysResidence: '', programme: '',
                    numeroDossier: '', etape: '', diplome: '', anneesEtudes: '',
                    anneesExperience: '', situationFamiliale: ''
                });
                setAge(null);
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
                <InputField label="Nom / Prénom" type="text" name="nomComplet" value={formData.nomComplet} onChange={handleChange} required error={errors.nomComplet} />

                <DateInputWithAge
                    label="Date de naissance"
                    name="dateNaissance"
                    value={formData.dateNaissance}
                    age={age}
                    onChange={handleChange}
                    required
                    error={errors.dateNaissance}
                />

                <InputField label="Pays de résidence" type="text" name="paysResidence" value={formData.paysResidence} onChange={handleChange} required error={errors.paysResidence} />

                <SelectField
                    label="Programme d'immigration"
                    name="programme"
                    value={formData.programme}
                    onChange={handleChange}
                    options={[
                        { value: 'Quebec', label: 'Québec' },
                        { value: 'Entree Express', label: 'Entrée Express' }
                    ]}
                    placeholder="Sélectionnez..."
                    required
                    error={errors.programme}
                />

                <SelectField
                    label="Diplôme"
                    name="diplome"
                    value={formData.diplome}
                    onChange={handleChange}
                    options={[
                        { value: 'Licence', label: 'Licence' },
                        { value: 'Master', label: 'Master' },
                        { value: 'Doctorat', label: 'Doctorat' }
                    ]}
                    placeholder="Sélectionnez..."
                    required
                    error={errors.diplome}
                />

                <InputField
                    label="Nombre d'années d'études"
                    type="number"
                    name="anneesEtudes"
                    value={formData.anneesEtudes}
                    onChange={handleChange}
                    required
                    placeholder="Ex: 5"
                    error={errors.anneesEtudes}
                />

                <InputField
                    label="Nombre d'années d'expérience professionnelle"
                    type="number"
                    name="anneesExperience"
                    value={formData.anneesExperience}
                    onChange={handleChange}
                    required
                    placeholder="Ex: 3"
                    error={errors.anneesExperience}
                />

                <SelectField
                    label="Situation familiale"
                    name="situationFamiliale"
                    value={formData.situationFamiliale}
                    onChange={handleChange}
                    options={[
                        { value: 'Célibataire', label: 'Célibataire' },
                        { value: 'Marié(e)', label: 'Marié(e)' },
                        { value: 'Divorcé(e)', label: 'Divorcé(e)' },
                        { value: 'Veuf(ve)', label: 'Veuf(ve)' }
                    ]}
                    placeholder="Sélectionnez..."
                    required
                    error={errors.situationFamiliale}
                />

                <InputField label="Numéro de dossier" type="text" name="numeroDossier" value={formData.numeroDossier} onChange={handleChange} required={false} placeholder="Optionnel" />

                <SelectField
                    label="Étape actuelle"
                    name="etape"
                    value={formData.etape}
                    onChange={handleChange}
                    options={['DF', 'ARDF', 'IVM', 'VMF', 'GU', 'PPR'].map(o => ({ value: o, label: o }))}
                    placeholder="Sélectionnez..."
                    required={false}
                />

                <FileUploadField
                    label="Pièce jointe (PDF)"
                    name="fileUpload"
                    file={file}
                    onChange={handleFileChange}
                />
            </div>
            <SubmitButton
                isLoading={submitResidenceMutation.isPending}
                text="Soumettre"
            />
        </form>
    );
};
