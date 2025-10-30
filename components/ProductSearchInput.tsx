import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { productDatabase } from '../data/products';

interface ProductSearchInputProps {
    onProductSelect: (product: Product) => void;
    initialSku: string;
}

export const ProductSearchInput: React.FC<ProductSearchInputProps> = ({ onProductSelect, initialSku }) => {
    const [searchTerm, setSearchTerm] = useState(initialSku);
    const [results, setResults] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Synchroniser le terme de recherche interne si le SKU initial des props change
    useEffect(() => {
        setSearchTerm(initialSku);
    }, [initialSku]);

    // Fermer le menu déroulant lors d'un clic extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    // Fonction unique pour filtrer les produits et gérer l'état d'affichage
    const filterAndShowProducts = (term: string) => {
        if (term.length < 3) {
            setIsOpen(false);
            setResults([]);
            return;
        }

        const filteredProducts = productDatabase.filter(p =>
            p.sku.toLowerCase().includes(term.toLowerCase()) ||
            p.description.toLowerCase().includes(term.toLowerCase())
        );
        setResults(filteredProducts);
        setIsOpen(filteredProducts.length > 0);
        setActiveIndex(-1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        filterAndShowProducts(term);
    };

    const handleSelect = (product: Product) => {
        setSearchTerm(product.sku);
        onProductSelect(product);
        setIsOpen(false);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prevIndex => (prevIndex + 1) % results.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prevIndex => (prevIndex - 1 + results.length) % results.length);
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && results[activeIndex]) {
                    handleSelect(results[activeIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };
    
    return (
        <div className="relative w-full" ref={wrapperRef}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => filterAndShowProducts(searchTerm)}
                placeholder="Chercher par SKU ou description..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-autocomplete="list"
                aria-expanded={isOpen}
                aria-controls="product-results-list"
            />
            {isOpen && results.length > 0 && (
                <ul id="product-results-list" className="absolute z-10 w-full bottom-full mb-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-y-auto" role="listbox">
                    {results.map((product, index) => (
                        <li
                            key={product.sku}
                            onClick={() => handleSelect(product)}
                            onMouseOver={() => setActiveIndex(index)}
                            className={`px-4 py-2 cursor-pointer ${
                                index === activeIndex ? 'bg-blue-100' : 'hover:bg-blue-50'
                            }`}
                            role="option"
                            aria-selected={index === activeIndex}
                        >
                            <div className="font-bold text-slate-800">{product.sku}</div>
                            <div className="text-sm text-slate-600">{product.description}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};