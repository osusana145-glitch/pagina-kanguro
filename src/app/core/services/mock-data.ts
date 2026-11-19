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
      name: 'Pequeña (Small)',
      subtitle: '18" x 18" x 18" • Medida ideal para ropa, calzado y regalos personales',
      dimensions: { length_in: 18, width_in: 18, height_in: 18, volume_cubic_ft: 3.37 },
      max_weight_lb: 65,
      price_formatted: '$161 USD',
      recommended_for: '18" x 18" x 18" — Puedes añadir seguro * | Verifica artículos permitidos *',
      badge: 'Popular'
    },
    {
      id: 'box-md',
      code: 'BOX_MEDIUM',
      name: 'Mediana (Medium)',
      subtitle: '20" x 20" x 20" • La preferida para despensa y envíos familiares',
      dimensions: { length_in: 20, width_in: 20, height_in: 20, volume_cubic_ft: 4.63 },
      max_weight_lb: 100,
      price_formatted: '$262 USD',
      popular: true,
      recommended_for: '20" x 20" x 20" — Puedes añadir seguro * | Verifica artículos permitidos *',
      badge: 'Más Vendida'
    },
    {
      id: 'box-lg',
      code: 'BOX_LARGE',
      name: 'Grande (Large)',
      subtitle: '24" x 24" x 24" • Máximo espacio para edredones, artículos del hogar y electrónicos',
      dimensions: { length_in: 24, width_in: 24, height_in: 24, volume_cubic_ft: 8.0 },
      max_weight_lb: 150,
      price_formatted: '$328 USD',
      recommended_for: '24" x 24" x 24" — Puedes añadir seguro * | Verifica artículos permitidos *',
      badge: 'Mayor Capacidad'
    }
  ],
  insurance_plans: [
    {
      id: 'ins-none',
      code: 'INS_NONE',
      name: 'Sin Seguro Adicional',
      coverage_amount_usd: 0,
      coverage_formatted: '$0.00 USD',
      price_formatted: '$0 USD',
      description: 'Protección básica estándar según términos y condiciones generales de transportación.'
    },
    {
      id: 'ins-basic',
      code: 'INS_BASIC',
      name: 'Seguro Basic ($30 USD)',
      coverage_amount_usd: 300,
      coverage_formatted: '$300.00 USD',
      price_formatted: '$30 USD',
      description: 'Tu mercancía será protegida hasta por $300 USD ante eventualidades (Aplican Restricciones).'
    },
    {
      id: 'ins-plus',
      code: 'INS_PLUS',
      name: 'Seguro Plus ($40 USD)',
      coverage_amount_usd: 400,
      coverage_formatted: '$400.00 USD',
      price_formatted: '$40 USD',
      description: 'Nuestra póliza más recomendada con cobertura de hasta $400 USD para tu envío (Aplican Restricciones).',
      recommended: true
    }
  ],
  extra_items: [
    {
      id: 'ext-special',
      code: 'EXT_SPECIAL',
      name: 'Envío de Medida Especial / Carga Personalizada',
      category: 'oversized',
      description: 'Para paquetes que exceden las dimensiones estándar. Asesoría directa y cotización personalizada.',
      unit_name: 'envío'
    },
    {
      id: 'ext-pallet',
      code: 'EXT_PALLET',
      name: 'Emplaye y Base de Tarima (Pallet)',
      category: 'oversized',
      description: 'Refuerzo con película plástica de alta resistencia e industrial de base de madera.',
      unit_name: 'tarima'
    },
    {
      id: 'ext-appliance',
      code: 'EXT_APPLIANCE',
      name: 'Huacal Protector de Madera (Electrodomésticos / TV)',
      category: 'appliances',
      description: 'Estructura rígida de madera contra impactos durante la travesía carretera.',
      unit_name: 'caja'
    }
  ]
};

