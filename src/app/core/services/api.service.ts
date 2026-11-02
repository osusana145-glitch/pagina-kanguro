import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CatalogResponse,
  CollectionCenter,
  ContactPayload,
  PartnerCenterPayload,
  PostalCodeLookup,
  QuoteRequest,
  QuoteResponse,
  SavedAddress,
  SiteContentResponse,
  SpecialOrderPayload,
  TrackingResponse,
  UserShipmentDetail,
  UserShipmentSummary
} from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  // 1. Catalog
  getCatalog(): Observable<CatalogResponse> {
    return this.http.get<CatalogResponse>(`${this.baseUrl}/catalog`);
  }

  // 2. Postal code lookup
  lookupPostalCode(cp: string): Observable<PostalCodeLookup> {
    return this.http.get<PostalCodeLookup>(`${this.baseUrl}/postal-codes/${encodeURIComponent(cp)}`);
  }

  // 3. Quotes (Un solo motor de precios en backend)
  calculateQuote(request: QuoteRequest): Observable<QuoteResponse> {
    return this.http.post<QuoteResponse>(`${this.baseUrl}/quotes`, request);
  }

  // 4. Tracking
  getTracking(guide: string): Observable<TrackingResponse> {
    return this.http.get<TrackingResponse>(`${this.baseUrl}/tracking/${encodeURIComponent(guide)}`);
  }

  // 5. Collection Centers
  getCollectionCenters(): Observable<CollectionCenter[]> {
    return this.http.get<CollectionCenter[]>(`${this.baseUrl}/collection-centers`);
  }

  // 6. Site Content
  getSiteContent(): Observable<SiteContentResponse> {
    return this.http.get<SiteContentResponse>(`${this.baseUrl}/site-content`);
  }

  // 7. User Shipments & Account
  getUserShipments(): Observable<UserShipmentSummary[]> {
    return this.http.get<UserShipmentSummary[]>(`${this.baseUrl}/me/shipments`);
  }

  getUserShipmentDetail(referenceId: string): Observable<UserShipmentDetail> {
    return this.http.get<UserShipmentDetail>(`${this.baseUrl}/me/shipments/${encodeURIComponent(referenceId)}`);
  }

  getSignedReceipt(referenceId: string): Observable<{ receipt_url: string; expires_at: string }> {
    return this.http.get<{ receipt_url: string; expires_at: string }>(
      `${this.baseUrl}/me/shipments/${encodeURIComponent(referenceId)}/receipt`
    );
  }

  getUserAddresses(): Observable<SavedAddress[]> {
    return this.http.get<SavedAddress[]>(`${this.baseUrl}/me/addresses`);
  }

  // 8. Public Forms with Anti-Spam Honeypot
  submitSpecialOrder(formData: FormData): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.baseUrl}/forms/special-order`, formData);
  }

  submitPartnerForm(payload: PartnerCenterPayload): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.baseUrl}/forms/partner`, payload);
  }

  submitContactForm(payload: ContactPayload): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.baseUrl}/forms/contact`, payload);
  }
}
