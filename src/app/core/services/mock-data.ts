import {
  CatalogResponse,
  CollectionCenter,
  SiteContentResponse,
  TrackingResponse,
  UserShipmentDetail,
  SavedAddress,
  PostalCodeLookup
} from '../models/api.models';

export const MOCK_CATALOG: CatalogResponse = {
  boxes: [
    {
      id: 'box-sm',
      code: 'BOX_SMALL',
      name: 'Caja Chica',
      subtitle: 'Ideal para ropa, calzado y regalos personales',
      dimensions: { length_in: 18, width_in: 18, height_in: 18, volume_cubic_ft: 3.37 },
      max_weight_lb: 65,
      recommended_for: '1 a 2 maletas de ropa, juguetes o artículos personales pequeños',
      badge: 'Popular'
    },
    {
      id: 'box-md',
      code: 'BOX_MEDIUM',
      name: 'Caja Mediana',
      subtitle: 'La preferida para envíos familiares estándar',
      dimensions: { length_in: 24, width_in: 24, height_in: 20, volume_cubic_ft: 6.66 },
      max_weight_lb: 100,
      popular: true,
      recommended_for: 'Ropa de temporada, despensa enlatada, calzado y herramientas caseras',
      badge: 'Más Vendida'
    },
    {
      id: 'box-lg',
      code: 'BOX_LARGE',
      name: 'Caja Grande',
      subtitle: 'Máximo volumen para mudanzas y electrodomésticos',
      dimensions: { length_in: 24, width_in: 24, height_in: 30, volume_cubic_ft: 10.0 },
      max_weight_lb: 150,
      recommended_for: 'Edredones, licuadoras, microondas, pantallas medianas y vajillas protegidas',
      badge: 'Mayor Capacidad'
    }
  ],
  insurance_plans: [
    {
      id: 'ins-basic',
      code: 'INS_BASIC',
      name: 'Protección Básica',
      coverage_amount_usd: 300,
      coverage_formatted: '$300.00 USD',
      description: 'Cobertura esencial contra extravío total o daño exterior severo.'
    },
    {
      id: 'ins-standard',
      code: 'INS_STANDARD',
      name: 'Protección Total Kangoo',
      coverage_amount_usd: 800,
      coverage_formatted: '$800.00 USD',
      description: 'Nuestra cobertura más recomendada. Reembolso acelerado y seguro aduanal integral.',
      recommended: true
    },
    {
      id: 'ins-premium',
      code: 'INS_PREMIUM',
      name: 'Protección Premium Plus',
      coverage_amount_usd: 2000,
      coverage_formatted: '$2,000.00 USD',
      description: 'Ideal para artículos de alto valor declarados, electrónicos y menaje fino.'
    }
  ],
  extra_items: [
    {
      id: 'ext-pallet',
      code: 'EXT_PALLET',
      name: 'Emplaye y Base de Tarima (Pallet)',
      category: 'oversized',
      description: 'Refuerzo con película plástica de alta resistencia e industrial de base de madera.',
      unit_name: 'tarima'
    },
    {
      id: 'ext-mattress',
      code: 'EXT_MATTRESS',
      name: 'Funda Térmica para Colchón',
      category: 'furniture',
      description: 'Funda impermeable de uso rudo anti-desgarre y sellado hermético.',
      unit_name: 'pieza'
    },
    {
      id: 'ext-appliance',
      code: 'EXT_APPLIANCE',
      name: 'Huacal Protector de Madera (Electrodomésticos / TV)',
      category: 'appliances',
      description: 'Estructura rígida de madera contra impactos durante la travesía carretera.',
      unit_name: 'caja'
    }
  ],
  stats: {
    rating: 4.9,
    reviews_count: 3540,
    boxes_delivered_formatted: '45,820+',
    on_time_percentage: 98.4
  },
  reviews: [
    {
      id: 'rev-1',
      author: 'Rosa Elena Morales',
      city_origin: 'Houston, TX',
      city_dest: 'Puebla, PUE',
      rating: 5,
      comment: 'Llegó en 12 días exactos hasta la puerta de mi mamá en Tehuacán. La caja llegó intacta sin abrir ni un sello. 100% recomendados.',
      date: 'Hace 4 días',
      verified_delivery: true
    },
    {
      id: 'rev-2',
      author: 'Carlos Alberto Vega',
      city_origin: 'Dallas, TX',
      city_dest: 'Guadalajara, JAL',
      rating: 5,
      comment: 'El sistema de rastreo por WhatsApp y la página web es excelente. Sabía cuándo cruzó la frontera en Laredo y cuándo salió a entrega.',
      date: 'Hace 1 semana',
      verified_delivery: true
    },
    {
      id: 'rev-3',
      author: 'Guadalupe Santos',
      city_origin: 'Chicago, IL',
      city_dest: 'Morelia, MICH',
      rating: 5,
      comment: 'Mandé una caja mediana y una pantalla con el huacal de madera. Todo en perfectas condiciones y el precio fue el acordado desde el principio sin sorpresas.',
      date: 'Hace 2 semanas',
      verified_delivery: true
    }
  ]
};