export const MOCK_COLLECTION_CENTERS: CollectionCenter[] = [
  {
    id: 'center-cotati-main',
    name: 'Kangoo Xpress - Bodega Principal & Oficina',
    city: 'Cotati',
    state: 'CA',
    full_address: '321 Blodgett St Suite-A, Cotati, CA 94931, EE. UU.',
    phone: '+1 (707) 800-9318',
    whatsapp: '+1 (707) 612-7290',
    schedule: [
      { days: 'Lunes a Viernes', hours: '9:00 AM - 6:00 PM' },
      { days: 'Sábados', hours: '9:00 AM - 3:00 PM' },
      { days: 'Domingos', hours: 'Cerrado' }
    ],
    directions_url: 'https://maps.app.goo.gl/zigjj4VBQrF8Kf33A',
    lat: 38.3278,
    lng: -122.7077,
    services: ['Bodega Principal', 'Recepción de cajas', 'Venta de cajas oficiales', 'Inspección y sellado', 'Atención directa'],
    is_active: true
  },
  {
    id: 'center-sr-joyeria',
    name: 'Joyería Santa Rosa (Centro de Acopio Autorizado)',
    city: 'Santa Rosa',
    state: 'CA',
    full_address: '1110 Petaluma Hill Rd, Santa Rosa, CA 95404, EE. UU.',
    phone: '+1 (707) 800-9318',
    whatsapp: '+1 (707) 612-7290',
    schedule: [
      { days: 'Lunes a Sábado', hours: '10:00 AM - 6:00 PM' },
      { days: 'Domingos', hours: 'Cerrado' }
    ],
    directions_url: 'https://maps.app.goo.gl/JDCuf36Tn1y7avGi6',
    lat: 38.4285,
    lng: -122.7088,
    services: ['Recepción de paquetes', 'Punto oficial de acopio', 'Venta de cajas'],
    is_active: true
  },
  {
    id: 'center-sr-pacifico',
    name: 'Pacifico Market (Centro de Acopio Autorizado)',
    city: 'Santa Rosa',
    state: 'CA',
    full_address: '3020 Santa Rosa Ave Ste D, Santa Rosa, CA 95407, EE. UU.',
    phone: '+1 (707) 800-9318',
    whatsapp: '+1 (707) 612-7290',
    schedule: [
      { days: 'Lunes a Domingo', hours: '9:00 AM - 7:00 PM' }
    ],
    directions_url: 'https://maps.app.goo.gl/DxHkrkuHuDA3Egc99',
    lat: 38.4093,
    lng: -122.7161,
    services: ['Recepción de cajas', 'Horario extendido', 'Atención en español'],
    is_active: true
  },
  {
    id: 'center-rp-laperla',
    name: 'Novedades La Perla (Centro de Acopio Autorizado)',
    city: 'Rohnert Park',
    state: 'CA',
    full_address: '6650 Commerce Blvd 11-B, Rohnert Park, CA 94978, EE. UU.',
    phone: '+1 (707) 800-9318',
    whatsapp: '+1 (707) 612-7290',
    schedule: [
      { days: 'Lunes a Sábado', hours: '10:00 AM - 6:00 PM' },
      { days: 'Domingos', hours: 'Cerrado' }
    ],
    directions_url: 'https://maps.app.goo.gl/NQnEKVdQ6uJt5Hsk7',
    lat: 38.3496,
    lng: -122.7067,
    services: ['Recepción de paquetes', 'Venta de empaques', 'Asesoría aduanal'],
    is_active: true
  },
  {
    id: 'center-healdsburg-victoria',
    name: 'Novedades Victoria (Centro de Acopio Autorizado)',
    city: 'Healdsburg',
    state: 'CA',
    full_address: '106 Healdsburg Ave, Healdsburg, CA 95448, EE. UU.',
    phone: '+1 (707) 800-9318',
    whatsapp: '+1 (707) 612-7290',
    schedule: [
      { days: 'Lunes a Sábado', hours: '10:00 AM - 6:00 PM' },
      { days: 'Domingos', hours: 'Cerrado' }
    ],
    directions_url: 'https://www.google.com/maps/search/106+Healdsburg+Ave,+Healdsburg,+CA+95448',
    lat: 38.6085,
    lng: -122.8687,
    services: ['Recepción de paquetes', 'Punto de acopio Healdsburg'],
    is_active: true
  },
  {
    id: 'center-lahabra-wedding',
    name: 'Wedding Collectibles (Centro de Acopio Sur de California)',
    city: 'La Habra',
    state: 'CA',
    full_address: '420 Commercial Way Ste 100, La Habra, CA 90631, EE. UU.',
    phone: '+1 (707) 800-9318',
    whatsapp: '+1 (707) 612-7290',
    schedule: [
      { days: 'Lunes a Viernes', hours: '9:00 AM - 5:00 PM' },
      { days: 'Sábados', hours: '9:00 AM - 2:00 PM' }
    ],
    directions_url: 'https://www.google.com/maps/search/420+Commercial+Way+Ste+100,+La+Habra,+CA+90631',
    lat: 33.9238,
    lng: -117.9542,
    services: ['Recepción de cajas', 'Cobertura Condado de Orange / Los Ángeles'],
    is_active: true
  },
  {
    id: 'center-sr-centerdr',
    name: 'Kangoo Xpress - Oficina Corporativa Santa Rosa',
    city: 'Santa Rosa',
    state: 'CA',
    full_address: '1015 Center Dr, Suite A, Santa Rosa, CA 95403, EE. UU.',
    phone: '+1 (707) 800-9318',
    whatsapp: '+1 (707) 612-7290',
    schedule: [
      { days: 'Lunes a Viernes', hours: '9:00 AM - 5:00 PM' },
      { days: 'Sábados y Domingos', hours: 'Cerrado' }
    ],
    directions_url: 'https://maps.app.goo.gl/pm348Tk5QmfpEKjW6',
    lat: 38.4876,
    lng: -122.7388,
    services: ['Atención al cliente', 'Información de envíos', 'Cotizaciones corporativas'],
    is_active: true
  }
];

