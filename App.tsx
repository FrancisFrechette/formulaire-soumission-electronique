
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { LineItem, Address } from './types';
import { Product } from './types';
import { generateSubmissionPdf } from './services/pdfService';
import { sendConfirmationEmail } from './services/emailService';
import { ProductSearchInput } from './components/ProductSearchInput';
import { AddressForm } from './components/AddressForm';
import { PlusIcon, MinusIcon, CheckCircleIcon } from './components/icons';

const emptyAddress: Address = {
    companyName: '', contactName: '', addressLine1: '', addressLine2: '',
    city: '', province: '', postalCode: '', country: '', email: ''
};

const App: React.FC = () => {
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { id: crypto.randomUUID(), sku: '', description: '', price: 0, quantity: 1 }
    ]);
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [billingAddress, setBillingAddress] = useState<Address>(emptyAddress);
    const [shippingAddress, setShippingAddress] = useState<Address>(emptyAddress);
    const [sameAsBilling, setSameAsBilling] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submissionId, setSubmissionId] = useState('');

    useEffect(() => {
        if (sameAsBilling) {
            setShippingAddress(billingAddress);
        }
    }, [billingAddress, sameAsBilling]);

    const handleAddLineItem = () => {
        setLineItems([...lineItems, { id: crypto.randomUUID(), sku: '', description: '', price: 0, quantity: 1 }]);
    };

    const handleRemoveLineItem = (id: string) => {
        setLineItems(lineItems.filter(item => item.id !== id));
    };

    const handleLineItemChange = useCallback((id: string, updatedValues: Partial<LineItem>) => {
        setLineItems(currentItems =>
            currentItems.map(item => (item.id === id ? { ...item, ...updatedValues } : item))
        );
    }, []);

    const handleProductSelect = useCallback((id: string, product: Product) => {
        handleLineItemChange(id, {
            sku: product.sku,
            description: product.description,
            price: product.price,
        });
    }, [handleLineItemChange]);
    
    const handleAddressChange = (type: 'billing' | 'shipping') => (field: keyof Address, value: string) => {
        const setter = type === 'billing' ? setBillingAddress : setShippingAddress;
        setter(prev => ({...prev, [field]: value}));
    };

    const { subtotal, total } = useMemo(() => {
        const sub = lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const discountAmount = sub * (discountPercentage / 100);
        return {
            subtotal: sub,
            total: sub - discountAmount
        };
    }, [lineItems, discountPercentage]);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);
    };

    const handleSubmit = async () => {
        if (lineItems.length === 0 || lineItems.every(item => !item.sku)) {
            alert("Veuillez ajouter au moins un produit.");
            return;
        }
        if (!billingAddress.email) {
            alert("Veuillez entrer une adresse courriel pour la confirmation.");
            return;
        }

        try {
            const finalShippingAddress = sameAsBilling ? billingAddress : shippingAddress;
            const generatedId = generateSubmissionPdf(lineItems, subtotal, discountPercentage, total, billingAddress, finalShippingAddress);
            await sendConfirmationEmail(billingAddress.email, generatedId);
            setSubmissionId(generatedId);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Erreur lors de la génération du PDF ou de l'envoi du courriel:", error);
            alert("Une erreur est survenue lors de la soumission.");
        }
    };
    
    const startNewSubmission = () => {
      setLineItems([{ id: crypto.randomUUID(), sku: '', description: '', price: 0, quantity: 1 }]);
      setDiscountPercentage(0);
      setBillingAddress(emptyAddress);
      setShippingAddress(emptyAddress);
      setSameAsBilling(true);
      setIsSubmitted(false);
      setSubmissionId('');
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
                <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg">
                    <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Soumission envoyée avec succès!</h2>
                    <p className="text-slate-600 mb-6">
                        Votre soumission <span className="font-semibold text-slate-800">{submissionId}</span> a été générée et une confirmation a été envoyée à <span className="font-semibold text-slate-800">{billingAddress.email}</span>.
                    </p>
                    <button
                        onClick={startNewSubmission}
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Créer une nouvelle soumission
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-slate-800">Formulaire de Soumission Électronique</h1>
                <p className="text-slate-600 mt-2">Créez rapidement une demande de soumission.</p>
            </header>

            <main className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-slate-800 mb-4">Produits</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 w-2/5">Recherche de produit (SKU)</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 w-2/5">Description</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 text-center">Qté</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 text-right">Prix</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-slate-600 text-right">Total</th>
                                    <th className="p-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lineItems.map((item, index) => (
                                    <tr key={item.id} className="border-b border-slate-200">
                                        <td className="p-2"><ProductSearchInput initialSku={item.sku} onProductSelect={(product) => handleProductSelect(item.id, product)} /></td>
                                        <td className="p-2 text-slate-700 text-sm">{item.description}</td>
                                        <td className="p-2">
                                            <input type="number" min="1" value={item.quantity} onChange={(e) => handleLineItemChange(item.id, { quantity: parseInt(e.target.value, 10) || 1 })} className="w-16 text-center px-2 py-1 border border-slate-300 rounded-md"/>
                                        </td>
                                        <td className="p-2 text-right text-slate-700">{formatCurrency(item.price)}</td>
                                        <td className="p-2 text-right text-slate-800 font-semibold">{formatCurrency(item.price * item.quantity)}</td>
                                        <td className="p-2 text-center">
                                            {lineItems.length > 1 && (
                                                <button onClick={() => handleRemoveLineItem(item.id)} className="text-red-500 hover:text-red-700">
                                                    <MinusIcon className="w-5 h-5"/>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={handleAddLineItem} className="mt-4 flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                        <PlusIcon className="w-5 h-5"/> Ajouter un produit
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <AddressForm title="Adresse de Facturation" address={billingAddress} onAddressChange={handleAddressChange('billing')} />
                             <div>
                                <div className="flex items-center mb-4">
                                     <input id="sameAsBilling" type="checkbox" checked={sameAsBilling} onChange={(e) => setSameAsBilling(e.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"/>
                                     <label htmlFor="sameAsBilling" className="ml-2 text-sm font-medium text-slate-900">L'adresse d'expédition est la même que la facturation.</label>
                                 </div>
                                <AddressForm title="Adresse d'Expédition" address={shippingAddress} onAddressChange={handleAddressChange('shipping')} isDisabled={sameAsBilling} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Calcul du Total</h2>
                        <div className="space-y-3 text-slate-700 flex-grow">
                            <div className="flex justify-between items-center">
                                <span>Sous-total:</span>
                                <span className="font-medium">{formatCurrency(subtotal)}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <label htmlFor="discount" className="text-sm">Multiplicateur d’escompte (%):</label>
                                <input id="discount" type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)} className="w-20 text-right px-2 py-1 border border-slate-300 rounded-md"/>
                            </div>
                            <div className="flex justify-between items-center text-red-600">
                                <span>Escompte:</span>
                                <span>-{formatCurrency(subtotal * (discountPercentage / 100))}</span>
                            </div>
                            <hr className="my-2"/>
                            <div className="flex justify-between items-center text-2xl font-bold text-slate-900">
                                <span>Total:</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                        <button onClick={handleSubmit} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300">
                            Générer PDF et Soumettre
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