export const MOCK_COLLECTION_CENTERS: CollectionCenter[] = [
  {
    id: 'center-hou-1',
    name: 'Kangoo Central Houston (Northwest)',
    city: 'Houston',
    state: 'TX',
    full_address: '7410 Airline Dr, Houston, TX 77076, EE. UU.',
    phone: '+1 (713) 555-0142',
    whatsapp: '+1 (713) 555-0143',
    schedule: [
      { days: 'Lunes a Viernes', hours: '9:00 AM - 6:30 PM' },
      { days: 'Sábados', hours: '9:00 AM - 4:00 PM' },
      { days: 'Domingos', hours: 'Cerrado' }
    ],
    directions_url: 'https://maps.google.com/?q=7410+Airline+Dr+Houston+TX',
    lat: 29.8654,
    lng: -95.3941,
    services: ['Recepción de cajas', 'Venta de empaque', 'Pesaje oficial', 'Recolección a domicilio'],
    is_active: true
  },
  {
    id: 'center-dal-1',
    name: 'Kangoo Dallas (Oak Cliff)',
    city: 'Dallas',
    state: 'TX',
    full_address: '2810 S Hampton Rd, Dallas, TX 75224, EE. UU.',
    phone: '+1 (214) 555-0189',
    whatsapp: '+1 (214) 555-0190',
    schedule: [
      { days: 'Lunes a Viernes', hours: '9:30 AM - 6:00 PM' },
      { days: 'Sábados', hours: '9:00 AM - 3:00 PM' }
    ],
    directions_url: 'https://maps.google.com/?q=2810+S+Hampton+Rd+Dallas+TX',
    lat: 32.7121,
    lng: -96.8582,
    services: ['Recepción de cajas', 'Emplaye de tarimas', 'Asesoría aduanal'],
    is_active: true
  },
  {
    id: 'center-chi-1',
    name: 'Kangoo Chicago (Little Village / La Villita)',
    city: 'Chicago',
    state: 'IL',
    full_address: '3605 W 26th St, Chicago, IL 60623, EE. UU.',
    phone: '+1 (773) 555-0198',
    schedule: [
      { days: 'Lunes a Sábado', hours: '10:00 AM - 6:00 PM' },
      { days: 'Domingos', hours: '10:00 AM - 2:00 PM' }
    ],
    directions_url: 'https://maps.google.com/?q=3605+W+26th+St+Chicago+IL',
    lat: 41.8442,
    lng: -87.7145,
    services: ['Recepción de cajas', 'Venta de cajas', 'Consolidación semanal'],
    is_active: true
  },
  {
    id: 'center-lax-1',
    name: 'Kangoo Los Ángeles (Huntington Park)',
    city: 'Los Angeles',
    state: 'CA',
    full_address: '6120 Pacific Blvd, Huntington Park, CA 90255, EE. UU.',
    phone: '+1 (323) 555-0131',
    schedule: [
      { days: 'Lunes a Viernes', hours: '9:00 AM - 7:00 PM' },
      { days: 'Sábados', hours: '9:00 AM - 5:00 PM' }
    ],
    directions_url: 'https://maps.google.com/?q=6120+Pacific+Blvd+Huntington+Park+CA',
    lat: 33.9856,
    lng: -118.2251,
    services: ['Recepción de cajas', 'Inspección de contenido', 'Emplaye'],
    is_active: true
  },
  {
    id: 'center-atl-1',
    name: 'Kangoo Atlanta (Norcross Hub)',
    city: 'Norcross',
    state: 'GA',
    full_address: '5420 Jimmy Carter Blvd, Norcross, GA 30093, EE. UU.',
    phone: '+1 (404) 555-0177',
    schedule: [
      { days: 'Lunes a Viernes', hours: '9:30 AM - 6:00 PM' },
      { days: 'Sábados', hours: '10:00 AM - 3:00 PM' }
    ],
    directions_url: 'https://maps.google.com/?q=5420+Jimmy+Carter+Blvd+Norcross+GA',
    lat: 33.9142,
    lng: -84.2155,
    services: ['Recepción de cajas', 'Huacales para TV', 'Asesoría aduanal'],
    is_active: true
  }
];

