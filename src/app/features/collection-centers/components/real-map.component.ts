import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  input,
  output,
  effect,
  PLATFORM_ID,
  viewChild,
  ElementRef,
  OnDestroy,
  afterNextRender
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CollectionCenter } from '../../../core/models/api.models';

export type MapTileStyle = 'streets' | 'satellite' | 'topo';
export type MapViewMode = 'interactive' | 'google';

@Component({
  selector: 'app-real-map',
  standalone: true,
  template: `
    <div class="real-map-wrapper" id="realMapSection">
      <!-- Map Header & Mode Selector -->
      <div class="map-card-header">
        <div class="header-left">
          <div class="live-status-pill">
            <span class="live-dot"></span>
            <span>Cartografía GIS & Navegación GPS</span>
          </div>
          <h3 class="map-title">Ubicaciones Oficiales en Estados Unidos</h3>
        </div>

        <div class="view-mode-tabs" role="tablist">
          <button
            type="button"
            id="tabInteractiveMap"
            role="tab"
            class="tab-btn"
            [class.active]="viewMode() === 'interactive'"
            (click)="setViewMode('interactive')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
            <span>Mapa Interactivo</span>
          </button>

          <button
            type="button"
            id="tabGoogleMaps"
            role="tab"
            class="tab-btn"
            [class.active]="viewMode() === 'google'"
            (click)="setViewMode('google')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Google Maps Oficial</span>
          </button>
        </div>
      </div>

      <!-- Quick City Bar -->
      <div class="city-quick-bar" aria-label="Accesos rápidos a sucursales">
        <button
          type="button"
          class="city-chip-btn"
          [class.active]="isViewingAll()"
          (click)="fitAllMarkers()"
          title="Ver todas las sucursales en EE. UU."
        >
          <span class="chip-icon">🌐</span>
          <span>Ver Todas ({{ centers().length }})</span>
        </button>

        @for (center of centers(); track center.id) {
          <button
            type="button"
            class="city-chip-btn"
            [class.active]="activeCenter()?.id === center.id && !isViewingAll()"
            (click)="selectCenter(center)"
            [title]="center.name"
          >
            <span class="chip-icon">📍</span>
            <span>{{ center.city }}, {{ center.state }}</span>
          </button>
        }
      </div>

      <!-- Main Map Display Area -->
      <div class="map-viewport-container">
        <!-- Interactive Leaflet Map Canvas -->
        <div
          #mapContainer
          id="leafletMapContainer"
          class="leaflet-map-element"
          [class.hidden-layer]="viewMode() !== 'interactive'"
        ></div>

        <!-- Tile Style Switcher Floating Overlay (Only in interactive mode) -->
        @if (viewMode() === 'interactive') {
          <div class="map-floating-controls" aria-label="Controles del mapa">
            <div class="tile-style-pill-group">
              <button
                type="button"
                class="style-chip"
                [class.active]="tileStyle() === 'streets'"
                (click)="setTileStyle('streets')"
                title="Vista de calles detallada y segura con nombres de avenidas"
              >
                🛣️ Calles (Detallado)
              </button>
              <button
                type="button"
                class="style-chip"
                [class.active]="tileStyle() === 'satellite'"
                (click)="setTileStyle('satellite')"
                title="Vista satelital de alta resolución"
              >
                🛰️ Satélite
              </button>
              <button
                type="button"
                class="style-chip"
                [class.active]="tileStyle() === 'topo'"
                (click)="setTileStyle('topo')"
                title="Vista OpenStreetMap estándar"
              >
                🌐 Topo / OSM
              </button>
            </div>

            <button
              type="button"
              class="recenter-btn"
              (click)="fitAllMarkers()"
              title="Centrar y mostrar todas las sucursales"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
                <line x1="12" y1="2" x2="12" y2="5"></line>
                <line x1="12" y1="19" x2="12" y2="22"></line>
                <line x1="2" y1="12" x2="5" y2="12"></line>
                <line x1="19" y1="12" x2="22" y2="12"></line>
              </svg>
              <span>Centrar red</span>
            </button>
          </div>
        }

        <!-- Google Maps Official Embed View -->
        @if (viewMode() === 'google') {
          <div class="google-maps-embed-wrapper">
            @if (googleMapsEmbedUrl(); as url) {
              <iframe
                id="gmapsIframe"
                class="google-iframe"
                [src]="url"
                width="100%"
                height="100%"
                style="border:0;"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
                title="Google Maps de la sucursal seleccionada"
              ></iframe>
            } @else {
              <div class="map-empty-state">
                <p>Selecciona una sucursal para verla en Google Maps.</p>
              </div>
            }
          </div>
        }
      </div>

      <!-- Selected Center Drawer / Bottom Overlay -->
      @if (activeCenter(); as active) {
        <div class="active-center-drawer">
          <div class="drawer-header">
            <div class="center-badge-row">
              <span class="badge badge-success">Sucursal Seleccionada</span>
              <span class="city-badge">{{ active.city }}, {{ active.state }}</span>
            </div>
            <h3 class="drawer-center-name">{{ active.name }}</h3>
            <div class="drawer-street-badge">
              <span class="street-icon">🛣️</span>
              <span>Calle: <strong>{{ getStreetName(active.full_address) }}</strong> • Cruce / Zona: {{ active.city }}, {{ active.state }}</span>
            </div>
            <p class="drawer-address">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="loc-icon">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{{ active.full_address }}</span>
              <button
                type="button"
                class="copy-btn"
                (click)="copyAddress(active.full_address)"
                [title]="copied() ? 'Copiado' : 'Copiar dirección'"
              >
                {{ copied() ? '✓ Copiado' : 'Copiar' }}
              </button>
            </p>
          </div>

          <div class="drawer-details">
            <div class="drawer-schedule">
              <span class="schedule-label">🕒 Horarios de Atención:</span>
              <div class="schedule-items">
                @for (sch of active.schedule; track sch.days) {
                  <span class="sch-item">
                    <strong>{{ sch.days }}:</strong> {{ sch.hours }}
                  </span>
                }
              </div>
            </div>

            <div class="drawer-actions">
              <a
                [href]="active.directions_url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary btn-directions"
                id="btnOpenDirections"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                </svg>
                <span>Cómo Llegar</span>
              </a>

              <a
                [href]="getStreetViewUrl(active)"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-streetview"
                id="btnOpenStreetView"
                title="Ver fachada y calle en Google Street View 360°"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <span>Ver Calle 360° (Street View)</span>
              </a>

              <a
                [href]="'tel:' + active.phone"
                class="btn btn-outline btn-call"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>Llamar: {{ active.phone }}</span>
              </a>

              @if (active.whatsapp) {
                <a
                  [href]="'https://wa.me/' + cleanPhone(active.whatsapp)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-whatsapp"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .real-map-wrapper {
      background: #FFFFFF;
      border-radius: var(--radius-2xl, 1.25rem);
      box-shadow: 0 12px 36px rgba(15, 23, 42, 0.12);
      border: 1px solid var(--kangoo-border, #E2E8F0);
      overflow: hidden;
      margin-top: 1.5rem;
    }

    /* Map Card Header */
    .map-card-header {
      padding: 1.25rem 1.75rem;
      background: #FFFFFF;
      border-bottom: 1px solid var(--kangoo-border, #E2E8F0);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    .live-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: #F1F5F9;
      color: #0F172A;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      margin-bottom: 0.35rem;
      border: 1px solid #E2E8F0;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.7);
      animation: pulseGreen 2s infinite;
    }

    @keyframes pulseGreen {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }

    .map-title {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--kangoo-secondary, #1E293B);
      margin: 0;
    }

    .view-mode-tabs {
      display: flex;
      background: #F1F5F9;
      padding: 0.3rem;
      border-radius: var(--radius-lg, 0.75rem);
      gap: 0.25rem;
    }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      font-weight: 700;
      border-radius: var(--radius-md, 0.5rem);
      border: none;
      background: transparent;
      color: var(--kangoo-neutral-muted, #64748B);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        color: var(--kangoo-secondary, #1E293B);
      }

      &.active {
        background: #FFFFFF;
        color: var(--kangoo-primary, #E31B23);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      }
    }

    /* City Quick Bar */
    .city-quick-bar {
      padding: 0.75rem 1.5rem;
      background: #F8FAFC;
      border-bottom: 1px solid var(--kangoo-border, #E2E8F0);
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      scrollbar-width: thin;
      align-items: center;
    }

    .city-chip-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.85rem;
      font-size: 0.82rem;
      font-weight: 700;
      border-radius: 9999px;
      border: 1px solid var(--kangoo-border, #CBD5E1);
      background: #FFFFFF;
      color: var(--kangoo-secondary, #1E293B);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--kangoo-primary, #E31B23);
        background: #FEF2F2;
        color: var(--kangoo-primary, #E31B23);
      }

      &.active {
        background: var(--kangoo-secondary, #1E293B);
        border-color: var(--kangoo-secondary, #1E293B);
        color: #FFFFFF;
        box-shadow: 0 2px 8px rgba(30, 41, 59, 0.25);
      }
    }

    /* Main Map Viewport */
    .map-viewport-container {
      position: relative;
      height: 480px;
      background: #E2E8F0;
      overflow: hidden;

      @media (max-width: 768px) {
        height: 380px;
      }
    }

    .leaflet-map-element {
      width: 100%;
      height: 100%;
      z-index: 1;

      &.hidden-layer {
        display: none;
      }
    }

    /* Floating Style Switcher */
    .map-floating-controls {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
      pointer-events: none;
    }

    .tile-style-pill-group,
    .recenter-btn {
      pointer-events: auto;
    }

    .tile-style-pill-group {
      display: inline-flex;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      padding: 0.25rem;
      border-radius: 9999px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(0, 0, 0, 0.08);
      gap: 0.2rem;
    }

    .style-chip {
      padding: 0.35rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 9999px;
      border: none;
      background: transparent;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #F1F5F9;
      }

      &.active {
        background: var(--kangoo-secondary, #1E293B);
        color: #FFFFFF;
      }
    }

    .recenter-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      padding: 0.45rem 0.85rem;
      font-size: 0.78rem;
      font-weight: 700;
      border-radius: 9999px;
      color: #0F172A;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #F8FAFC;
        border-color: var(--kangoo-primary, #E31B23);
        color: var(--kangoo-primary, #E31B23);
      }
    }

    /* Google Maps Embed */
    .google-maps-embed-wrapper {
      width: 100%;
      height: 100%;
      position: absolute;
      inset: 0;
      z-index: 2;
      background: #F1F5F9;
    }

    .google-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    .map-empty-state {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748B;
      font-weight: 600;
    }

    /* Bottom Drawer / Selected Center Info */
    .active-center-drawer {
      padding: 1.5rem 1.75rem;
      background: #FFFFFF;
      border-top: 3px solid var(--kangoo-primary, #E31B23);
      display: flex;
      justify-content: space-between;
      gap: 2rem;

      @media (max-width: 900px) {
        flex-direction: column;
        gap: 1.25rem;
      }
    }

    .drawer-header {
      flex: 1;
    }

    .center-badge-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.4rem;
    }

    .city-badge {
      background: #E2E8F0;
      color: #334155;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.15rem 0.6rem;
      border-radius: 9999px;
    }

    .drawer-center-name {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--kangoo-secondary, #1E293B);
      margin: 0.25rem 0 0.5rem;
    }

    .drawer-address {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--kangoo-neutral-text, #334155);
      font-size: 0.9rem;
      margin: 0;
      flex-wrap: wrap;

      .loc-icon {
        color: var(--kangoo-primary, #E31B23);
        flex-shrink: 0;
      }
    }

    .copy-btn {
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      padding: 0.15rem 0.5rem;
      font-size: 0.75rem;
      border-radius: var(--radius-sm, 0.35rem);
      color: #475569;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: #E2E8F0;
        color: #0F172A;
      }
    }

    .drawer-details {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      gap: 1rem;

      @media (max-width: 900px) {
        align-items: flex-start;
      }
    }

    .drawer-schedule {
      font-size: 0.8rem;
      color: #475569;

      .schedule-label {
        font-weight: 700;
        display: block;
        margin-bottom: 0.2rem;
        color: #1E293B;
      }

      .schedule-items {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;

        .sch-item {
          background: #F8FAFC;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          border: 1px solid #E2E8F0;
        }
      }
    }

    .drawer-actions {
      display: flex;
      gap: 0.65rem;
      flex-wrap: wrap;
    }

    .btn-directions {
      background: var(--kangoo-primary, #E31B23);
      color: #FFFFFF;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.25rem;
      border-radius: var(--radius-full, 9999px);
      box-shadow: 0 4px 14px rgba(227, 27, 35, 0.35);
      transition: all 0.2s ease;

      &:hover {
        background: #C41219;
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(227, 27, 35, 0.45);
      }
    }

    .btn-streetview {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #0A2540;
      color: #FFFFFF;
      font-weight: 700;
      padding: 0.65rem 1.2rem;
      border-radius: var(--radius-full, 9999px);
      box-shadow: 0 4px 14px rgba(10, 37, 64, 0.25);
      transition: all 0.2s ease;
      text-decoration: none;

      &:hover {
        background: #001A33;
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(10, 37, 64, 0.35);
      }
    }

    .drawer-street-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: #F1F5F9;
      color: #0F172A;
      font-size: 0.82rem;
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      border: 1px solid #CBD5E1;
      margin-top: 0.35rem;

      strong {
        color: var(--kangoo-primary, #E31B23);
      }
    }

    .btn-call {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      border: 1.5px solid #CBD5E1;
      color: #1E293B;
      font-weight: 700;
      padding: 0.6rem 1rem;
      border-radius: var(--radius-full, 9999px);
      background: #FFFFFF;

      &:hover {
        background: #F8FAFC;
        border-color: #1E293B;
      }
    }

    .btn-whatsapp {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: #25D366;
      color: #FFFFFF;
      font-weight: 700;
      padding: 0.6rem 1rem;
      border-radius: var(--radius-full, 9999px);
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);

      &:hover {
        background: #1DA851;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealMapComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);

  // Inputs & Outputs
  readonly centers = input.required<CollectionCenter[]>();
  readonly activeCenter = input<CollectionCenter | null>(null);
  readonly centerSelected = output<CollectionCenter>();

  // Template ViewChild for Leaflet map element
  readonly mapContainerRef = viewChild<ElementRef<HTMLDivElement>>('mapContainer');

  // Internal state
  readonly viewMode = signal<MapViewMode>('interactive');
  readonly tileStyle = signal<MapTileStyle>('streets');
  readonly isViewingAll = signal<boolean>(true);
  readonly copied = signal<boolean>(false);

  // Leaflet map and tile layers references
  private L: any = null;
  private map: any = null;
  private markersMap = new Map<string, any>();
  private activeTileLayer: any = null;

  // Google Maps safe embed URL
  readonly googleMapsEmbedUrl = computed<SafeResourceUrl | null>(() => {
    const active = this.activeCenter() || (this.centers().length > 0 ? this.centers()[0] : null);
    if (!active) return null;
    const query = encodeURIComponent(`${active.name}, ${active.full_address}`);
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${query}&t=&z=16&ie=UTF8&iwloc=&output=embed`
    );
  });

  constructor() {
    afterNextRender(async () => {
      if (isPlatformBrowser(this.platformId)) {
        await this.initLeaflet();
      }
    });

    // React to external activeCenter changes (e.g. from the list cards above)
    effect(() => {
      const active = this.activeCenter();
      if (active && this.map && this.L) {
        this.highlightMarker(active);
      }
    });

    // React to centers list changes (e.g. state filter applied)
    effect(() => {
      const currentCenters = this.centers();
      if (this.map && this.L && currentCenters.length > 0) {
        this.renderMarkers(currentCenters);
      }
    });
  }

  private async initLeaflet(): Promise<void> {
    const container = this.mapContainerRef()?.nativeElement;
    if (!container || this.map) return;

    try {
      this.L = await import('leaflet');

      // Initialize map instance centered on USA with smooth animations
      this.map = this.L.map(container, {
        center: [37.0902, -95.7129],
        zoom: 4,
        minZoom: 3,
        maxZoom: 18,
        scrollWheelZoom: false, // Prevents unintended scrolling while browsing page
        zoomControl: true
      });

      // Position zoom control nicely
      this.map.zoomControl.setPosition('bottomright');

      // Add default tile layer
      this.applyTileLayer(this.tileStyle());

      // Render markers for centers
      const currentCenters = this.centers();
      if (currentCenters.length > 0) {
        this.renderMarkers(currentCenters);
      }

      // If there is an active center, highlight it, otherwise fit all
      const active = this.activeCenter();
      if (active) {
        this.highlightMarker(active);
      } else {
        this.fitAllMarkers();
      }

      // Ensure proper sizing after DOM render
      setTimeout(() => {
        this.map?.invalidateSize();
      }, 250);
    } catch (err) {
      console.error('Error initializing Leaflet map:', err);
    }
  }

  private applyTileLayer(style: MapTileStyle): void {
    if (!this.map || !this.L) return;

    if (this.activeTileLayer) {
      this.map.removeLayer(this.activeTileLayer);
    }

    let tileUrl = '';
    let attribution = '';
    let maxZoom = 19;
    let subdomains: string | string[] = 'abc';

    switch (style) {
      case 'satellite':
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping';
        maxZoom = 19;
        break;
      case 'topo':
        tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        attribution = 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap';
        subdomains = 'abc';
        maxZoom = 17;
        break;
      case 'streets':
      default:
        // High-definition OpenStreetMap layer with Esri World Street Map automatic fallback
        // 100% secure HTTPS, crystal-clear street names and avenues
        tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
        attribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';
        subdomains = 'abc';
        maxZoom = 19;
        break;
    }

    const layerOptions: any = {
      attribution,
      maxZoom,
      crossOrigin: true
    };
    if (subdomains && subdomains !== 'abc') {
      layerOptions.subdomains = subdomains;
    }

    const layer = this.L.tileLayer(tileUrl, layerOptions);

    // Fallback security: if OpenStreetMap tile encounters network issue, fallback to Esri World Street Map
    if (style === 'streets') {
      const fallbackUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
      layer.on('tileerror', (errorEvent: any) => {
        if (errorEvent && errorEvent.tile && !errorEvent.tile.dataset?.fallbackAttempted) {
          errorEvent.tile.dataset.fallbackAttempted = 'true';
          const coords = errorEvent.coords;
          if (coords) {
            errorEvent.tile.src = fallbackUrl
              .replace('{z}', coords.z)
              .replace('{y}', coords.y)
              .replace('{x}', coords.x);
          }
        }
      });
    }

    this.activeTileLayer = layer.addTo(this.map);
  }

  setTileStyle(style: MapTileStyle): void {
    this.tileStyle.set(style);
    this.applyTileLayer(style);
  }

  setViewMode(mode: MapViewMode): void {
    this.viewMode.set(mode);
    if (mode === 'interactive') {
      setTimeout(() => {
        this.map?.invalidateSize();
      }, 150);
    }
  }

  private createMarkerIcon(center: CollectionCenter, isActive: boolean): any {
    if (!this.L) return null;

    const activeClass = isActive ? 'marker-is-active' : '';

    const html = `
      <div class="kangoo-leaflet-pin ${activeClass}">
        <div class="pin-pulse-halo"></div>
        <div class="pin-head">
          <span class="pin-kangaroo">🦘</span>
        </div>
        <div class="pin-tip"></div>
        <div class="pin-label-tag">${center.city}</div>
      </div>
    `;

    return this.L.divIcon({
      className: 'kangoo-div-icon-wrapper',
      html,
      iconSize: [44, 52],
      iconAnchor: [22, 50],
      popupAnchor: [0, -48]
    });
  }

  private renderMarkers(centers: CollectionCenter[]): void {
    if (!this.map || !this.L) return;

    // Clear existing markers
    this.markersMap.forEach(marker => marker.remove());
    this.markersMap.clear();

    const active = this.activeCenter();

    centers.forEach(center => {
      const isSelected = active?.id === center.id;
      const icon = this.createMarkerIcon(center, isSelected);

      const marker = this.L.marker([center.lat, center.lng], {
        icon,
        title: center.name
      }).addTo(this.map);

      // Popup content with clear street name and Street View button
      const street = this.getStreetName(center.full_address);
      const popupHtml = `
        <div class="kangoo-popup-box">
          <div class="popup-top">
            <span class="popup-city">${center.city}, ${center.state}</span>
            <span class="popup-status">Abierto</span>
          </div>
          <h4 class="popup-name">${center.name}</h4>
          <div class="popup-street-row" style="margin-bottom: 0.35rem; font-size: 0.85rem; color: #E31B23;">
            <span>🛣️</span>
            <strong>${street}</strong>
          </div>
          <p class="popup-addr">${center.full_address}</p>
          <div class="popup-meta">
            <span>📞 ${center.phone}</span>
          </div>
          <div class="popup-btn-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
            <a href="${center.directions_url}" target="_blank" rel="noopener noreferrer" class="popup-directions-btn">
              Cómo llegar (Google Maps) &rarr;
            </a>
            <a href="${this.getStreetViewUrl(center)}" target="_blank" rel="noopener noreferrer" class="popup-streetview-btn" style="display: block; text-align: center; background: #0A2540; color: #FFFFFF; font-weight: 700; font-size: 0.78rem; padding: 0.4rem 0.85rem; border-radius: 9999px; text-decoration: none;">
              Ver Calle 360° (Street View) &rarr;
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        className: 'kangoo-leaflet-popup'
      });

      marker.on('click', () => {
        this.selectCenter(center);
      });

      this.markersMap.set(center.id, marker);
    });
  }

  private highlightMarker(center: CollectionCenter): void {
    if (!this.map || !this.L) return;

    this.isViewingAll.set(false);

    // Update icons for all markers (active vs non-active)
    this.centers().forEach(c => {
      const m = this.markersMap.get(c.id);
      if (m) {
        const isSelected = c.id === center.id;
        m.setIcon(this.createMarkerIcon(c, isSelected));
        if (isSelected) {
          m.setZIndexOffset(1000);
        } else {
          m.setZIndexOffset(0);
        }
      }
    });

    // Fly to center with smooth animation directly to Street Level (zoom 16)
    this.map.flyTo([center.lat, center.lng], 16, {
      duration: 1.2,
      easeLinearity: 0.25
    });

    const activeMarker = this.markersMap.get(center.id);
    if (activeMarker) {
      setTimeout(() => {
        activeMarker.openPopup();
      }, 700);
    }
  }

  selectCenter(center: CollectionCenter): void {
    this.centerSelected.emit(center);
    this.highlightMarker(center);
  }

  fitAllMarkers(): void {
    if (!this.map || !this.L) return;

    this.isViewingAll.set(true);

    const centers = this.centers();
    if (centers.length === 0) return;

    // Reset marker icons to default unselected state
    centers.forEach(c => {
      const m = this.markersMap.get(c.id);
      if (m) {
        m.setIcon(this.createMarkerIcon(c, false));
        m.setZIndexOffset(0);
        m.closePopup();
      }
    });

    // Calculate bounds containing all centers
    const latLngs = centers.map(c => [c.lat, c.lng]);
    const bounds = this.L.latLngBounds(latLngs);

    this.map.flyToBounds(bounds, {
      padding: [50, 50],
      duration: 1.2,
      maxZoom: 12
    });
  }

  copyAddress(address: string): void {
    if (isPlatformBrowser(this.platformId) && navigator.clipboard) {
      navigator.clipboard.writeText(address).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }

  getStreetName(address: string): string {
    if (!address) return '';
    return address.split(',')[0]?.trim() || address;
  }

  getStreetViewUrl(center: CollectionCenter): string {
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${center.lat},${center.lng}`;
  }

  cleanPhone(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
