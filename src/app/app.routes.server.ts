import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'rastrear/:guia',
    renderMode: RenderMode.Server
  },
  {
    path: 'cuenta/envios/:referencia',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