export const MOCK_SITE_CONTENT: SiteContentResponse = {
  how_it_works: [
    {
      step: 1,
      title: 'Cotiza y Elige tu Caja',
      description: 'Usa nuestro cotizador instantáneo arriba o visita tu centro de acopio más cercano para llevarte tus cajas oficiales Kangoo.',
      icon: 'box'
    },
    {
      step: 2,
      title: 'Empaca y Llena tu Inventario',
      description: 'Guarda tus pertenencias familiares siguiendo nuestra lista de artículos permitidos. Nosotros te ayudamos con el sellado y emplaye.',
      icon: 'clipboard-check'
    },
    {
      step: 3,
      title: 'Entrega en Centro o Pide Recolección',
      description: 'Lleva tu caja a cualquiera de nuestros centros de acopio en EE. UU. o agenda recolección segura en tu domicilio.',
      icon: 'truck'
    },
    {
      step: 4,
      title: 'Cruce Aduanal y Entrega Puerta a Puerta',
      description: 'Nosotros nos encargamos de todos los trámites aduanales oficiales y entregamos en camión directo al domicilio en México.',
      icon: 'home'
    }
  ],
  faqs: [
    {
      id: 'faq-1',
      category: 'Envíos y Aduanas',
      question: '¿Tengo que pagar impuestos o aranceles adicionales cuando la caja llegue a México?',
      answer: 'No. El precio calculado y pagado con Kangoo Xpress incluye el despacho aduanal formal y los aranceles de importación. Tu destinatario en México no debe pagar ni un solo centavo al chofer que realiza la entrega.'
    },
    {
      id: 'faq-2',
      category: 'Envíos y Aduanas',
      question: '¿Qué pasa si mi caja sufre algún daño o percance durante el trayecto?',
      answer: 'Todos los envíos de Kangoo Xpress cuentan con cobertura de protección garantizada según el plan seleccionado ($300, $800 o $2,000 USD). Si hay una incidencia reportada al momento de la entrega, nuestro departamento de siniestros gestiona la indemnización de forma expedita.'
    },
    {
      id: 'faq-3',
      category: 'Tiempos y Entregas',
      question: '¿Cuánto tiempo tarda en llegar mi envío a México?',
      answer: 'El promedio habitual es de 10 a 16 días hábiles dependiendo del estado de la República Mexicana. Estados del norte y centro (Nuevo León, Querétaro, CDMX, Puebla, Jalisco) suelen recibir en 9 a 13 días hábiles; estados del sur y península en 14 a 18 días hábiles.'
    },
    {
      id: 'faq-4',
      category: 'Artículos y Embalaje',
      question: '¿Puedo enviar televisores, pantallas o electrodomésticos?',
      answer: '¡Sí! Puedes enviar pantallas de TV y electrodomésticos nuevos o seminuevos. Exigimos obligatoriamente nuestro servicio de huacal protector de madera para garantizar que la pantalla no sufra flexiones durante el trayecto por carretera.'
    },
    {
      id: 'faq-5',
      category: 'Pagos y Facturación',
      question: '¿Cuáles son los métodos de pago aceptados?',
      answer: 'Aceptamos tarjetas de débito/crédito (Visa, MasterCard, Amex) a través de Stripe, PayPal y pagos en efectivo en centros de acopio autorizados y cadenas afiliadas.'
    }
  ],
  allowed_items: [
    { id: 'al-1', name: 'Ropa nueva y usada de uso personal', category: 'Prendas', recommendations: 'Empacar en bolsas herméticas para optimizar espacio al vacío.' },
    { id: 'al-2', name: 'Calzado y tenis de toda medida', category: 'Prendas', recommendations: 'Hasta 12 pares por caja familiar sugerido.' },
    { id: 'al-3', name: 'Herramientas manuales y eléctricas de uso casero', category: 'Herramientas', recommendations: 'Sin baterías de litio sueltas ni líquidos combustibles.' },
    { id: 'al-4', name: 'Juguetes no bélicos y consolas de videojuegos', category: 'Electrónicos', recommendations: 'Proteger con plástico burbuja en la parte central de la caja.' },
    { id: 'al-5', name: 'Vajillas, sartenes y utensilios de cocina', category: 'Hogar', recommendations: 'Envolver piezas de vidrio individualmente con papel periódico o burbuja.' },
    { id: 'al-6', name: 'Alimentos no perecederos enlatados o secos', category: 'Despensa', recommendations: 'Envolturas originales de fábrica, cerradas herméticamente.' }
  ],
  prohibited_items: [
    { id: 'pr-1', name: 'Armas de fuego, municiones y réplicas de balines', category: 'Seguridad', hazard_type: 'Prohibición Federal Delito Grave', legal_warning: 'Sancionado severamente por aduanas y autoridades binacionales. Se reporta inmediatamente a la fiscalía.' },
    { id: 'pr-2', name: 'Drogas, estupefacientes y medicamentos controlados sin receta binacional', category: 'Salud', hazard_type: 'Narcóticos Ilegales', legal_warning: 'Prohibido de manera estricta bajo tratados internacionales.' },
    { id: 'pr-3', name: 'Fuegos artificiales, pirotecnia y pólvora', category: 'Explosivos', hazard_type: 'Material Explosivo', legal_warning: 'Peligro inminente de ignición en transporte terrestre.' },
    { id: 'pr-4', name: 'Dinero en efectivo, cheques al portador y metales preciosos en barras', category: 'Valores', hazard_type: 'Contrabando de Divisas', legal_warning: 'No amparado por seguro de paquetería y decomiso aduanal legal.' },
    { id: 'pr-5', name: 'Semillas no procesadas, plantas vivas y animales', category: 'Fitosanitario', hazard_type: 'Riesgo Agrícola', legal_warning: 'Prohibido por SENASICA para prevención de plagas fitosanitarias.' }
  ],
  delivery_times: [
    { region: 'Norte y Noreste', states: ['Nuevo León', 'Coahuila', 'Tamaulipas', 'San Luis Potosí'], days_range: '8 - 12 días hábiles', shipping_frequency: 'Salidas martes y viernes' },
    { region: 'Centro y Bajío', states: ['Jalisco', 'Guanajuato', 'Michoacán', 'Querétaro', 'Aguascalientes'], days_range: '9 - 13 días hábiles', shipping_frequency: 'Salidas continuas (3 por semana)' },
    { region: 'Valle de México y Oriente', states: ['Ciudad de México', 'Estado de México', 'Puebla', 'Hidalgo', 'Veracruz'], days_range: '10 - 14 días hábiles', shipping_frequency: 'Salidas continuas (3 por semana)' },
    { region: 'Sur y Sureste', states: ['Guerrero', 'Oaxaca', 'Chiapas', 'Tabasco', 'Yucatán', 'Quintana Roo'], days_range: '13 - 17 días hábiles', shipping_frequency: 'Salidas semanales programadas' }
  ]
};

