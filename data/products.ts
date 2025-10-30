import { Product } from '../types';

export const productDatabase: Product[] = [
  // Existing products
  { sku: 'PL-T1000-WGL', description: 'Sondes de pièce communicantes Boite blanche, étiquette grise', price: 500.00 },
  { sku: 'VC2000-W', description: 'Régulateur VAV compact, BACnet', price: 350.50 },
  { sku: 'EC-W-PIR', description: 'Contrôleur d’ambiance avec capteur PIR', price: 275.00 },
  { sku: 'PS-500', description: 'Sonde de pression différentielle pour conduits', price: 120.75 },
  { sku: 'TR-24', description: 'Transformateur 24VCA, 40VA', price: 45.00 },
  { sku: 'MC200', description: 'Module de communication', price: 150.00 },
  { sku: 'RTU-400-B', description: 'Unité de toit programmable, BACnet', price: 1250.00 },
  { sku: 'AHU-CTRL-1', description: 'Contrôleur d’unité de traitement d’air', price: 980.25 },
  { sku: 'TEMP-OUT-1', description: 'Sonde de température extérieure', price: 85.50 },
  { sku: 'HUM-DUCT-1', description: "Sonde d'humidité pour conduits", price: 130.00 },

  // New products from user's request
  { sku: 'PL-485-BT', description: 'Prolon USB or BLUETOOTH TO RS485 CONVERTER', price: 674.16 },
  { sku: 'PL-C1050-RTU', description: 'BASIC ZONING SYSTEM ROOFTOP CONTROLLER', price: 778.02 },

  // Additional products to make the list more comprehensive
  { sku: 'PL-C5510-MOD', description: 'MODULATING AND FLOATING CONTROLLER', price: 450.50 },
  { sku: 'PL-C1000-M', description: 'MASTER NETWORK CONTROLLER', price: 890.00 },
  { sku: 'PL-VC2000-S', description: 'STAGED VAV CONTROLLER', price: 375.00 },
  { sku: 'PL-TSTAT-PRO', description: 'Programmable Commercial Thermostat', price: 215.75 },
  { sku: 'PL-AIR-Q', description: 'Sonde de qualité de l\'air intérieur (CO2, VOC)', price: 320.00 },
  { sku: 'PL-FLOW-MTR', description: 'Débitmètre à insertion pour eau', price: 550.00 },
  { sku: 'PL-GATE-BAC', description: 'Passerelle BACnet vers Modbus', price: 1100.00 },
  { sku: 'PL-EXP-8I', description: 'Module d\'extension 8 entrées universelles', price: 295.40 },
  { sku: 'PL-EXP-8O', description: 'Module d\'extension 8 sorties analogiques', price: 310.00 },
  { sku: 'PL-PSU-24D', description: 'Alimentation 24VDC, 75W', price: 110.20 },
  { sku: 'PL-VAL-ACT-1', description: 'Actionneur de vanne, 0-10V, 5Nm', price: 180.00 },
  { sku: 'PL-DMP-ACT-2', description: 'Actionneur de volet, 24V, 10Nm', price: 205.80 },
  { sku: 'PL-WTHR-STN', description: 'Station météo compacte (Temp, Hum, Lux)', price: 650.00 },
  { sku: 'PL-T2000-B', description: 'Sonde de pièce communicante Boite Noire', price: 515.00 },
  { sku: 'PL-CO2-WALL', description: 'Sonde de CO2 murale avec afficheur', price: 240.00 },
];
