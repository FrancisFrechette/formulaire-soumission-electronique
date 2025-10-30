
import React from 'react';
import { Address } from '../types';

interface AddressFormProps {
    title: string;
    address: Address;
    onAddressChange: (field: keyof Address, value: string) => void;
    isDisabled?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({ title, address, onAddressChange, isDisabled = false }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onAddressChange(e.target.name as keyof Address, e.target.value);
    };

    return (
        <div className={`p-6 rounded-lg shadow-md ${isDisabled ? 'bg-slate-200' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="companyName" placeholder="Nom de l'entreprise" value={address.companyName} onChange={handleChange} disabled={isDisabled} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-300"/>
                <input type="text" name="contactName" placeholder="Nom du contact" value={address.contactName} onChange={handleChange} disabled={isDisabled} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-300"/>
                <input type="text" name="addressLine1" placeholder="Adresse Ligne 1" value={address.addressLine1} onChange={handleChange} disabled={isDisabled} className="md:col-span-2 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-300"/>
                <input type="text" name="addressLine2" placeholder="Adresse Ligne 2 (Optionnel)" value={address.addressLine2} onChange={handleChange} disabled={isDisabled} className="md:col-span-2 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-300"/>
                <input type="text" name="city" placeholder="Ville" value={address.city} onChange={handleChange} disabled={isDisabled} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-300"/>
                <input type="text" name="province" placeholder="Province" value={address.province} onChange={handleChange} disabled={isDisabled} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-300"/>
                <input type="text" name="postalCode" placeholder="Code Postal" value={address.postalCode} onChange={handleChange} disabled={isDisabled} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-300"/>
                <input type="text" name="country" placeholder="Pays" value={address.country} onChange={handleChange} disabled={isDisabled} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-300"/>
                <input type="email" name="email" placeholder="Courriel pour confirmation" value={address.email} onChange={handleChange} disabled={isDisabled} className="md:col-span-2 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-300"/>
            </div>
        </div>
    );
};