// ==============================================================================
// Mock Tracking Database
// ==============================================================================

export const MOCK_TRACKING_DB: Record<string, TrackingResponse> = {
  // 1. Shipment en Tránsito / Aduana (En azul)
  'KG-892344-MX': {
    tracking_number: 'KG-892344-MX',
    reference_id: 'REF-2026-9041',
    status: 'customs',
    status_label: 'En Despacho Aduanal',
    status_tone: 'info',
    is_paid: true,
    needs_attention: false,
    is_delayed: false,
    origin_city: 'Houston, TX (EE. UU.)',
    destination_city: 'Puebla, PUE (México)',
    recipient_name: 'Rosa Elena Morales',
    box_type: 'Caja Mediana (24x24x20")',
    estimated_delivery_date: '28 de Octubre, 2026',
    timeline: [
      {
        step_id: 'step-1',
        title: 'Recibido en Bodega Houston',
        description: 'Caja pesada, sellada y con código de barra asignado.',
        location: 'Houston, TX',
        timestamp: '19 Oct 2026, 14:32',
        completed: true,
        current: false
      },
      {
        step_id: 'step-2',
        title: 'En Tránsito a Frontera',
        description: 'Unidad de consolidación en trayecto hacia Nuevo Laredo.',
        location: 'Laredo, TX',
        timestamp: '21 Oct 2026, 08:15',
        completed: true,
        current: false
      },
      {
        step_id: 'step-3',
        title: 'Inspección y Despacho Aduanal',
        description: 'Revisión no intrusiva por autoridades del SAT / ANAM. Proceso normal en curso.',
        location: 'Aduana Nuevo Laredo, Tamps.',
        timestamp: '22 Oct 2026, 09:40',
        completed: false,
        current: true,
        is_customs: true // Highlighted in blue
      },
      {
        step_id: 'step-4',
        title: 'En Ruta de Entrega Terrestre',
        description: 'Asignado a camión de reparto local en centro de distribución.',
        location: 'Puebla, PUE',
        timestamp: null,
        completed: false,
        current: false
      },
      {
        step_id: 'step-5',
        title: 'Entregado al Destinatario',
        description: 'Entrega final con firma de recibido y evidencia fotográfica.',
        location: 'Tehuacán, PUE',
        timestamp: null,
        completed: false,
        current: false
      }
    ]
  },

  // 2. Shipment Entregado (Verde éxito)
  'KG-654120-MX': {
    tracking_number: 'KG-654120-MX',
    reference_id: 'REF-2026-8812',
    status: 'delivered',
    status_label: 'Entregado con Éxito',
    status_tone: 'success',
    is_paid: true,
    needs_attention: false,
    is_delayed: false,
    origin_city: 'Dallas, TX',
    destination_city: 'Guadalajara, JAL',
    recipient_name: 'Carlos Alberto Vega',
    box_type: 'Caja Grande (24x24x30")',
    estimated_delivery_date: 'Entregado el 18 de Octubre, 2026',
    timeline: [
      { step_id: 's-1', title: 'Recibido en Bodega Dallas', description: 'Recepción y cotejo de inventario.', location: 'Dallas, TX', timestamp: '05 Oct 2026', completed: true, current: false },
      { step_id: 's-2', title: 'En Tránsito Internacional', description: 'Traslado seguro en tractocamión.', location: 'Frontera', timestamp: '08 Oct 2026', completed: true, current: false },
      { step_id: 's-3', title: 'Despacho Aduanal Concluido', description: 'Pedimento y sellos fiscales autorizados.', location: 'Aduana Laredo', timestamp: '11 Oct 2026', completed: true, current: false, is_customs: true },
      { step_id: 's-4', title: 'En Ruta Local Guadalajara', description: 'Salida a ruta con operador asignado.', location: 'Guadalajara, JAL', timestamp: '17 Oct 2026', completed: true, current: false },
      { step_id: 's-5', title: 'Entregado', description: 'Recibido satisfactoriamente por el destinatario.', location: 'Zapopan, JAL', timestamp: '18 Oct 2026, 16:10', completed: true, current: true }
    ]
  },

  // 3. REGLA INVIOLABLE #4: Sin pago no hay guía
  'REF-PENDING-99': {
    tracking_number: null, // Strictly null
    reference_id: 'REF-PENDING-99',
    status: 'pending_payment',
    status_label: 'Pendiente de Pago',
    status_tone: 'warning',
    is_paid: false,
    needs_attention: true,
    attention_reason: 'Envío registrado en sistema. El número de guía oficial y el comprobante de embarque se emiten automáticamente al acreditar el pago.',
    is_delayed: false,
    origin_city: 'Chicago, IL',
    destination_city: 'Morelia, MICH',
    recipient_name: 'Guadalupe Santos',
    box_type: 'Caja Mediana',
    estimated_delivery_date: 'Sujeto a acreditación de pago',
    timeline: [
      {
        step_id: 's-p1',
        title: 'Pre-Registro Creado',
        description: 'Esperando liquidación para generar guía física y autorización de salida.',
        location: 'Centro de Acopio Little Village, IL',
        timestamp: '22 Oct 2026, 10:00',
        completed: true,
        current: true
      }
    ],
    payment_cta: {
      message: 'Completa tu pago seguro con tarjeta, PayPal o efectivo para liberar la guía.',
      action_url: '/enviar?resume=REF-PENDING-99'
    }
  }
};

