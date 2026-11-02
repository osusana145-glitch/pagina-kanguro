import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import {
  MOCK_CATALOG,
  MOCK_COLLECTION_CENTERS,
  MOCK_SITE_CONTENT,
  MOCK_TRACKING_DB,
  MOCK_USER_SHIPMENTS,
  MOCK_SAVED_ADDRESSES
} from './mock-data';
import { resolveMexicanPostalCode } from './mexican-postal-codes';
import { QuoteRequest, QuoteResponse, PostalCodeLookup, TrackingResponse } from '../models/api.models';

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;
  const method = req.method;

  // 1. GET /catalog
  if (url.endsWith('/catalog') && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_CATALOG })).pipe(delay(120));
  }

  // 2. GET /postal-codes/:cp
  if (url.includes('/postal-codes/') && method === 'GET') {
    const rawCp = url.split('/postal-codes/')[1]?.split('?')[0] || '';
    const match = resolveMexicanPostalCode(rawCp);
    return of(new HttpResponse({ status: 200, body: match })).pipe(delay(150));
  }

  // 3. POST /quotes (REGLA INVIOLABLE: Toda matemática es del backend)
  if (url.endsWith('/quotes') && method === 'POST') {
    const body = req.body as QuoteRequest;
    
    // Server-side calculation only
    let basePrice = 85;
    if (body.box_id === 'box-md') basePrice = 115;
    if (body.box_id === 'box-lg') basePrice = 145;

    let insuranceFee = 0;
    if (body.insurance_plan_id === 'ins-standard') insuranceFee = 12;
    if (body.insurance_plan_id === 'ins-premium') insuranceFee = 28;

    let extrasFee = 0;
    if (body.extras && body.extras.length > 0) {
      body.extras.forEach(extra => {
        if (extra.extra_id === 'ext-pallet') extrasFee += 35 * extra.quantity;
        if (extra.extra_id === 'ext-mattress') extrasFee += 20 * extra.quantity;
        if (extra.extra_id === 'ext-appliance') extrasFee += 45 * extra.quantity;
      });
    }

    const customsTax = 9.0;
    const total = basePrice + insuranceFee + extrasFee + customsTax;

    const quoteResponse: QuoteResponse = {
      quote_id: `Q-${Date.now().toString().slice(-6)}`,
      currency: 'USD',
      breakdown: {
        base_shipping_formatted: `$${basePrice.toFixed(2)} USD`,
        insurance_formatted: `$${insuranceFee.toFixed(2)} USD`,
        extras_formatted: `$${extrasFee.toFixed(2)} USD`,
        customs_tax_formatted: `$${customsTax.toFixed(2)} USD`
      },
      total_formatted: `$${total.toFixed(2)} USD`,
      estimated_days_range: '9 a 13 días hábiles',
      valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX'),
      summary_text: `Cotización formal garantizada con despacho aduanal incluido para destino ${body.destination_state || 'México'}.`
    };

    return of(new HttpResponse({ status: 200, body: quoteResponse })).pipe(delay(200));
  }

  // 4. GET /tracking/:guia (Normalized tracking lookup)
  if (url.includes('/tracking/') && method === 'GET') {
    const rawGuide = decodeURIComponent(url.split('/tracking/')[1]?.split('?')[0] || '').trim().toUpperCase();
    const cleanGuide = rawGuide.replace(/[^A-Z0-9-]/g, '');

    const found = MOCK_TRACKING_DB[cleanGuide];
    if (found) {
      return of(new HttpResponse({ status: 200, body: found })).pipe(delay(200));
    }

    // Dynamic fallback for any valid-looking guide code
    const dynamicTracking: TrackingResponse = {
      tracking_number: cleanGuide,
      reference_id: `REF-${cleanGuide.slice(-4)}`,
      status: 'in_transit',
      status_label: 'En Tránsito Internacional',
      status_tone: 'warning',
      is_paid: true,
      needs_attention: false,
      is_delayed: false,
      origin_city: 'Houston, TX',
      destination_city: 'México Destino',
      recipient_name: 'Cliente Kangoo Xpress',
      box_type: 'Caja Estándar Kangoo',
      estimated_delivery_date: 'En proceso de ruta',
      timeline: [
        {
          step_id: 's-1',
          title: 'Recibido en Centro USA',
          description: 'Documentación y etiquetado con código binacional.',
          location: 'Hub Central, TX',
          timestamp: '20 Oct 2026',
          completed: true,
          current: false
        },
        {
          step_id: 's-2',
          title: 'En Ruta a Aduana Laredo',
          description: 'En traslado hacia el puerto fronterizo.',
          location: 'Laredo, TX',
          timestamp: '22 Oct 2026',
          completed: false,
          current: true
        },
        {
          step_id: 's-3',
          title: 'Despacho Aduanal',
          description: 'Inspección fiscal mexicana.',
          location: 'Aduana México',
          timestamp: null,
          completed: false,
          current: false,
          is_customs: true
        },
        {
          step_id: 's-4',
          title: 'En Ruta Local',
          description: 'Distribución en destino.',
          location: 'México',
          timestamp: null,
          completed: false,
          current: false
        },
        {
          step_id: 's-5',
          title: 'Entregado',
          description: 'Firma de entrega.',
          location: 'Domicilio',
          timestamp: null,
          completed: false,
          current: false
        }
      ]
    };

    return of(new HttpResponse({ status: 200, body: dynamicTracking })).pipe(delay(250));
  }

  // 5. GET /collection-centers
  if (url.endsWith('/collection-centers') && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_COLLECTION_CENTERS })).pipe(delay(100));
  }

  // 6. GET /site-content
  if (url.endsWith('/site-content') && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_SITE_CONTENT })).pipe(delay(100));
  }

  // 7. GET /me/shipments
  if (url.endsWith('/me/shipments') && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_USER_SHIPMENTS })).pipe(delay(150));
  }

  // 8. GET /me/shipments/:ref
  if (url.includes('/me/shipments/') && method === 'GET' && !url.includes('/receipt')) {
    const ref = url.split('/me/shipments/')[1]?.split('?')[0];
    const match = MOCK_USER_SHIPMENTS.find(s => s.reference_id === ref || s.tracking_number === ref) || MOCK_USER_SHIPMENTS[0];
    return of(new HttpResponse({ status: 200, body: match })).pipe(delay(150));
  }

  // 9. GET /me/shipments/:ref/receipt (Signed PDF link)
  if (url.includes('/receipt') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: {
        receipt_url: 'https://kangoo-xpress.com/receipts/signed-receipt-sample.pdf',
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString()
      }
    })).pipe(delay(200));
  }

  // 10. GET /me/addresses
  if (url.endsWith('/me/addresses') && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_SAVED_ADDRESSES })).pipe(delay(100));
  }

  // 11. Public forms (POST /forms/special-order, /forms/partner, /forms/contact)
  if (url.includes('/forms/') && method === 'POST') {
    return of(new HttpResponse({
      status: 200,
      body: { success: true, message: 'Solicitud recibida exitosamente. Nuestro equipo se comunicará contigo en menos de 24 horas.' }
    })).pipe(delay(300));
  }

  // Pass through if not matched
  return next(req);
};
