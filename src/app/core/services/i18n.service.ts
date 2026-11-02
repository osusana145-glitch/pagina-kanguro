import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AppLanguage = 'es' | 'en';

export interface TranslationDictionary {
  [key: string]: string;
}

const ES_TRANSLATIONS: TranslationDictionary = {
  // Navigation
  'nav.home': 'Inicio',
  'nav.quote': 'Cotizar',
  'nav.track': 'Rastrear Guía',
  'nav.centers': 'Centros de Acopio',
  'nav.howItWorks': 'Cómo Funciona',
  'nav.faqs': 'Preguntas',
  'nav.whatCanISend': 'Qué Puedo Enviar',
  'nav.deliveryTimes': 'Tiempos de Entrega',
  'nav.specialOrder': 'Pedido Especial',
  'nav.bePartner': 'Ser Centro de Acopio',
  'nav.contact': 'Contacto',
  'nav.myAccount': 'Mi Cuenta',
  'nav.trackPlaceholder': 'Ingresa tu número de guía...',

  // Hero & Quoter
  'hero.badge': 'Servicio Oficial EE. UU. a México',
  'hero.title': 'Envíos Rápidos, Seguros y Sin Complicaciones',
  'hero.subtitle': 'Llevamos tus paquetes, cajas y encargos desde Estados Unidos hasta la puerta de tu familia en cualquier rincón de México. Desaduanamiento garantizado.',
  'hero.socialRating': '4.9/5 estrellas en más de 3,500 reseñas',
  'hero.deliveredCount': '+45,000 cajas entregadas con éxito',

  // Quoter
  'quoter.title': 'Cotiza tu Envío al Instante',
  'quoter.subtitle': 'Precios transparentes y finales calculados directamente por nuestro sistema.',
  'quoter.step1': '1. Selecciona el tamaño de tu caja',
  'quoter.step2': '2. ¿A dónde en México va tu paquete?',
  'quoter.step3': '3. Elige tu plan de protección',
  'quoter.step4': '4. Extras opcionales (Tarimas, colchones, etc.)',
  'quoter.boxDimensions': 'Medidas',
  'quoter.maxWeight': 'Peso máx. sugerido',
  'quoter.postalCode': 'Código Postal (5 dígitos)',
  'quoter.stateLabel': 'O elige el Estado destino',
  'quoter.searchingCp': 'Consultando cobertura...',
  'quoter.coveredArea': 'Cobertura directa confirmada',
  'quoter.uncoveredArea': 'Verifica tu CP o consulta con atención a clientes',
  'quoter.breakdownTitle': 'Desglose Oficial Kangoo Xpress',
  'quoter.baseShipping': 'Envío base internacional',
  'quoter.customsTax': 'Despacho aduanal e importación',
  'quoter.insurance': 'Seguro de protección',
  'quoter.extras': 'Servicios y extras',
  'quoter.total': 'Total a Pagar',
  'quoter.guarantee': 'Sin costos ocultos al entregar en México',
  'quoter.continueBtn': 'Continuar con el Envío',
  'quoter.calculating': 'Actualizando cotización en tiempo real...',

  // Tracking
  'tracking.title': 'Rastreo Público de Envíos',
  'tracking.subtitle': 'Monitorea el viaje de tu caja en tiempo real desde la recepción en EE. UU. hasta la entrega final en México.',
  'tracking.inputPlaceholder': 'Ej: KG-892344-MX',
  'tracking.searchBtn': 'Rastrear',
  'tracking.stepReceived': 'Recibido en Bodega',
  'tracking.stepInTransit': 'En Tránsito Internacional',
  'tracking.stepCustoms': 'Inspección Aduanal (México)',
  'tracking.stepOutForDelivery': 'En Ruta de Entrega',
  'tracking.stepDelivered': 'Entregado con Éxito',
  'tracking.pendingPaymentAlert': 'Este envío requiere confirmación de pago para asignación de guía y liberación en aduana.',
  'tracking.payNowBtn': 'Completar Pago Ahora',

  // Footer & Common
  'footer.rights': 'Todos los derechos reservados. Kangoo Xpress Logistics LLC.',
  'footer.fastAndSafe': 'Fast & Safe — Conectando familias entre EE. UU. y México.'
};