// ==============================================================================
// Mock Postal Codes Database (Mexico)
// ==============================================================================

export const MOCK_POSTAL_CODES: Record<string, PostalCodeLookup> = {
  '72000': {
    postal_code: '72000',
    state_code: 'PUE',
    state_name: 'Puebla',
    municipality: 'Puebla',
    settlements: ['Centro Histórico', 'Barrio de San José', 'El Refugio'],
    is_covered: true,
    delivery_estimate_days: { min: 9, max: 13 }
  },
  '44100': {
    postal_code: '44100',
    state_code: 'JAL',
    state_name: 'Jalisco',
    municipality: 'Guadalajara',
    settlements: ['Guadalajara Centro', 'Barranquitas', 'Santuario'],
    is_covered: true,
    delivery_estimate_days: { min: 9, max: 12 }
  },
  '06000': {
    postal_code: '06000',
    state_code: 'CDMX',
    state_name: 'Ciudad de México',
    municipality: 'Cuauhtémoc',
    settlements: ['Centro (Área 1)', 'Centro (Área 2)'],
    is_covered: true,
    delivery_estimate_days: { min: 9, max: 12 }
  },
  '64000': {
    postal_code: '64000',
    state_code: 'NL',
    state_name: 'Nuevo León',
    municipality: 'Monterrey',
    settlements: ['Monterrey Centro', 'Obrera', 'Industrial'],
    is_covered: true,
    delivery_estimate_days: { min: 7, max: 10 }
  },
  '58000': {
    postal_code: '58000',
    state_code: 'MICH',
    state_name: 'Michoacán',
    municipality: 'Morelia',
    settlements: ['Morelia Centro', 'Ventura Puente', 'Chapultepec'],
    is_covered: true,
    delivery_estimate_days: { min: 10, max: 14 }
  }
};

