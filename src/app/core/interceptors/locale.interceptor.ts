import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { I18nService } from '../services/i18n.service';

export const localeInterceptor: HttpInterceptorFn = (req, next) => {
  const i18n = inject(I18nService);
  const currentLocale = i18n.currentLang();

  // Clone request and inject X-Locale header
  const modifiedReq = req.clone({
    setHeaders: {
      'X-Locale': currentLocale,
      'Accept-Language': currentLocale === 'es' ? 'es-MX,es;q=0.9' : 'en-US,en;q=0.9'
    }
  });

  return next(modifiedReq);
};
