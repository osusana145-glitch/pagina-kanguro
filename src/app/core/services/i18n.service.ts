import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AppLanguage = 'en' | 'es';

import { TranslationDictionary } from '../i18n/types';
import { FEATURE_DICTIONARIES } from '../i18n';

export type { TranslationDictionary } from '../i18n/types';

const EN_BASE: TranslationDictionary = {
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
  'nav.app': 'Mobile App',
  'nav.trackPlaceholder': 'Enter tracking number...',

  // Hero & Quoter
  'hero.badge': 'California to Mexico Express • Fast and Safe',
  'hero.title': 'Security and Trust for Your Shipments to Mexico',
  'hero.subtitle': 'Safe door-to-door parcel transportation from Northern California (Santa Rosa & Cotati) directly to your family in Mexico. Legal customs clearance guaranteed.',
  'hero.bulletLive': 'Live package tracking and real-time updates',
  'hero.bulletCustoms': '100% legal customs clearance included',
  'hero.bulletDoor': 'Door-to-door delivery across all 32 Mexican states',

  // Quoter
  'quoter.title': 'Instant Shipping Quote',
  'quoter.subtitle': 'Transparent flat rates per official box size. Special freight available upon request.',
  'quoter.step1': 'Choose your box size',
  'quoter.step2': 'Destination state or ZIP code in Mexico',
  'quoter.step3': 'Optional cargo protection plan',
  'quoter.step4': 'Additional items & options',
  'quoter.boxDimensions': 'Dimensions',
  'quoter.maxWeight': 'Suggested max weight',
  'quoter.postalCode': 'Postal Code (5 digits)',
  'quoter.stateLabel': 'Or select destination State',
  'quoter.searchingCp': 'Checking destination coverage...',
  'quoter.coveredArea': 'Direct door-to-door coverage confirmed',
  'quoter.uncoveredArea': 'Verify your postal code or call our team at +1 707-800-9318',
  'quoter.breakdownTitle': 'Official Kangoo Xpress Breakdown',
  'quoter.baseShipping': 'Official box rate',
  'quoter.customsTax': 'Customs clearance & import handling',
  'quoter.insurance': 'Cargo protection',
  'quoter.extras': 'Optional extras',
  'quoter.total': 'Total Due',
  'quoter.guarantee': 'All inclusive — No unexpected fees upon delivery in Mexico',
  'quoter.continueBtn': 'Proceed with Shipment',
  'quoter.calculating': 'Updating official quote...',

  // Sections on Home
  'home.howTag': 'Simple Logistics',
  'home.howTitle': 'How to Ship with Kangoo Xpress',
  'home.howSub': 'Your package delivered in 4 simple steps with zero customs hassle.',
  'home.step1Title': 'Quote and Pick your Box',
  'home.step1Desc': 'Select your size or pick up official heavy-duty boxes at our authorized California drop-off locations.',
  'home.step2Title': 'Pack with Confidence',
  'home.step2Desc': 'Pack clothes, tools, pantry or gifts for your family. Our team guides you on permitted items.',
  'home.step3Title': 'Customs Clearance',
  'home.step3Desc': 'Certified legal border crossing. All official paperwork and permits are handled entirely by Kangoo.',
  'home.step4Title': 'Doorstep Delivery',
  'home.step4Desc': 'Our domestic transport fleet delivers straight to your family doorstep in Mexico with no surprise fees.',

  // Services / Pillars
  'home.servicesTag': 'Our Service Standards',
  'home.servicesTitle': 'Services We Offer',
  'home.servicesSub': 'Dedicated care for every package ensuring complete peace of mind on every delivery.',
  'home.pillarPacking': 'Packing Protection',
  'home.pillarPackingDesc': 'High-quality corrugated boxes designed to protect your goods throughout binational transit.',
  'home.pillarConvenience': 'Convenience',
  'home.pillarConvenienceDesc': 'Drop off at any authorized drop-off center in California or arrange freight pickup.',
  'home.pillarCare': 'Personalized Support',
  'home.pillarCareDesc': 'Direct human assistance at every step of your shipment via WhatsApp, phone, and online.',
  'home.pillarSecurity': 'Security & Compliance',
  'home.pillarSecurityDesc': '100% legal customs clearance and optional cargo protection plans for your peace of mind.',

  // Box Sizes
  'home.boxesTag': 'Transparent Rates',
  'home.boxesTitle': 'Official Box Sizes & Rates',
  'home.boxesSub': 'Flat transparent rates with customs clearance and door delivery included:',
  'home.selectBox': 'Select this Box',
  'home.boxOfficialBadge': 'Official Size',
  'home.boxFeature1': 'Optional cargo protection available',
  'home.boxFeature2': '100% legal customs clearance included',
  'home.boxFeature3': 'Direct home delivery in Mexico',
  'home.specialSizePrompt': 'Do you have an oversized crate, pallet, or special cargo?',
  'home.specialSizeLink': 'Request a custom freight quote here',
  'home.specialSizeWa': 'or chat with us on WhatsApp',

  // Mobile App Section
  'home.appBadge': 'Official Mobile App',
  'home.appTitle': 'Track and Manage Shipments on Your Phone',
  'home.appSub': 'Download the official Kangoo Xpress app for iOS and Android. Real-time push updates, instant camera barcode scanning, live tracking, and digital receipts.',
  'home.appFeat1Title': 'Live Push Updates',
  'home.appFeat1Desc': 'Get notified the moment your box clears customs and heads out for delivery.',
  'home.appFeat2Title': 'Instant Box Quoter',
  'home.appFeat2Desc': 'Calculate flat rates and book shipments from anywhere in seconds.',
  'home.appFeat3Title': 'Digital Proof of Delivery',
  'home.appFeat3Desc': 'Store receipts, recipient addresses, and delivery signatures securely.',
  'home.appStoreBtn': 'Download for iOS (App Store)',
  'home.appPlayBtn': 'Get it on Android (Google Play)',

  // Insurance Section
  'home.insTag': 'Guaranteed Peace of Mind',
  'home.insTitle': 'Cargo Protection Plans',
  'home.insSub': 'Optional coverage plans to protect your package throughout international transit:',
  'home.insPlanCol': 'Protection Plan',
  'home.insCostCol': 'Cost',
  'home.insCoverageCol': 'Maximum Coverage (*)',
  'home.insFootnote': '* Your merchandise is protected up to this value (permitted items and terms apply).',
  'home.insShieldTitle': 'Fully Covered',
  'home.insShieldDesc': 'Guaranteed compensation against transport incidents or loss along binational highways.',

  // Mission, Vision, Values
  'home.missionTitle': 'Our Mission',
  'home.missionDesc': 'Provide an efficient, safe, and transparent parcel service between Northern California and Mexico through certified binational logistics.',
  'home.visionTitle': 'Our Vision',
  'home.visionDesc': 'Be the most reliable and trusted shipping bridge between families in California and Mexico, renowned for operational excellence and personalized care.',
  'home.valuesTitle': 'Core Values',
  'home.val1': 'Commitment to every family and shipment',
  'home.val2': 'Operational efficiency and reliability',
  'home.val3': 'Guaranteed punctuality',
  'home.val4': 'Total honesty and upfront pricing',
  'home.val5': 'Collaborative binational teamwork',

  // Reviews
  'home.reviewsTag': 'Customer Reviews',
  'home.reviewsTitle': 'Families Who Trust Kangoo Xpress',
  'home.reviewsSub': 'Verified feedback from senders across California and families throughout Mexico.',

  // Call to action
  'home.ctaTitle': 'Ship Today — It’s Fast and Safe',
  'home.ctaSub': 'Call our Santa Rosa team at +1 707-800-9318 or message us on WhatsApp to prepare your shipment.',
  'home.ctaWhatsApp': 'Message on WhatsApp',
  'home.ctaCenters': 'Find a Drop-off Center',

  // Tracking
  'tracking.title': 'Live Shipment Tracking',
  'tracking.subtitle': 'Monitor your package progress in real time with our official live tracking system.',
  'tracking.inputPlaceholder': 'Enter your official Kangoo tracking number...',
  'tracking.searchBtn': 'Track Shipment',
  'tracking.stepReceived': 'Received at California Hub',
  'tracking.stepInTransit': 'In Transit to Border',
  'tracking.stepCustoms': 'Customs Inspection (Mexico)',
  'tracking.stepOutForDelivery': 'Out for Local Delivery',
  'tracking.stepDelivered': 'Delivered Successfully',
  'tracking.pendingPaymentAlert': 'This shipment requires payment verification before customs dispatch.',
  'tracking.payNowBtn': 'Complete Payment Now',

  // Footer & Common
  'footer.bio': 'Kangoo Xpress is the leading express parcel and logistics carrier connecting Northern California (Cotati / Santa Rosa) to all 32 Mexican states.',
  'footer.warehouse': 'Main Warehouse & Drop-off:',
  'footer.office': 'Corporate Office:',
  'footer.phone': 'Direct Phone:',
  'footer.whatsapp': 'Official WhatsApp:',
  'footer.email': 'Official Email:',
  'footer.servicesTitle': 'Services',
  'footer.infoTitle': 'Customer Information',
  'footer.appTitle': 'Mobile App',
  'footer.appDesc': 'Track and quote on the go. Available for iOS and Android.',
  'footer.rights': 'All rights reserved. Kangoo Xpress ® Fast and Safe.',
  'footer.fastAndSafe': 'Fast and Safe — Express Courier & Freight from California to Mexico.',
  // Hero / quoter extras
  'hero.statsDelivered': 'boxes delivered',
  'hero.statsReviews': 'reviews',
  'hero.appLink': 'Also available on the Kangoo Xpress mobile app',
  'quoter.live': 'Live',
  'quoter.boxGroup': 'Box size',
  'quoter.upTo': 'Up to',
  'quoter.cpPlaceholder': 'e.g. 72000',
  'quoter.detected': 'Location detected:',
  'quoter.eta': 'Estimated delivery:',
  'quoter.businessDays': 'business days',
  'quoter.zone': 'Area',
  'quoter.recommended': 'Recommended',
  'quoter.coverageUpTo': 'Coverage up to',
  'quoter.decrease': 'Decrease quantity',
  'quoter.increase': 'Increase quantity',
  'quoter.lookingUp': 'Looking up postal code',
  'home.boxDims': 'Official dimensions',
  'home.boxQuote': 'Price shown in the quoter',
  'home.appSearchHint': 'Search “Kangoo Xpress” on the App Store or Google Play.',
  'home.appTrackWeb': 'Track on the web',
  'home.appMockGuide': 'Tracking',
  'home.ctaCall': 'Call +1 707-800-9318',
  'footer.trust1Title': '100% legal customs clearance',
  'footer.trust1Desc': 'Certified binational permits and import paperwork for full peace of mind.',
  'footer.trust2Title': 'Door-to-door delivery',
  'footer.trust2Desc': 'Domestic delivery across all 32 Mexican states with no surprise charges.',
  'footer.trust3Title': 'Live tracking & mobile app',
  'footer.trust3Desc': 'Status updates on the web and in the Kangoo Xpress app.',
  'footer.payments': 'Payments accepted',
  'footer.cash': 'Cash',

  // Route titles
  'title.home': 'Kangoo Xpress | Fast and Safe Express Shipping California to Mexico',
  'title.tracking': 'Live Tracking | Kangoo Xpress',
  'title.centers': 'Authorized Drop-off Centers | Kangoo Xpress',
  'title.howItWorks': 'How Shipping Works | Kangoo Xpress',
  'title.items': 'Allowed & Prohibited Items | Kangoo Xpress',
  'title.times': 'Transit Times & Schedule | Kangoo Xpress',
  'title.faq': 'Frequently Asked Questions | Kangoo Xpress',
  'title.special': 'Special Freight & Pallet Quotes | Kangoo Xpress',
  'title.partner': 'Become an Authorized Agent | Kangoo Xpress',
  'title.contact': 'Customer Support & Contact | Kangoo Xpress',
  'title.checkout': 'Book a Shipment | Kangoo Xpress',
  'title.shipments': 'My Shipments | Kangoo Xpress',
  'title.receipt': 'Shipment Receipt | Kangoo Xpress',
  'title.addresses': 'Address Book | Kangoo Xpress'
};

