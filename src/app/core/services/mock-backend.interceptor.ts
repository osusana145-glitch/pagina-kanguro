import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { from, of, switchMap, tap } from 'rxjs';

/**
 * Dev/staging mock backend.
 *
 * - The mock routes and their data are loaded with a dynamic import, so they
 *   stay out of the initial bundle.
 * - Because this interceptor answers before Angular's built-in HTTP transfer
 *   cache sees the request, it mirrors that cache itself: responses produced
 *   during SSR are serialized into TransferState and replayed on hydration, so
 *   the quoter does not re-fetch (and flash empty) in the browser.
 *
 * Remove this interceptor when the real API is connected; the built-in
 * transfer cache (app.config.ts) then takes over.
 */
export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  const transferState = inject(TransferState);
  const isServer = isPlatformServer(inject(PLATFORM_ID));
  const key = makeStateKey<unknown>(
    `mock:${req.method} ${req.urlWithParams} ${req.body ? JSON.stringify(req.body) : ''}`
  );

  if (!isServer && transferState.hasKey(key)) {
    const body = transferState.get(key, null);
    transferState.remove(key);
    return of(new HttpResponse({ status: 200, body, url: req.url }));
  }

  return from(import('./mock-routes')).pipe(
    switchMap(m => m.handleMockRequest(req, next)),
    tap(event => {
      if (isServer && event instanceof HttpResponse) {
        transferState.set(key, event.body);
      }
    })
  );
};
