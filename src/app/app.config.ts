import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { I18nTitleStrategy } from './core/services/i18n-title.strategy';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions, withIncrementalHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { localeInterceptor } from './core/interceptors/locale.interceptor';
import { mockBackendInterceptor } from './core/services/mock-backend.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withViewTransitions({ skipInitialTransition: true })
    ),
    { provide: TitleStrategy, useClass: I18nTitleStrategy },
    provideClientHydration(
      withIncrementalHydration(),
      withEventReplay(),
      // Catalog, site content and the initial quote are resolved during SSR and reused on hydration.
      withHttpTransferCacheOptions({ includePostRequests: true })
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        localeInterceptor,
        mockBackendInterceptor
      ])
    )
  ]
};