export const MOCK_SITE_CONTENT: SiteContentResponse = {
  how_it_works: [
    {
      step: 1,
      title: 'Elige el Tamaño de tu Caja',
      description: 'Selecciona la medida que mejor se adapte a tus necesidades (Pequeña 18"x18"x18", Mediana 20"x20"x20", o Grande 24"x24"x24"). Si tienes una medida especial, contáctanos.',
      icon: 'box'
    },
    {
      step: 2,
      title: 'Empaca y Verifica Artículos Permitidos',
      description: 'Prepara tus pertenencias familiares siguiendo nuestra lista oficial de artículos permitidos en aduana para asegurar un tránsito sin contratiempos.',
      icon: 'clipboard-check'
    },
    {
      step: 3,
      title: 'Entrega en Centro de Acopio o Agenda Recolección',
      description: 'Lleva tu paquete a cualquiera de nuestros centros de acopio autorizados en California (Cotati, Santa Rosa, Rohnert Park, Healdsburg, La Habra) o solicita recolección.',
      icon: 'truck'
    },
    {
      step: 4,
      title: 'Despacho Aduanal y Entrega Segura en México',
      description: 'Garantizamos el transporte seguro y la entrega en tiempo y forma en cualquier domicilio de la República Mexicana con seguimiento en vivo y notificaciones en tiempo real.',
      icon: 'home'
    }
  ],
  faqs: [
    {
      id: 'faq-1',
      category: 'Tarifas y Tamaños',
      question: '¿Cuáles son las medidas y precios oficiales de las cajas?',
      answer: 'Contamos con 3 tamaños oficiales: Pequeña (18" x 18" x 18") por $161 USD; Mediana (20" x 20" x 20") por $262 USD; y Grande (24" x 24" x 24") por $328 USD. Además, si requieres un envío con medidas especiales, contáctanos directamente para cotizarte.'
    },
    {
      id: 'faq-2',
      category: 'Seguro de Mercancías',
      question: '¿Qué opciones de seguro o aseguranzas ofrecen para proteger mi paquete?',
      answer: 'Ofrecemos dos seguros opcionales para tu mayor tranquilidad: Plan Basic con un costo de $30 USD (cobertura de hasta $300 USD) y Plan Plus con un costo de $40 USD (cobertura de hasta $400 USD). Aplican restricciones y verificación de artículos permitidos.'
    },
    {
      id: 'faq-3',
      category: 'Envíos Especiales',
      question: '¿Qué hago si tengo un paquete que excede las medidas estándar?',
      answer: 'Si tienes un envío fuera de las medidas de los paquetes establecidos, podemos realizar envíos de medidas especiales, electrodomésticos, tarimas o menajes. Contáctanos por teléfono al 707-800-9318 o por WhatsApp al +1 (707) 612-7290 para darte una cotización personalizada.'
    },
    {
      id: 'faq-4',
      category: 'Rastreo y Seguimiento',
      question: '¿Cómo puedo rastrear mi envío?',
      answer: 'Puedes ingresar tu número de guía en nuestro buscador en línea o descargar la app móvil oficial de Kangoo Xpress para consultar el estatus en vivo. Si tienes dudas sobre el estatus, nuestro equipo de soporte está disponible vía telefónica y WhatsApp.'
    },
    {
      id: 'faq-5',
      category: 'Centros de Acopio',
      question: '¿Dónde puedo entregar mis paquetes en California?',
      answer: 'Contamos con nuestra bodega y oficina central en Cotati (321 Blodgett St Suite-A), así como centros de acopio autorizados en Santa Rosa (Joyería Santa Rosa, Pacifico Market, Center Dr), Rohnert Park (Novedades La Perla), Healdsburg (Novedades Victoria) y en el Sur de California en La Habra (Wedding Collectibles).'
    }
  ],
  allowed_items: [
    { id: 'al-1', name: 'Ropa nueva y usada de uso personal', category: 'Prendas', recommendations: 'Empacar en bolsas herméticas para optimizar espacio al vacío.' },
    { id: 'al-2', name: 'Calzado y tenis para toda la familia', category: 'Prendas', recommendations: 'Sugerido organizar por pares debidamente empacados.' },
    { id: 'al-3', name: 'Herramientas manuales y caseras', category: 'Herramientas', recommendations: 'Sin líquidos inflamables ni baterías de litio sueltas.' },
    { id: 'al-4', name: 'Juguetes no bélicos y consolas de videojuegos', category: 'Electrónicos', recommendations: 'Proteger con plástico burbuja en la parte central de la caja.' },
    { id: 'al-5', name: 'Vajillas, ollas y utensilios de cocina', category: 'Hogar', recommendations: 'Envolver piezas delicadas individualmente con material de protección.' },
    { id: 'al-6', name: 'Alimentos no perecederos secos o enlatados', category: 'Despensa', recommendations: 'Envolturas originales de fábrica, selladas herméticamente.' }
  ],
  prohibited_items: [
    { id: 'pr-1', name: 'Efectos bancarios, billetes o monedas en efectivo', category: 'Valores', hazard_type: 'Prohibición Federal', legal_warning: 'Prohibido por normativas bancarias y aduanales internacionales.' },
    { id: 'pr-2', name: 'Fuegos artificiales comunes, pólvora y pirotecnia', category: 'Explosivos', hazard_type: 'Material Explosivo', legal_warning: 'Riesgo inminente en transportación terrestre.' },
    { id: 'pr-3', name: 'Desechos peligrosos o material contaminante', category: 'Sanitario', hazard_type: 'Riesgo Biológico', legal_warning: 'Prohibido de manera estricta bajo regulaciones internacionales.' },
    { id: 'pr-4', name: 'Restos humanos, restos fetales o partes del cuerpo', category: 'Biológico', hazard_type: 'Regulación Sanitaria', legal_warning: 'Prohibición absoluta en paquetería comercial.' },
    { id: 'pr-5', name: 'Marfil y productos de especies protegidas', category: 'Ambiental', hazard_type: 'Tratado CITES', legal_warning: 'Sancionado severamente por tratados internacionales de protección animal.' },
    { id: 'pr-6', name: 'Marihuana, cannabis medicinal y cannabidiol (CBD)', category: 'Salud', hazard_type: 'Sustancia Controlada', legal_warning: 'Prohibido su cruce fronterizo bajo tratados aduanales bilaterales.' },
    { id: 'pr-7', name: 'Timbres postales o certificados fiscales', category: 'Fiscal', hazard_type: 'Valores Oficiales', legal_warning: 'No amparado en servicios de mensajería general.' },
    { id: 'pr-8', name: 'Aletas de tiburón y fauna silvestre no autorizada', category: 'Ambiental', hazard_type: 'Protección Ambiental', legal_warning: 'Delito ambiental transfronterizo.' },
    { id: 'pr-9', name: 'Productos de vapeo, cigarros electrónicos y e-líquidos', category: 'Salud', hazard_type: 'Restricción Sanitaria COFEPRIS', legal_warning: 'Importación estrictamente prohibida por decreto presidencial en México.' },
    { id: 'pr-10', name: 'Bebidas alcohólicas (cerveza, vino y licores sin permiso)', category: 'Bebidas', hazard_type: 'Regulación Fiscal', legal_warning: 'Consulte las guías especiales para envíos con arancel específico.' },
    { id: 'pr-11', name: 'Productos de origen animal no domesticados (p. ej. piel de serpiente, nácar)', category: 'Fauna', hazard_type: 'Control Ambiental', legal_warning: 'Sujeto a decomiso aduanal legal.' },
    { id: 'pr-12', name: 'Municiones, cartuchos y proyectiles', category: 'Seguridad', hazard_type: 'Delito Grave', legal_warning: 'Se reporta de forma inmediata a la fiscalía y autoridades binacionales.' },
    { id: 'pr-13', name: 'Sustancias biológicas o muestras de animales/humanos', category: 'Sanitario', hazard_type: 'Riesgo Epidemiológico', legal_warning: 'Prohibido en paquetería estándar.' },
    { id: 'pr-14', name: 'Mercancía peligrosa, inflamable o corrosiva', category: 'Químicos', hazard_type: 'Material Peligroso', legal_warning: 'Peligro de combustión durante el tránsito carretero.' },
    { id: 'pr-15', name: 'Armas de fuego, armamento (incluso réplicas, balines o inertes)', category: 'Seguridad', hazard_type: 'Prohibición Federal Absoluta', legal_warning: 'Sancionado severamente bajo leyes federales mexicanas y estadounidenses.' },
    { id: 'pr-16', name: 'Pieles exóticas no autorizadas', category: 'Fauna', hazard_type: 'Protección Animal', legal_warning: 'Restricción de tratados internacionales.' },
    { id: 'pr-17', name: 'Oro, plata y metales preciosos en barras o lingotes', category: 'Valores', hazard_type: 'Contrabando de Metales', legal_warning: 'No respaldado por seguros comerciales.' },
    { id: 'pr-18', name: 'Cáñamo y derivados de cáñamo sin registro', category: 'Salud', hazard_type: 'Restricción Farmacéutica', legal_warning: 'Prohibido bajo normativas aduanales.' },
    { id: 'pr-19', name: 'Animales vivos de cualquier especie', category: 'Fauna', hazard_type: 'Bienestar Animal', legal_warning: 'Prohibido terminantemente.' },
    { id: 'pr-20', name: 'Perecederos sin refrigeración garantizada', category: 'Alimentos', hazard_type: 'Descomposición', legal_warning: 'Riesgo sanitario de contaminación.' },
    { id: 'pr-21', name: 'Plantas, semillas no procesadas y frutas frescas', category: 'Fitosanitario', hazard_type: 'Riesgo Agrícola SENASICA', legal_warning: 'Prohibido para prevenir plagas agrícolas en el territorio nacional.' },
    { id: 'pr-22', name: 'Tabaco y cigarrillos en volumen comercial', category: 'Fiscal', hazard_type: 'Impuestos Especiales IEPS', legal_warning: 'Sujeto a retención aduanal inmediata.' },
    { id: 'pr-23', name: 'Cualquier tipo de droga o estupefaciente ilegal', category: 'Seguridad', hazard_type: 'Narcóticos Ilegales', legal_warning: 'Delito federal de máxima gravedad sancionado por leyes penales.' }
  ],
  delivery_times: [
    { region: 'Norte y Noreste de México', states: ['Nuevo León', 'Coahuila', 'Tamaulipas', 'San Luis Potosí', 'Chihuahua'], days_range: '8 - 12 días hábiles', shipping_frequency: 'Salidas continuas programadas' },
    { region: 'Centro y Bajío', states: ['Jalisco', 'Guanajuato', 'Michoacán', 'Querétaro', 'Aguascalientes', 'Zacatecas'], days_range: '9 - 13 días hábiles', shipping_frequency: 'Salidas frecuentes directas' },
    { region: 'Valle de México y Oriente', states: ['Ciudad de México', 'Estado de México', 'Puebla', 'Hidalgo', 'Veracruz', 'Morelos'], days_range: '10 - 14 días hábiles', shipping_frequency: 'Salidas frecuentes directas' },
    { region: 'Sur y Sureste', states: ['Guerrero', 'Oaxaca', 'Chiapas', 'Tabasco', 'Yucatán', 'Quintana Roo'], days_range: '12 - 16 días hábiles', shipping_frequency: 'Salidas semanales' }
  ],
  reviews: [
    {
      id: 'rev-1',
      author: 'Alfredo Ruiz',
      city_origin: 'Santa Rosa, CA',
      city_dest: 'Michoacán, MEX',
      rating: 5,
      comment: 'Excelente servicio, confiable y rápido. El paquete llegó en perfectas condiciones hasta la puerta.',
      date: 'Hace 3 días',
      verified_delivery: true
    },
    {
      id: 'rev-2',
      author: 'Yolanda Sánchez',
      city_origin: 'Cotati, CA',
      city_dest: 'Puebla, MEX',
      rating: 5,
      comment: 'Precios súper accesibles, he enviado con otras compañías y esta tiene el mejor precio, aparte que el servicio es muy bueno y amable.',
      date: 'Hace 5 días',
      verified_delivery: true
    },
    {
      id: 'rev-3',
      author: 'David Archundia',
      city_origin: 'Rohnert Park, CA',
      city_dest: 'Guadalajara, JAL',
      rating: 5,
      comment: 'Mandé un paquete a Guadalajara y llegó en menos tiempo del que me dijeron, súper rápido.',
      date: 'Hace 1 semana',
      verified_delivery: true
    },
    {
      id: 'rev-4',
      author: 'Oliver Torres',
      city_origin: 'Santa Rosa, CA',
      city_dest: 'Guanajuato, MEX',
      rating: 5,
      comment: 'Me gusta mucho esta paquetería, cuidan los paquetes y siempre llegan a su destino en el tiempo que te dicen.',
      date: 'Hace 1 semana',
      verified_delivery: true
    },
    {
      id: 'rev-5',
      author: 'Rodolfo Salinas',
      city_origin: 'Santa Rosa, CA',
      city_dest: 'Durango y Puebla',
      rating: 5,
      comment: 'Tengo familiares en Durango y Puebla, envié mis paquetes con Kangoo y en ambas ocasiones fue súper fácil y sin contratiempos.',
      date: 'Hace 2 semanas',
      verified_delivery: true
    },
    {
      id: 'rev-6',
      author: 'Dylan García',
      city_origin: 'Healdsburg, CA',
      city_dest: 'Oaxaca, MEX',
      rating: 5,
      comment: 'Muy buen servicio al cliente, me atienden bien y si tengo dudas les llamo y lo resuelven; además que el servicio de envío es muy bueno.',
      date: 'Hace 2 semanas',
      verified_delivery: true
    },
    {
      id: 'rev-7',
      author: 'Saúl Vázquez',
      city_origin: 'Petaluma, CA',
      city_dest: 'Zacatecas, MEX',
      rating: 5,
      comment: 'Estoy muy feliz de haber encontrado esta paquetería, el proceso es fácil y rápido. Enviaré mis paquetes de nuevo con ellos.',
      date: 'Hace 3 semanas',
      verified_delivery: true
    },
    {
      id: 'rev-8',
      author: 'Jonathan Herrera',
      city_origin: 'La Habra, CA',
      city_dest: 'Estado de México, MEX',
      rating: 5,
      comment: 'Muy buen lugar para enviar tus paquetes. Trato honesto y siempre atentos a cualquier duda.',
      date: 'Hace 3 semanas',
      verified_delivery: true
    },
    {
      id: 'rev-9',
      author: 'Liam Ortega',
      city_origin: 'Santa Rosa, CA',
      city_dest: 'Hidalgo, MEX',
      rating: 5,
      comment: 'Muy buen precio y excelente tamaño de cajas. Todo llegó bien sellado.',
      date: 'Hace 1 mes',
      verified_delivery: true
    },
    {
      id: 'rev-10',
      author: 'Miriam Jones',
      city_origin: 'Cotati, CA',
      city_dest: 'San Luis Potosí, MEX',
      rating: 5,
      comment: '100% recomendable. La atención telefónica y por WhatsApp es rápida y amable.',
      date: 'Hace 1 mes',
      verified_delivery: true
    }
  ]
  // stats: omitted on purpose — no verified figures yet, so the UI hides them.
  // mobile_app: { ios_url, android_url } — set real store links when published.
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
    origin_city: 'Santa Rosa, CA (EE. UU.)',
    destination_city: 'Puebla, PUE (México)',
    recipient_name: 'Rosa Elena Morales',
    box_type: 'Caja Mediana (20x20x20")',
    estimated_delivery_date: '28 de Octubre, 2026',
    timeline: [
      {
        step_id: 'step-1',
        title: 'Recibido en Bodega Cotati / Santa Rosa',
        description: 'Caja pesada, sellada y con código de barra binacional asignado.',
        location: 'Cotati, CA',
        timestamp: '19 Oct 2026, 14:32',
        completed: true,
        current: false
      },
      {
        step_id: 'step-2',
        title: 'En Tránsito a Frontera',
        description: 'Unidad de consolidación en trayecto carretero seguro hacia la frontera.',
        location: 'Ruta Internacional',
        timestamp: '21 Oct 2026, 08:15',
        completed: true,
        current: false
      },
      {
        step_id: 'step-3',
        title: 'Inspección y Despacho Aduanal',
        description: 'Revisión aduanal formal por autoridades del SAT / ANAM. Proceso normal en curso.',
        location: 'Aduana Fronteriza México',
        timestamp: '22 Oct 2026, 09:40',
        completed: false,
        current: true,
        is_customs: true
      },
      {
        step_id: 'step-4',
        title: 'En Ruta de Entrega Terrestre',
        description: 'Asignado a camión de reparto local hacia centro de distribución en destino.',
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
    origin_city: 'Santa Rosa, CA',
    destination_city: 'Guadalajara, JAL',
    recipient_name: 'David Archundia',
    box_type: 'Caja Grande (24x24x24")',
    estimated_delivery_date: 'Entregado el 18 de Octubre, 2026',
    timeline: [
      { step_id: 's-1', title: 'Recibido en Bodega Cotati', description: 'Recepción y cotejo de inventario.', location: 'Cotati, CA', timestamp: '05 Oct 2026', completed: true, current: false },
      { step_id: 's-2', title: 'En Tránsito Internacional', description: 'Traslado seguro en tractocamión.', location: 'Ruta Carretera', timestamp: '08 Oct 2026', completed: true, current: false },
      { step_id: 's-3', title: 'Despacho Aduanal Concluido', description: 'Pedimento y sellos fiscales autorizados.', location: 'Aduana México', timestamp: '11 Oct 2026', completed: true, current: false, is_customs: true },
      { step_id: 's-4', title: 'En Ruta Local Guadalajara', description: 'Salida a ruta con chofer repartidor.', location: 'Guadalajara, JAL', timestamp: '17 Oct 2026', completed: true, current: false },
      { step_id: 's-5', title: 'Entregado', description: 'Recibido satisfactoriamente por el destinatario.', location: 'Guadalajara, JAL', timestamp: '18 Oct 2026, 16:10', completed: true, current: true }
    ]
  },

  // 3. REGLA INVIOLABLE #4: Sin pago no hay guía
  'REF-PENDING-99': {
    tracking_number: null,
    reference_id: 'REF-PENDING-99',
    status: 'pending_payment',
    status_label: 'Pendiente de Pago',
    status_tone: 'warning',
    is_paid: false,
    needs_attention: true,
    attention_reason: 'Envío registrado en sistema. El número de guía oficial y el comprobante de embarque se emiten automáticamente al acreditar el pago.',
    is_delayed: false,
    origin_city: 'Rohnert Park, CA',
    destination_city: 'Morelia, MICH',
    recipient_name: 'Guadalupe Santos',
    box_type: 'Caja Mediana (20x20x20")',
    estimated_delivery_date: 'Sujeto a acreditación de pago',
    timeline: [
      {
        step_id: 's-p1',
        title: 'Pre-Registro Creado',
        description: 'Esperando liquidación para generar guía física y autorización de salida.',
        location: 'Centro de Acopio La Perla, Rohnert Park, CA',
        timestamp: '22 Oct 2026, 10:00',
        completed: true,
        current: true
      }
    ],
    payment_cta: {
      message: 'Completa tu pago seguro para liberar tu guía oficial.',
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
    delivery_estimate_days: { min: 8, max: 11 }
  },
  '58000': {
    postal_code: '58000',
    state_code: 'MICH',
    state_name: 'Michoacán',
    municipality: 'Morelia',
    settlements: ['Morelia Centro', 'Ventura Puente', 'Chapultepec'],
    is_covered: true,
    delivery_estimate_days: { min: 9, max: 13 }
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
    total_formatted: '$302.00 USD',
    is_paid: true,
    box_name: 'Caja Mediana (20x20x20")',
    dimensions_text: '20" x 20" x 20" | 4.63 pies cúbicos',
    insurance_plan_name: 'Seguro Plus ($400 USD)',
    origin_address: '321 Blodgett St Suite-A, Cotati, CA 94931',
    destination_address: 'Calle 5 Poniente #314, Col. Centro, CP 72000, Puebla, PUE',
    receipt_url: '/api/mock-receipt.pdf',
    breakdown: {
      base_shipping_formatted: '$262.00 USD',
      insurance_formatted: '$40.00 USD',
      extras_formatted: '$0.00 USD',
      customs_tax_formatted: '$0.00 USD'
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
    recipient_name: 'David Archundia',
    destination_city: 'Guadalajara, JAL',
    total_formatted: '$358.00 USD',
    is_paid: true,
    box_name: 'Caja Grande (24x24x24")',
    dimensions_text: '24" x 24" x 24" | 8.0 pies cúbicos',
    insurance_plan_name: 'Seguro Basic ($300 USD)',
    origin_address: '321 Blodgett St Suite-A, Cotati, CA 94931',
    destination_address: 'Av. Vallarta #2450, Col. Arcos Vallarta, CP 44100, Guadalajara, JAL',
    receipt_url: '/api/mock-receipt.pdf',
    breakdown: {
      base_shipping_formatted: '$328.00 USD',
      insurance_formatted: '$30.00 USD',
      extras_formatted: '$0.00 USD',
      customs_tax_formatted: '$0.00 USD'
    },
    timeline: MOCK_TRACKING_DB['KG-654120-MX'].timeline
  }
];

export const MOCK_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    alias: 'Casa Familia (Puebla)',
    recipient_name: 'Rosa Elena Morales',
    phone: '+52 222 555 9182',
    street: 'Calle 5 Poniente',
    exterior_number: '314',
    interior_number: 'Apt 2',
    postal_code: '72000',
    neighborhood: 'Centro Histórico',
    municipality: 'Puebla',
    state: 'Puebla',
    references: 'Frente a la panadería',
    is_default: true
  },
  {
    id: 'addr-2',
    alias: 'Familia Archundia (Guadalajara)',
    recipient_name: 'David Archundia',
    phone: '+52 33 1455 2099',
    street: 'Av. Vallarta',
    exterior_number: '2450',
    postal_code: '44100',
    neighborhood: 'Arcos Vallarta',
    municipality: 'Guadalajara',
    state: 'Jalisco',
    references: 'Cerca de La Minerva',
    is_default: false
  }
];
