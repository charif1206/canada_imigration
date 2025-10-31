'use client';

import React, { useState } from 'react';

const InputField: React.FC<{ label: string; type: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; placeholder?: string; }> = ({ label, type, name, value, onChange, required = true, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
        />
    </div>
);

const SelectField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: {value: string, label: string}[]; required?: boolean; placeholder: string; }> = ({ label, name, value, onChange, options, required = true, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
        >
            <option value="">{placeholder}</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmitSuccess();
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Prénom" type="text" name="prenom" value={formData.prenom} onChange={handleChange} />
                <InputField label="Nom" type="text" name="nom" value={formData.nom} onChange={handleChange} />
                <InputField label="Adresse" type="text" name="adresse" value={formData.adresse} onChange={handleChange} />
                <InputField label="Code postal" type="text" name="codePostal" value={formData.codePostal} onChange={handleChange} />
                <SelectField label="Niveau final le plus élevé" name="niveau" value={formData.niveau} onChange={handleChange} options={[{value:'Licence', label:'Licence'}, {value:'Master', label:'Master'}, {value:'Doctorat', label:'Doctorat'}]} placeholder="Sélectionnez..." />
                <InputField label="Université" type="text" name="universite" value={formData.universite} onChange={handleChange} />
                <InputField label="Titre du diplôme de licence" type="text" name="titreLicence" value={formData.titreLicence} onChange={handleChange} />
                <InputField label="Titre du master" type="text" name="titreMaster" value={formData.titreMaster} onChange={handleChange} required={false} />
                <InputField label="Année de début d'étude" type="text" name="anneeDebut" value={formData.anneeDebut} onChange={handleChange} />
                <InputField label="Année d'obtention de la licence" type="text" name="anneeObtentionLicence" value={formData.anneeObtentionLicence} onChange={handleChange} />
                <InputField label="Année d'obtention du master" type="text" name="anneeObtentionMaster" value={formData.anneeObtentionMaster} onChange={handleChange} required={false} />
                <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                <InputField label="Numéro de téléphone" type="tel" name="telephone" value={formData.telephone} onChange={handleChange} />
            </div>
            <button type="submit" className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-300">Soumettre</button>
        </form>
    );
};

const FormulaireResidence: React.FC<{onSubmitSuccess: () => void}> = ({onSubmitSuccess}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmitSuccess();
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Nom / Prénom" type="text" name="nomComplet" value="" onChange={() => {}} />
                <InputField label="Date de naissance" type="date" name="dateNaissance" value="" onChange={() => {}} />
                <InputField label="Pays de résidence" type="text" name="paysResidence" value="" onChange={() => {}} />
                <SelectField label="Programme d'immigration" name="programme" value="" onChange={() => {}} options={[{value:'Quebec', label:'Québec'}, {value:'Entree Express', label:'Entrée Express'}]} placeholder="Sélectionnez..." />
                <InputField label="Numéro de dossier" type="text" name="numeroDossier" value="" onChange={() => {}} />
                <SelectField label="Étape actuelle" name="etape" value="" onChange={() => {}} options={['DF', 'ARDF', 'IVM', 'VMF', 'GU', 'PPR'].map(o => ({value: o, label: o}))} placeholder="Sélectionnez..." />
                <div className="md:col-span-2">
                    <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">Pièce jointe (PDF)</label>
                    <input type="file" name="fileUpload" id="fileUpload" accept=".pdf" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
                </div>
            </div>
            <button type="submit" className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-300">Soumettre</button>
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
        <div className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <h1 className="text-4xl md:text-5xl font-bold text-blue-900">Formulaires de services</h1>
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
    );
};

export default FormsPage;