const EN_TRANSLATIONS: TranslationDictionary = {
  // Navigation
  'nav.home': 'Home',
  'nav.quote': 'Get Quote',
  'nav.track': 'Track Shipment',
  'nav.centers': 'Drop-off Centers',
  'nav.howItWorks': 'How it Works',
  'nav.faqs': 'FAQs',
  'nav.whatCanISend': 'Allowed Items',
  'nav.deliveryTimes': 'Transit Times',
  'nav.specialOrder': 'Special Freight',
  'nav.bePartner': 'Become an Agent',
  'nav.contact': 'Contact Us',
  'nav.myAccount': 'My Account',
  'nav.trackPlaceholder': 'Enter tracking number...',

  // Hero & Quoter
  'hero.badge': 'Official USA to Mexico Logistics',
  'hero.title': 'Fast, Secure and Hassle-Free Shipping to Mexico',
  'hero.subtitle': 'We deliver your packages, boxes and goods from the United States directly to your family\'s doorstep across Mexico. Guaranteed customs clearance.',
  'hero.socialRating': '4.9/5 stars over 3,500+ reviews',
  'hero.deliveredCount': '+45,000 boxes safely delivered',

  // Quoter
  'quoter.title': 'Instant Shipping Quote',
  'quoter.subtitle': 'Transparent, final pricing returned directly by our logistics engine.',
  'quoter.step1': '1. Choose your box size',
  'quoter.step2': '2. Destination in Mexico',
  'quoter.step3': '3. Select protection plan',
  'quoter.step4': '4. Optional extras (Pallets, mattresses, etc.)',
  'quoter.boxDimensions': 'Dimensions',
  'quoter.maxWeight': 'Suggested max weight',
  'quoter.postalCode': 'Postal Code (5 digits)',
  'quoter.stateLabel': 'Or select destination State',
  'quoter.searchingCp': 'Checking coverage...',
  'quoter.coveredArea': 'Direct door-to-door coverage',
  'quoter.uncoveredArea': 'Check your ZIP or contact our support team',
  'quoter.breakdownTitle': 'Official Kangoo Xpress Breakdown',
  'quoter.baseShipping': 'Base international shipping',
  'quoter.customsTax': 'Customs clearance & import taxes',
  'quoter.insurance': 'Protection plan',
  'quoter.extras': 'Special extras',
  'quoter.total': 'Total Due',
  'quoter.guarantee': 'No hidden fees upon delivery in Mexico',
  'quoter.continueBtn': 'Proceed with Shipment',
  'quoter.calculating': 'Updating real-time quote...',

  // Tracking
  'tracking.title': 'Public Shipment Tracking',
  'tracking.subtitle': 'Live status updates from warehouse intake in the USA to doorstep delivery in Mexico.',
  'tracking.inputPlaceholder': 'E.g. KG-892344-MX',
  'tracking.searchBtn': 'Track Now',
  'tracking.stepReceived': 'Received at US Warehouse',
  'tracking.stepInTransit': 'In International Transit',
  'tracking.stepCustoms': 'Customs Inspection (Mexico)',
  'tracking.stepOutForDelivery': 'Out for Delivery',
  'tracking.stepDelivered': 'Delivered Successfully',
  'tracking.pendingPaymentAlert': 'This shipment is pending payment before release and tracking assignment.',
  'tracking.payNowBtn': 'Complete Payment Now',

  // Footer & Common
  'footer.rights': 'All rights reserved. Kangoo Xpress Logistics LLC.',
  'footer.fastAndSafe': 'Fast & Safe — Connecting families across USA and Mexico.'
};

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'kangoo_locale';

  // Signals
  readonly currentLang = signal<AppLanguage>('es');

  readonly translations = computed(() => {
    return this.currentLang() === 'en' ? EN_TRANSLATIONS : ES_TRANSLATIONS;
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY) as AppLanguage | null;
      if (saved === 'en' || saved === 'es') {
        this.currentLang.set(saved);
      }
    }
  }

  setLanguage(lang: AppLanguage): void {
    this.currentLang.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
  }

  toggleLanguage(): void {
    this.setLanguage(this.currentLang() === 'es' ? 'en' : 'es');
  }

  t(key: string): string {
    const dict = this.translations();
    return dict[key] || key;
  }
}
