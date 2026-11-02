import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Inicio y Cotizador Héroe
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Kangoo Xpress | Envíos Rápidos y Seguros de EE. UU. a México'
  },

  // 2. Rastreo Público de Envíos
  {
    path: 'rastrear',
    loadComponent: () => import('./features/tracking/tracking.component').then(m => m.TrackingComponent),
    title: 'Rastreo de Guías en Vivo | Kangoo Xpress'
  },
  {
    path: 'rastrear/:guia',
    loadComponent: () => import('./features/tracking/tracking.component').then(m => m.TrackingComponent),
    title: 'Detalle de Rastreo Satelital | Kangoo Xpress'
  },

  // 3. Centros de Acopio en EE. UU.
  {
    path: 'centros-de-acopio',
    loadComponent: () =>
      import('./features/collection-centers/collection-centers.component').then(m => m.CollectionCentersComponent),
    title: 'Centros de Acopio y Sucursales en EE. UU. | Kangoo Xpress'
  },

  // 4. Centro de Contenido (Cómo funciona, Preguntas, Artículos, Tiempos)
  {
    path: 'como-funciona',
    loadComponent: () => import('./features/content/content-center.component').then(m => m.ContentCenterComponent),
    data: { initialTab: 'how-it-works' },
    title: 'Cómo Funciona el Envío a México | Kangoo Xpress'
  },
  {
    path: 'que-puedo-enviar',
    loadComponent: () => import('./features/content/content-center.component').then(m => m.ContentCenterComponent),
    data: { initialTab: 'allowed' },
    title: 'Artículos Permitidos y Prohibidos en Aduana | Kangoo Xpress'
  },
  {
    path: 'tiempos-de-entrega',
    loadComponent: () => import('./features/content/content-center.component').then(m => m.ContentCenterComponent),
    data: { initialTab: 'times' },
    title: 'Tiempos y Frecuencia de Entrega en México | Kangoo Xpress'
  },
  {
    path: 'preguntas-frecuentes',
    loadComponent: () => import('./features/content/content-center.component').then(m => m.ContentCenterComponent),
    data: { initialTab: 'faqs' },
    title: 'Preguntas Frecuentes (FAQ) | Kangoo Xpress'
  },

  // 5. Formularios Públicos Protegidos contra Spam
  {
    path: 'pedido-especial',
    loadComponent: () =>
      import('./features/forms/special-order/special-order.component').then(m => m.SpecialOrderComponent),
    title: 'Cotización de Cargas Especiales y Tarimas | Kangoo Xpress'
  },
  {
    path: 'ser-centro-de-acopio',
    loadComponent: () =>
      import('./features/forms/partner-center/partner-center.component').then(m => m.PartnerCenterComponent),
    title: 'Afíliate como Centro de Acopio en EE. UU. | Kangoo Xpress'
  },
  {
    path: 'contacto',
    loadComponent: () => import('./features/forms/contact/contact.component').then(m => m.ContactComponent),
    title: 'Atención al Cliente y Soporte | Kangoo Xpress'
  },

  // 6. Checkout y Enviar
  {
    path: 'enviar',
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    title: 'Preparar Envío y Checkout Seguro | Kangoo Xpress'
  },

  // 7. Área Privada / Mi Cuenta
  {
    path: 'cuenta',
    loadComponent: () => import('./features/account/account-layout.component').then(m => m.AccountLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'envios'
      },
      {
        path: 'envios',
        loadComponent: () =>
          import('./features/account/shipment-list/shipment-list.component').then(m => m.ShipmentListComponent),
        title: 'Historial de Mis Envíos | Kangoo Xpress'
      },
      {
        path: 'envios/:referencia',
        loadComponent: () =>
          import('./features/account/shipment-detail/shipment-detail.component').then(m => m.ShipmentDetailComponent),
        title: 'Detalle de Envío y Comprobante | Kangoo Xpress'
      },
      {
        path: 'direcciones',
        loadComponent: () =>
          import('./features/account/addresses/addresses.component').then(m => m.AddressesComponent),
        title: 'Libreta de Direcciones | Kangoo Xpress'
      }
    ]
  },

  // Fallback Wildcard
  {
    path: '**',
    redirectTo: ''
  }
];
