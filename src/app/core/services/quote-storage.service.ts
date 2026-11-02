import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuoteResponse, QuoteRequest } from '../models/api.models';

export interface PersistedQuote {
  quote: QuoteResponse;
  request: QuoteRequest;
  box_name: string;
  persisted_at: string;
  persist: true;
}

@Injectable({
  providedIn: 'root'
})
export class QuoteStorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'kangoo_active_quote';

  readonly currentQuote = signal<PersistedQuote | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  saveQuote(quote: QuoteResponse, request: QuoteRequest, boxName: string): void {
    const payload: PersistedQuote = {
      quote,
      request,
      box_name: boxName,
      persisted_at: new Date().toISOString(),
      persist: true
    };

    this.currentQuote.set(payload);

    if (isPlatformBrowser(this.platformId)) {
      try {
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.warn('Could not save quote to sessionStorage:', err);
      }
    }
  }

  loadFromStorage(): PersistedQuote | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedQuote;
        this.currentQuote.set(parsed);
        return parsed;
      }
    } catch (err) {
      console.warn('Error reading quote from sessionStorage:', err);
    }
    return null;
  }

  clear(): void {
    this.currentQuote.set(null);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
