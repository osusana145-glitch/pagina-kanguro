import { Routes } from '@angular/router';

// Route titles are i18n keys, resolved by I18nTitleStrategy (core/services/i18n-title.strategy.ts).

export const routes: Routes = [
  // 1. Home & Hero Quoter
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'title.home'
  },

  // 2. Public Tracking
  {
    path: 'rastrear',
    loadComponent: () => import('./features/tracking/tracking.component').then(m => m.TrackingComponent),
    title: 'title.tracking'
  },
  {
    path: 'rastrear/:guia',
    loadComponent: () => import('./features/tracking/tracking.component').then(m => m.TrackingComponent),
    title: 'title.tracking'
  },

  // 3. Drop-off Centers
  {
    path: 'centros-de-acopio',
    loadComponent: () =>
      import('./features/collection-centers/collection-centers.component').then(m => m.CollectionCentersComponent),
    title: 'title.centers'
  },

  // 4. Content Center (How it works, FAQs, Allowed items, Transit times)
  {
    path: 'como-funciona',
    loadComponent: () => import('./features/content/content-center.component').then(m => m.ContentCenterComponent),
    data: { initialTab: 'how-it-works' },
    title: 'title.howItWorks'
  },
  {
    path: 'que-puedo-enviar',
    loadComponent: () => import('./features/content/content-center.component').then(m => m.ContentCenterComponent),
    data: { initialTab: 'allowed' },
    title: 'title.items'
  },
  {
    path: 'tiempos-de-entrega',
    loadComponent: () => import('./features/content/content-center.component').then(m => m.ContentCenterComponent),
    data: { initialTab: 'times' },
    title: 'title.times'
  },
  {
    path: 'preguntas-frecuentes',
    loadComponent: () => import('./features/content/content-center.component').then(m => m.ContentCenterComponent),
    data: { initialTab: 'faqs' },
    title: 'title.faq'
  },

  // 5. Protected Forms
  {
    path: 'pedido-especial',
    loadComponent: () =>
      import('./features/forms/special-order/special-order.component').then(m => m.SpecialOrderComponent),
    title: 'title.special'
  },
  {
    path: 'ser-centro-de-acopio',
    loadComponent: () =>
      import('./features/forms/partner-center/partner-center.component').then(m => m.PartnerCenterComponent),
    title: 'title.partner'
  },
  {
    path: 'contacto',
    loadComponent: () => import('./features/forms/contact/contact.component').then(m => m.ContactComponent),
    title: 'title.contact'
  },

  // 6. Checkout
  {
    path: 'enviar',
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    title: 'title.checkout'
  },

  // 7. Customer Portal
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
        title: 'title.shipments'
      },
      {
        path: 'envios/:referencia',
        loadComponent: () =>
          import('./features/account/shipment-detail/shipment-detail.component').then(m => m.ShipmentDetailComponent),
        title: 'title.receipt'
      },
      {
        path: 'direcciones',
        loadComponent: () =>
          import('./features/account/addresses/addresses.component').then(m => m.AddressesComponent),
        title: 'title.addresses'
      }
    ]
  },

  // Fallback Wildcard
  {
    path: '**',
    redirectTo: ''
  }
];