const ES_BASE: TranslationDictionary = {
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
  'nav.app': 'App Móvil',
  'nav.trackPlaceholder': 'Ingresa tu número de guía...',

  // Hero & Quoter
  'hero.badge': 'Envíos Express California a México • Fast and Safe',
  'hero.title': 'Seguridad y Confianza en tus Envíos a Todo México',
  'hero.subtitle': 'Transporte seguro de paquetería y mensajería desde Santa Rosa y Cotati hacia cualquier rincón de México. Desaduanamiento legal garantizado y entrega puerta a puerta.',
  'hero.bulletLive': 'Seguimiento en vivo y notificaciones automáticas',
  'hero.bulletCustoms': 'Desaduanamiento 100% legal incluido',
  'hero.bulletDoor': 'Entrega a domicilio en los 32 estados de México',

  // Quoter
  'quoter.title': 'Cotiza tu Envío de Acuerdo a tus Necesidades',
  'quoter.subtitle': 'Tarifas fijas transparentes por tamaño de caja. Envíos especiales bajo cotización.',
  'quoter.step1': 'Selecciona el tamaño de tu caja',
  'quoter.step2': '¿A qué estado o CP en México va tu paquete?',
  'quoter.step3': 'Elige tu seguro de mercancías opcional',
  'quoter.step4': 'Servicios adicionales y extras',
  'quoter.boxDimensions': 'Medidas',
  'quoter.maxWeight': 'Peso máx. sugerido',
  'quoter.postalCode': 'Código Postal (5 dígitos)',
  'quoter.stateLabel': 'O selecciona el Estado destino',
  'quoter.searchingCp': 'Consultando cobertura...',
  'quoter.coveredArea': 'Cobertura directa confirmada',
  'quoter.uncoveredArea': 'Verifica tu CP o consulta con atención al cliente al 707-800-9318',
  'quoter.breakdownTitle': 'Desglose Oficial Kangoo Xpress',
  'quoter.baseShipping': 'Tarifa oficial de caja',
  'quoter.customsTax': 'Despacho aduanal e impuestos',
  'quoter.insurance': 'Seguro de mercancías',
  'quoter.extras': 'Servicios adicionales',
  'quoter.total': 'Total a Pagar',
  'quoter.guarantee': 'Sin cobros sorpresa al recibir en México',
  'quoter.continueBtn': 'Continuar con el Envío',
  'quoter.calculating': 'Actualizando cotización oficial...',

  // Sections on Home
  'home.howTag': 'Logística Fácil',
  'home.howTitle': '¿Cómo Enviar con Kangoo Xpress?',
  'home.howSub': 'Tu envío en 4 pasos sencillos sin complicaciones de aduana.',
  'home.step1Title': 'Cotiza y Lleva tu Caja',
  'home.step1Desc': 'Elige el tamaño que necesitas o recoge tus cajas oficiales en nuestros centros de acopio autorizados.',
  'home.step2Title': 'Empaca sin Preocupación',
  'home.step2Desc': 'Llena tu caja con ropa, herramientas o regalos familiares. Nosotros te asesoramos con el inventario.',
  'home.step3Title': 'Despacho Aduanal',
  'home.step3Desc': 'Cruce formal y seguro por la frontera. Todo el trámite aduanal corre por nuestra cuenta.',
  'home.step4Title': 'Entrega en Puerta',
  'home.step4Desc': 'Camiones de reparto entregan directo al domicilio en México, sin cobros sorpresa al recibir.',

  // Services / Pillars
  'home.servicesTag': 'Nuestros Servicios',
  'home.servicesTitle': 'Servicios que Ofrecemos',
  'home.servicesSub': 'Nuestro objetivo es brindarle una atención especial a cada uno de nuestros clientes garantizando la plena satisfacción en cada entrega.',
  'home.pillarPacking': 'Empaque',
  'home.pillarPackingDesc': 'Mantener el estado de los paquetes en óptimas condiciones durante todo el trayecto.',
  'home.pillarConvenience': 'Practicidad',
  'home.pillarConvenienceDesc': 'Brindando un servicio fácil, cómodo y transparente para nuestros clientes y sus familias.',
  'home.pillarCare': 'Atención Personalizada',
  'home.pillarCareDesc': 'Excelente servicio al cliente mediante una comunicación sencilla, efectiva y constante.',
  'home.pillarSecurity': 'Seguridad',
  'home.pillarSecurityDesc': 'Priorizar la seguridad y confiabilidad de nuestro servicio con desaduanamiento legal garantizado.',

  // Box Sizes
  'home.boxesTag': 'Tarifas Transparentes',
  'home.boxesTitle': 'Tamaños Oficiales de Caja',
  'home.boxesSub': 'Tenemos una medida especial para ti. Elige el tamaño de tu caja de acuerdo con tus necesidades:',
  'home.selectBox': 'Seleccionar Caja',
  'home.boxOfficialBadge': 'Medida Oficial',
  'home.boxFeature1': 'Puedes añadir seguro opcional',
  'home.boxFeature2': 'Despacho aduanal 100% legal',
  'home.boxFeature3': 'Entrega a domicilio en México',
  'home.specialSizePrompt': '¿Tienes un Envío Especial o fuera de las medidas establecidas?',
  'home.specialSizeLink': 'Contáctanos aquí para cotizar',
  'home.specialSizeWa': 'o escríbenos por WhatsApp',

  // Mobile App Section
  'home.appBadge': 'App Móvil Oficial',
  'home.appTitle': 'Rastrea y Gestiona tus Envíos desde tu Celular',
  'home.appSub': 'Descarga la app oficial de Kangoo Xpress para iOS y Android. Notificaciones push al instante, escaneo de códigos de barra con tu cámara, cotizador rápido e historial de envíos.',
  'home.appFeat1Title': 'Notificaciones Push en Vivo',
  'home.appFeat1Desc': 'Entérate al instante cuando tu caja cruza aduana y sale a reparto.',
  'home.appFeat2Title': 'Cotizador Rápido en tu Mano',
  'home.appFeat2Desc': 'Calcula tarifas y prepara envíos en segundos desde cualquier lugar.',
  'home.appFeat3Title': 'Comprobantes Digitales',
  'home.appFeat3Desc': 'Guarda tus recibos, direcciones frecuentes y firmas de entrega.',
  'home.appStoreBtn': 'Descargar para iOS (App Store)',
  'home.appPlayBtn': 'Disponible en Android (Google Play)',

  // Insurance Section
  'home.insTag': 'Tranquilidad Garantizada',
  'home.insTitle': 'Seguro de Mercancías',
  'home.insSub': 'Para tu tranquilidad y mayor confiabilidad podemos ofrecerte las siguientes aseguranzas para tu paquete:',
  'home.insPlanCol': 'Plan de Seguro',
  'home.insCostCol': 'Costo',
  'home.insCoverageCol': 'Cobertura (hasta *)',
  'home.insFootnote': '* Su mercancía será protegida por este monto (Aplican Restricciones y verificación de artículos permitidos).',
  'home.insShieldTitle': '100% Protegido',
  'home.insShieldDesc': 'Cobertura garantizada contra percances o extravíos en tránsito carretero binacional.',

  // Mission, Vision, Values
  'home.missionTitle': 'Nuestra Misión',
  'home.missionDesc': 'Brindar un servicio de paquetería eficiente y eficaz para todas las personas interesadas en realizar envíos de forma segura a través de colaboradores calificados desde Santa Rosa, CA a todo México.',
  'home.visionTitle': 'Nuestra Visión',
  'home.visionDesc': 'Ser líderes en soluciones logísticas en México y el Norte de California, facilitando el intercambio de paquetería entre familias de manera segura, rápida y accesible.',
  'home.valuesTitle': 'Nuestros Valores',
  'home.val1': 'Compromiso con cada familia y cliente',
  'home.val2': 'Eficiencia y eficacia en el servicio',
  'home.val3': 'Puntualidad en entregas garantizadas',
  'home.val4': 'Honestidad y transparencia total',
  'home.val5': 'Trabajo en equipo colaborativo',

  // Reviews
  'home.reviewsTag': 'Testimonios Reales',
  'home.reviewsTitle': 'Familias Que Confían en Kangoo Xpress',
  'home.reviewsSub': 'Opiniones verificadas de nuestros clientes en California y destinatarios en México.',

  // Call to action
  'home.ctaTitle': 'Envía Ahora — Es Muy Fácil',
  'home.ctaSub': 'Llámanos al 707-800-9318 o contáctanos por WhatsApp para orientarte con tu envío.',
  'home.ctaWhatsApp': 'Contactar por WhatsApp',
  'home.ctaCenters': 'Ver Centros de Acopio',

  // Tracking
  'tracking.title': 'Seguimiento de Envíos en Vivo',
  'tracking.subtitle': 'Monitorea tu paquete en tiempo real con nuestro sistema oficial de seguimiento en vivo.',
  'tracking.inputPlaceholder': 'Ingresa tu número de guía oficial Kangoo...',
  'tracking.searchBtn': 'Rastrear Guía',
  'tracking.stepReceived': 'Recibido en Bodega Cotati/Santa Rosa',
  'tracking.stepInTransit': 'En Tránsito a Frontera',
  'tracking.stepCustoms': 'Inspección Aduanal (México)',
  'tracking.stepOutForDelivery': 'En Ruta de Entrega',
  'tracking.stepDelivered': 'Entregado con Éxito',
  'tracking.pendingPaymentAlert': 'Este envío requiere confirmación de pago para liberación y despacho aduanal.',
  'tracking.payNowBtn': 'Completar Pago Ahora',

  // Footer & Common
  'footer.bio': 'Kangoo Xpress es la empresa líder de paquetería y logística especializada en envíos seguros y rápidos desde Cotati y Santa Rosa, CA hacia todo México.',
  'footer.warehouse': 'Bodega y Punto de Acopio:',
  'footer.office': 'Oficina Corporativa:',
  'footer.phone': 'Teléfono Directo:',
  'footer.whatsapp': 'WhatsApp Oficial:',
  'footer.email': 'Correo Oficial:',
  'footer.servicesTitle': 'Servicios',
  'footer.infoTitle': 'Información al Cliente',
  'footer.appTitle': 'App Móvil',
  'footer.appDesc': 'Rastrea y cotiza en cualquier momento. Disponible para iOS y Android.',
  'footer.rights': 'Derechos Reservados. Kangoo Xpress ® Fast and Safe.',
  'footer.fastAndSafe': 'Fast and Safe — Envíos, Paquetería y Mensajería EXPRESS de California a México.',
  // Hero / quoter extras
  'hero.statsDelivered': 'cajas entregadas',
  'hero.statsReviews': 'reseñas',
  'hero.appLink': 'También disponible en la app móvil de Kangoo Xpress',
  'quoter.live': 'En vivo',
  'quoter.boxGroup': 'Tamaño de caja',
  'quoter.upTo': 'Hasta',
  'quoter.cpPlaceholder': 'Ej. 72000',
  'quoter.detected': 'Ubicación detectada:',
  'quoter.eta': 'Entrega estimada:',
  'quoter.businessDays': 'días hábiles',
  'quoter.zone': 'Zona',
  'quoter.recommended': 'Recomendado',
  'quoter.coverageUpTo': 'Cobertura hasta',
  'quoter.decrease': 'Disminuir cantidad',
  'quoter.increase': 'Aumentar cantidad',
  'quoter.lookingUp': 'Buscando código postal',
  'home.boxDims': 'Medidas oficiales',
  'home.boxQuote': 'Precio en el cotizador',
  'home.appSearchHint': 'Busca «Kangoo Xpress» en App Store o Google Play.',
  'home.appTrackWeb': 'Rastrear en la web',
  'home.appMockGuide': 'Seguimiento',
  'home.ctaCall': 'Llamar al 707-800-9318',
  'footer.trust1Title': 'Despacho aduanal 100% legal',
  'footer.trust1Desc': 'Permisos binacionales certificados y pedimento de importación incluidos.',
  'footer.trust2Title': 'Entrega puerta a puerta',
  'footer.trust2Desc': 'Reparto a los 32 estados de México sin cobros sorpresa.',
  'footer.trust3Title': 'Seguimiento en vivo y app móvil',
  'footer.trust3Desc': 'Actualizaciones de estatus en la web y en la app de Kangoo Xpress.',
  'footer.payments': 'Formas de pago',
  'footer.cash': 'Efectivo',

  // Route titles
  'title.home': 'Kangoo Xpress | Envíos Express de California a México',
  'title.tracking': 'Seguimiento en Vivo | Kangoo Xpress',
  'title.centers': 'Centros de Acopio Autorizados | Kangoo Xpress',
  'title.howItWorks': 'Cómo Funciona | Kangoo Xpress',
  'title.items': 'Artículos Permitidos y Prohibidos | Kangoo Xpress',
  'title.times': 'Tiempos de Entrega | Kangoo Xpress',
  'title.faq': 'Preguntas Frecuentes | Kangoo Xpress',
  'title.special': 'Pedido Especial y Tarimas | Kangoo Xpress',
  'title.partner': 'Ser Centro de Acopio | Kangoo Xpress',
  'title.contact': 'Atención y Contacto | Kangoo Xpress',
  'title.checkout': 'Programa tu Envío | Kangoo Xpress',
  'title.shipments': 'Mis Envíos | Kangoo Xpress',
  'title.receipt': 'Recibo de Envío | Kangoo Xpress',
  'title.addresses': 'Libreta de Direcciones | Kangoo Xpress'
};

// Shared/home keys live above; each page keeps its own dictionary in core/i18n/*.i18n.ts.
const EN_TRANSLATIONS: TranslationDictionary = Object.assign({}, EN_BASE, ...FEATURE_DICTIONARIES.map(d => d.en));
const ES_TRANSLATIONS: TranslationDictionary = Object.assign({}, ES_BASE, ...FEATURE_DICTIONARIES.map(d => d.es));

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'kangoo_locale';

  // Signals - Default language is English ('en') as required
  readonly currentLang = signal<AppLanguage>('en');

  readonly translations = computed(() => {
    return this.currentLang() === 'en' ? EN_TRANSLATIONS : ES_TRANSLATIONS;
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY) as AppLanguage | null;
      if (saved === 'en' || saved === 'es') {
        this.currentLang.set(saved);
        document.documentElement.lang = saved;
      } else {
        this.currentLang.set('en');
        document.documentElement.lang = 'en';
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

  /** Translate a key. `{name}` placeholders are filled from `params`. */
  t(key: string, params?: Record<string, string | number>): string {
    const value = this.translations()[key] || key;
    if (!params) return value;
    return value.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match));
  }
}
