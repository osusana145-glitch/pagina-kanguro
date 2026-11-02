import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { I18nService } from '../../core/services/i18n.service';
import { CollectionCenter } from '../../core/models/api.models';
import { RealMapComponent } from './components/real-map.component';

@Component({
  selector: 'app-collection-centers',
  standalone: true,
  imports: [FormsModule, RealMapComponent],
  template: `
    <section class="centers-page-section" aria-labelledby="centersHeading">
      <div class="container">
        <!-- Section Header -->
        <div class="centers-header">
          <span class="badge badge-neutral">Red Oficial en EE. UU.</span>
          <h1 id="centersHeading" class="page-title">Centros de Acopio Autorizados</h1>
          <p class="page-subtitle">
            Lleva tus cajas empacadas o compra cajas oficiales Kangoo en cualquiera de nuestras sucursales y agencias asociadas.
          </p>

          <!-- Filter & Search Controls -->
          <div class="filters-bar">
            <div class="search-input-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                class="form-input filter-input"
                placeholder="Filtrar por ciudad, estado o código postal (ej. Houston, TX, Chicago)..."
                [ngModel]="filterQuery()"
                (ngModelChange)="filterQuery.set($event)"
              />
            </div>

            <!-- State Quick Badges -->
            <div class="state-chips" role="group" aria-label="Filtrar por estado">
              <button
                type="button"
                class="chip-btn"
                [class.active]="selectedStateFilter() === 'ALL'"
                (click)="selectedStateFilter.set('ALL')"
              >
                Todos ({{ centers().length }})
              </button>
              @for (st of availableStates(); track st) {
                <button
                  type="button"
                  class="chip-btn"
                  [class.active]="selectedStateFilter() === st"
                  (click)="selectedStateFilter.set(st)"
                >
                  {{ st }}
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Dynamic Centers Grid (Adapts seamlessly to any count) -->
        <div class="centers-grid">
          @for (center of filteredCenters(); track center.id) {
            <article class="center-card" [class.highlight]="center.id === activeCenter()?.id" (click)="onCenterSelected(center)">
              <div class="card-head">
                <div>
                  <span class="city-pill">{{ center.city }}, {{ center.state }}</span>
                  <h2 class="center-name">{{ center.name }}</h2>
                </div>
                <div class="pin-icon" aria-hidden="true">📍</div>
              </div>

              <p class="center-address">
                <span class="street-tag-pill">🛣️ Calle: <strong>{{ getStreetName(center.full_address) }}</strong></span><br/>
                <span class="full-addr-sub">{{ center.full_address }}</span>
              </p>

              <!-- Phone and WhatsApp buttons -->
              <div class="contact-links">
                <a [href]="'tel:' + center.phone" class="phone-link" (click)="$event.stopPropagation()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>{{ center.phone }}</span>
                </a>
              </div>

              <!-- Weekly Schedule -->
              <div class="schedule-box">
                <span class="schedule-title">Horarios de Recepción:</span>
                <ul class="schedule-list">
                  @for (sch of center.schedule; track sch.days) {
                    <li>
                      <span class="days">{{ sch.days }}:</span>
                      <span class="hours">{{ sch.hours }}</span>
                    </li>
                  }
                </ul>
              </div>

              <!-- Available Services Tags -->
              <div class="services-list">
                @for (srv of center.services; track srv) {
                  <span class="srv-tag">{{ srv }}</span>
                }
              </div>

              <!-- Action Buttons: Real Map View, Google Maps & Street View -->
              <div class="card-action-buttons">
                <button
                  type="button"
                  class="btn btn-primary btn-sm btn-locate"
                  (click)="viewOnMap(center, $event)"
                  title="Ver sucursal en el mapa interactivo a nivel de calle"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                  <span>Ver en Mapa</span>
                </button>

                <a
                  [href]="center.directions_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-outline btn-sm btn-maps"
                  (click)="$event.stopPropagation()"
                >
                  <span>Cómo Llegar</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>

                <a
                  [href]="'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + center.lat + ',' + center.lng"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-outline btn-sm btn-streetview-card"
                  (click)="$event.stopPropagation()"
                  title="Ver fachada y calle en Google Street View 360°"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  <span>Ver Calle 360°</span>
                </a>
              </div>
            </article>
          } @empty {
            <div class="empty-state">
              <p>No se encontraron centros de acopio que coincidan con tu búsqueda.</p>
              <button type="button" class="btn btn-secondary btn-sm" (click)="resetFilters()">
                Ver todos los centros
              </button>
            </div>
          }
        </div>

        <!-- ================================================================== -->
        <!-- DEFERRED REAL INTERACTIVE MAP (@defer on viewport)                 -->
        <!-- ================================================================== -->
        <div class="map-section-wrapper" id="mapSection">
          <div class="map-header-intro">
            <span class="badge badge-primary">Geolocalización Oficial</span>
            <h2 class="map-heading">Ubicación Visual en el Mapa Real</h2>
            <p class="map-sub">Explora nuestra red de sucursales con mapas satelitales, calles de alta resolución y navegación GPS en tiempo real.</p>
          </div>

          @defer (on viewport) {
            <app-real-map
              [centers]="filteredCenters().length > 0 ? filteredCenters() : centers()"
              [activeCenter]="activeCenter()"
              (centerSelected)="onCenterSelected($event)"
            />
          } @placeholder {
            <div class="map-placeholder">
              <div class="map-skeleton">
                <div class="skeleton-spinner"></div>
                <span class="skeleton-text">Cargando mapa interactivo en vivo...</span>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .centers-page-section {
      padding: 3.5rem 1.25rem 5rem;
      background: var(--kangoo-surface-bg);
      min-height: calc(100vh - 120px);
    }

    .centers-header {
      text-align: center;
      max-width: 800px;
      margin: 0 auto 3rem;
    }

    .page-title {
      font-size: 2.35rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      margin-top: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .page-subtitle {
      font-size: 1.05rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.5;
      margin-bottom: 2rem;
    }

    .filters-bar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    .search-input-box {
      position: relative;
      width: 100%;
      max-width: 580px;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: calc(50% - 9px);
      color: var(--kangoo-neutral-muted);
    }

    .filter-input {
      padding-left: 2.75rem;
      min-height: 48px;
      border-radius: var(--radius-xl);
      border: 1.5px solid var(--kangoo-border);
      box-shadow: var(--shadow-sm);
    }

    .state-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }

    .chip-btn {
      background: #FFFFFF;
      border: 1px solid var(--kangoo-border);
      border-radius: var(--radius-full);
      padding: 0.4rem 1rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--kangoo-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--kangoo-secondary);
      }

      &.active {
        background: var(--kangoo-secondary);
        color: #FFFFFF;
        border-color: var(--kangoo-secondary);
      }
    }

    // Dynamic Centers Grid (Adapts to 2, 3, 5, etc.)
    .centers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.75rem;
      margin-bottom: 4rem;
    }

    .center-card {
      background: #FFFFFF;
      border: 1.5px solid var(--kangoo-border);
      border-radius: var(--radius-2xl);
      padding: 1.75rem;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all var(--transition-normal);
      cursor: pointer;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-card-hover);
        border-color: var(--kangoo-secondary);
      }

      &.highlight {
        border-color: var(--kangoo-primary);
        box-shadow: 0 0 0 2px var(--kangoo-primary-light), var(--shadow-md);
      }
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .city-pill {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      background: var(--kangoo-primary-light);
      color: var(--kangoo-primary);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      margin-bottom: 0.35rem;
    }

    .center-name {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      line-height: 1.25;
    }

    .pin-icon {
      font-size: 1.5rem;
    }

    .center-address {
      font-size: 0.88rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.45;
      margin-bottom: 1rem;
    }

    .contact-links {
      margin-bottom: 1rem;
    }

    .phone-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--kangoo-secondary);

      &:hover {
        color: var(--kangoo-primary);
      }
    }

    .schedule-box {
      background: var(--kangoo-surface-bg);
      border-radius: var(--radius-lg);
      padding: 0.85rem;
      margin-bottom: 1.25rem;
    }

    .schedule-title {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--kangoo-neutral-muted);
      text-transform: uppercase;
      display: block;
      margin-bottom: 0.35rem;
    }

    .schedule-list {
      list-style: none;
      font-size: 0.8rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;

      li {
        display: flex;
        justify-content: space-between;
      }

      .days {
        color: var(--kangoo-secondary);
        font-weight: 600;
      }

      .hours {
        color: var(--kangoo-neutral-text);
      }
    }

    .services-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-bottom: 1.5rem;
    }

    .srv-tag {
      font-size: 0.7rem;
      font-weight: 600;
      background: #F1F5F9;
      color: var(--kangoo-secondary);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
    }

    .card-action-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 1.25rem;
    }

    .btn-locate {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--kangoo-secondary);
      color: #FFFFFF;
      font-weight: 700;
      padding: 0.55rem 0.95rem;
      border-radius: var(--radius-full);
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: var(--kangoo-primary);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(227, 27, 35, 0.35);
      }
    }

    .btn-maps {
      flex: 1;
      min-width: 130px;
      justify-content: center;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.55rem 0.85rem;
      font-size: 0.82rem;
    }

    .btn-streetview-card {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      border-color: #0A2540;
      color: #0A2540;
      padding: 0.55rem 0.85rem;
      font-size: 0.82rem;

      &:hover {
        background: #0A2540;
        color: #FFFFFF;
      }
    }

    .street-tag-pill {
      display: inline-block;
      font-size: 0.88rem;
      color: var(--kangoo-secondary);
      margin-bottom: 0.2rem;

      strong {
        color: var(--kangoo-primary);
      }
    }

    .full-addr-sub {
      display: block;
      font-size: 0.8rem;
      color: var(--kangoo-neutral-muted);
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 1rem;
      background: #FFFFFF;
      border-radius: var(--radius-xl);
      color: var(--kangoo-neutral-muted);

      p {
        margin-bottom: 1rem;
      }
    }

    // Deferred Real Map Section
    .map-section-wrapper {
      margin-top: 3.5rem;
    }

    .map-header-intro {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 1.5rem;
    }

    .map-heading {
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      margin: 0.4rem 0 0.35rem;
      letter-spacing: -0.02em;
    }

    .map-sub {
      font-size: 0.95rem;
      color: var(--kangoo-neutral-muted);
      margin: 0;
    }

    .map-placeholder {
      height: 480px;
      border-radius: var(--radius-2xl);
      background: #F8FAFC;
      border: 1.5px dashed var(--kangoo-border);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1.5rem;
    }

    .map-skeleton {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .skeleton-spinner {
      width: 36px;
      height: 36px;
      border: 3px solid #E2E8F0;
      border-top-color: var(--kangoo-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .skeleton-text {
      font-size: 0.9rem;
      color: var(--kangoo-neutral-muted);
      font-weight: 600;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionCentersComponent {
  private readonly api = inject(ApiService);
  readonly i18n = inject(I18nService);

  readonly centers = signal<CollectionCenter[]>([]);
  readonly activeCenter = signal<CollectionCenter | null>(null);

  readonly filterQuery = signal<string>('');
  readonly selectedStateFilter = signal<string>('ALL');

  constructor() {
    this.api.getCollectionCenters().subscribe({
      next: list => {
        this.centers.set(list);
        if (list.length > 0) {
          this.activeCenter.set(list[0]);
        }
      }
    });
  }

  readonly availableStates = computed(() => {
    const set = new Set<string>();
    this.centers().forEach(c => set.add(c.state));
    return Array.from(set).sort();
  });

  readonly filteredCenters = computed(() => {
    const query = this.filterQuery().trim().toLowerCase();
    const stateFilter = this.selectedStateFilter();

    return this.centers().filter(c => {
      const matchState = stateFilter === 'ALL' || c.state === stateFilter;
      const matchQuery =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query) ||
        c.full_address.toLowerCase().includes(query);

      return matchState && matchQuery;
    });
  });

  resetFilters(): void {
    this.filterQuery.set('');
    this.selectedStateFilter.set('ALL');
  }

  onCenterSelected(center: CollectionCenter): void {
    this.activeCenter.set(center);
  }

  viewOnMap(center: CollectionCenter, event?: Event): void {
    event?.stopPropagation();
    this.activeCenter.set(center);
    if (typeof document !== 'undefined') {
      const mapElem = document.getElementById('mapSection') || document.getElementById('realMapSection');
      if (mapElem) {
        mapElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  getStreetName(address: string): string {
    if (!address) return '';
    return address.split(',')[0]?.trim() || address;
  }
}

