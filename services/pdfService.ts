
import { LineItem, Address } from '../types';

// Let TypeScript know about the global jsPDF object from the script tag
declare const jspdf: any;

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);
};

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-CA', { dateStyle: 'long' }).format(date);
};

const generateAddressText = (title: string, address: Address) => {
    return [
        { content: title, styles: { fontStyle: 'bold' } },
        address.companyName,
        address.contactName,
        address.addressLine1,
        address.addressLine2,
        `${address.city}, ${address.province} ${address.postalCode}`,
        address.country,
        address.email,
    ].filter(Boolean).join('\n');
};

export const generateSubmissionPdf = (
    lineItems: LineItem[],
    subtotal: number,
    discountPercentage: number,
    total: number,
    billingAddress: Address,
    shippingAddress: Address
) => {
    const doc = new jspdf.jsPDF();
    const submissionDate = new Date();
    const submissionId = `SUB-${Date.now()}`;

    // Header
    doc.setFontSize(22);
    doc.text('Sommaire de la Soumission', 14, 22);
    doc.setFontSize(12);
    doc.text(`Date: ${formatDate(submissionDate)}`, 14, 32);
    doc.text(`Numéro de soumission: ${submissionId}`, 14, 38);

    // Addresses
    doc.setFontSize(10);
    const billingText = generateAddressText('Adresse de Facturation:', billingAddress);
    doc.text(billingText, 14, 50);

    const shippingText = generateAddressText('Adresse d\'Expédition:', shippingAddress);
    doc.text(shippingText, 105, 50);

    // Products Table
    const tableColumn = ["SKU", "Description", "Qté", "Prix Unitaire", "Total"];
    const tableRows: (string | number)[][] = [];

    lineItems.forEach(item => {
        const itemData = [
            item.sku,
            item.description,
            item.quantity,
            formatCurrency(item.price),
            formatCurrency(item.price * item.quantity),
        ];
        tableRows.push(itemData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 90,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(12);
    doc.text(`Sous-total: ${formatCurrency(subtotal)}`, 140, finalY + 10);
    doc.text(`Escompte (${discountPercentage}%): -${formatCurrency(subtotal * (discountPercentage / 100))}`, 140, finalY + 17);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${formatCurrency(total)}`, 140, finalY + 24);
    
    // Footer
    doc.setFontSize(8);
    doc.text('Merci pour votre demande de soumission.', 14, doc.internal.pageSize.height - 10);

    // Save PDF
    doc.save(`Soumission_${submissionId}.pdf`);
    return submissionId;
};
