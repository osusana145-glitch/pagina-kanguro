import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { localeInterceptor } from './core/interceptors/locale.interceptor';
import { mockBackendInterceptor } from './core/services/mock-backend.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideClientHydration(
      withIncrementalHydration(),
      withEventReplay()
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