// User account mock data
export const MOCK_USER_SHIPMENTS: UserShipmentDetail[] = [
  {
    id: 'ship-1',
    reference_id: 'REF-2026-9041',
    tracking_number: 'KG-892344-MX',
    status: 'customs',
    status_label: 'En Aduana (Revisión)',
    status_tone: 'info',
    created_at: '19 de Octubre, 2026',
    recipient_name: 'Rosa Elena Morales',
    destination_city: 'Puebla, PUE',
    total_formatted: '$129.00 USD',
    is_paid: true,
    box_name: 'Caja Mediana (24x24x20")',
    dimensions_text: '24" x 24" x 20" | 6.66 pies cúbicos',
    insurance_plan_name: 'Protección Total Kangoo ($800 USD)',
    origin_address: '7410 Airline Dr, Houston, TX 77076',
    destination_address: 'Calle 5 Poniente #314, Col. Centro, CP 72000, Puebla, PUE',
    receipt_url: '/api/mock-receipt.pdf',
    breakdown: {
      base_shipping_formatted: '$110.00 USD',
      insurance_formatted: '$12.00 USD',
      extras_formatted: '$0.00 USD',
      customs_tax_formatted: '$7.00 USD'
    },
    timeline: MOCK_TRACKING_DB['KG-892344-MX'].timeline
  },
  {
    id: 'ship-2',
    reference_id: 'REF-2026-8812',
    tracking_number: 'KG-654120-MX',
    status: 'delivered',
    status_label: 'Entregado',
    status_tone: 'success',
    created_at: '05 de Octubre, 2026',
    recipient_name: 'Carlos Alberto Vega',
    destination_city: 'Guadalajara, JAL',
    total_formatted: '$175.00 USD',
    is_paid: true,
    box_name: 'Caja Grande (24x24x30")',
    dimensions_text: '24" x 24" x 30" | 10.0 pies cúbicos',
    insurance_plan_name: 'Protección Básica ($300 USD)',
    origin_address: '2810 S Hampton Rd, Dallas, TX 75224',
    destination_address: 'Av. Vallarta #2450, Col. Arcos Vallarta, CP 44100, Guadalajara, JAL',
    receipt_url: '/api/mock-receipt.pdf',
    breakdown: {
      base_shipping_formatted: '$150.00 USD',
      insurance_formatted: '$5.00 USD',
      extras_formatted: '$20.00 USD',
      customs_tax_formatted: '$0.00 USD'
    },
    timeline: MOCK_TRACKING_DB['KG-654120-MX'].timeline
  },
  {
    id: 'ship-3',
    reference_id: 'REF-PENDING-99',
    tracking_number: null, // Sin pago no hay guía
    status: 'pending_payment',
    status_label: 'Pendiente de Pago',
    status_tone: 'warning',
    created_at: '22 de Octubre, 2026',
    recipient_name: 'Guadalupe Santos',
    destination_city: 'Morelia, MICH',
    total_formatted: '$135.00 USD',
    is_paid: false,
    box_name: 'Caja Mediana (24x24x20")',
    dimensions_text: '24" x 24" x 20"',
    insurance_plan_name: 'Protección Básica ($300 USD)',
    origin_address: '3605 W 26th St, Chicago, IL 60623',
    destination_address: 'Calzada Ventura Puente #810, Morelia, MICH',
    breakdown: {
      base_shipping_formatted: '$115.00 USD',
      insurance_formatted: '$5.00 USD',
      extras_formatted: '$15.00 USD',
      customs_tax_formatted: '$0.00 USD'
    },
    timeline: MOCK_TRACKING_DB['REF-PENDING-99'].timeline
  }
];

export const MOCK_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    alias: 'Casa Mamá (Puebla)',
    recipient_name: 'Rosa Elena Morales',
    phone: '+52 222 555 9182',
    street: 'Calle 5 Poniente',
    exterior_number: '314',
    interior_number: 'Apt 2',
    postal_code: '72000',
    neighborhood: 'Centro Histórico',
    municipality: 'Puebla',
    state: 'Puebla',
    references: 'Portón verde frente a la panadería La Esperanza',
    is_default: true
  },
  {
    id: 'addr-2',
    alias: 'Familia Vega (Guadalajara)',
    recipient_name: 'Carlos Alberto Vega',
    phone: '+52 33 1455 2099',
    street: 'Av. México',
    exterior_number: '1420',
    postal_code: '44100',
    neighborhood: 'Barranquitas',
    municipality: 'Guadalajara',
    state: 'Jalisco',
    references: 'Entre Juan Álvarez y Ramos Millán',
    is_default: false
  }
];
