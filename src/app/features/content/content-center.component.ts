import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  input,
  computed,
  effect
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { I18nService } from '../../core/services/i18n.service';
import { SiteContentResponse, FaqItem, AllowedItem, ProhibitedItem } from '../../core/models/api.models';

export type ContentTab = 'how-it-works' | 'faqs' | 'allowed' | 'times';

@Component({
  selector: 'app-content-center',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <section class="content-page-section" aria-labelledby="contentHeading">
      <div class="container container-narrow">
        <!-- Content Navigation Tabs -->
        <nav class="content-tabs-nav" role="tablist" aria-label="Secciones de información">
          <button
            type="button"
            role="tab"
            class="tab-btn"
            [class.active]="activeTab() === 'how-it-works'"
            (click)="activeTab.set('how-it-works')"
            [attr.aria-selected]="activeTab() === 'how-it-works'"
          >
            Cómo Funciona
          </button>
          <button
            type="button"
            role="tab"
            class="tab-btn"
            [class.active]="activeTab() === 'allowed'"
            (click)="activeTab.set('allowed')"
            [attr.aria-selected]="activeTab() === 'allowed'"
          >
            ¿Qué Puedo Enviar?
          </button>
          <button
            type="button"
            role="tab"
            class="tab-btn"
            [class.active]="activeTab() === 'times'"
            (click)="activeTab.set('times')"
            [attr.aria-selected]="activeTab() === 'times'"
          >
            Tiempos de Entrega
          </button>
          <button
            type="button"
            role="tab"
            class="tab-btn"
            [class.active]="activeTab() === 'faqs'"
            (click)="activeTab.set('faqs')"
            [attr.aria-selected]="activeTab() === 'faqs'"
          >
            Preguntas Frecuentes
          </button>
        </nav>

        <!-- ============================================================== -->
        <!-- TAB 1: CÓMO FUNCIONA                                           -->
        <!-- ============================================================== -->
        @if (activeTab() === 'how-it-works') {
          <article class="tab-pane" role="tabpanel">
            <header class="tab-header">
              <span class="tab-badge">Paso a Paso</span>
              <h1 id="contentHeading" class="tab-title">Cómo Funciona el Envío Binacional</h1>
              <p class="tab-desc">
                Con Kangoo Xpress tus pertenencias viajan seguras desde EE. UU. hasta la puerta de tu familia en México en 4 sencillos pasos.
              </p>
            </header>

            <div class="guide-timeline">
              @for (step of content()?.how_it_works; track step.step) {
                <div class="guide-step-card">
                  <div class="guide-number">{{ step.step }}</div>
                  <div class="guide-body">
                    <h2 class="guide-title">{{ step.title }}</h2>
                    <p class="guide-desc">{{ step.description }}</p>
                  </div>
                </div>
              }
            </div>

            <div class="cta-banner">
              <h3>¿Listo para enviar tu caja hoy?</h3>
              <p>Comienza calculando el costo exacto con nuestro cotizador instantáneo.</p>
              <a routerLink="/" class="btn btn-primary btn-lg">Cotizar Mi Caja Ahora</a>
            </div>
          </article>
        }

        <!-- ============================================================== -->
        <!-- TAB 2: QUÉ PUEDO ENVIAR (ARTÍCULOS PERMITIDOS Y PROHIBIDOS)    -->
        <!-- ============================================================== -->
        @if (activeTab() === 'allowed') {
          <article class="tab-pane" role="tabpanel">
            <header class="tab-header">
              <span class="tab-badge">Normativa Aduanal Oficial</span>
              <h1 class="tab-title">¿Qué Puedo Enviar a México?</h1>
              <p class="tab-desc">
                Consulta los artículos permitidos y las restricciones legales del Servicio de Administración Tributaria (SAT) y ANAM.
              </p>

              <!-- Search Bar for Items -->
              <div class="items-search-box">
                <input
                  type="text"
                  class="form-input"
                  placeholder="Buscar artículo (ej. ropa, calzado, licuadora, medicamento, herramientas)..."
                  [ngModel]="itemsSearch()"
                  (ngModelChange)="itemsSearch.set($event)"
                />
              </div>
            </header>

            <!-- Sub Navigation: Permitidos vs Prohibidos -->
            <div class="items-subnav">
              <button
                type="button"
                class="subnav-btn"
                [class.active]="itemCategoryFilter() === 'ALLOWED'"
                (click)="itemCategoryFilter.set('ALLOWED')"
              >
                ✅ Artículos Permitidos ({{ filteredAllowed().length }})
              </button>
              <button
                type="button"
                class="subnav-btn danger"
                [class.active]="itemCategoryFilter() === 'PROHIBITED'"
                (click)="itemCategoryFilter.set('PROHIBITED')"
              >
                🚫 Artículos Prohibidos ({{ filteredProhibited().length }})
              </button>
            </div>

            <!-- Allowed Items List -->
            @if (itemCategoryFilter() === 'ALLOWED') {
              <div class="items-grid">
                @for (item of filteredAllowed(); track item.id) {
                  <div class="item-card allowed-card">
                    <div class="item-head">
                      <span class="item-cat-badge">{{ item.category }}</span>
                      <span class="status-icon">✓</span>
                    </div>
                    <h3 class="item-name">{{ item.name }}</h3>
                    <p class="item-recom"><strong>Recomendación:</strong> {{ item.recommendations }}</p>
                  </div>
                }
              </div>
            }

            <!-- Prohibited Items List -->
            @if (itemCategoryFilter() === 'PROHIBITED') {
              <div class="items-grid">
                @for (item of filteredProhibited(); track item.id) {
                  <div class="item-card prohibited-card">
                    <div class="item-head">
                      <span class="item-hazard-badge">{{ item.hazard_type }}</span>
                      <span class="status-icon-danger">✕</span>
                    </div>
                    <h3 class="item-name">{{ item.name }}</h3>
                    <p class="item-warning"><strong>Advertencia:</strong> {{ item.legal_warning }}</p>
                  </div>
                }
              </div>
            }
          </article>
        }

        <!-- ============================================================== -->
        <!-- TAB 3: TIEMPOS DE ENTREGA                                      -->
        <!-- ============================================================== -->
        @if (activeTab() === 'times') {
          <article class="tab-pane" role="tabpanel">
            <header class="tab-header">
              <span class="tab-badge">Frecuencias y Logística</span>
              <h1 class="tab-title">Tiempos y Frecuencia de Entrega</h1>
              <p class="tab-desc">
                Nuestros camiones viajan semanalmente hacia la frontera con desaduanamiento continuo y distribución local directa.
              </p>
            </header>

            <div class="delivery-matrix">
              @for (entry of content()?.delivery_times; track entry.region) {
                <div class="matrix-card">
                  <div class="matrix-head">
                    <h2 class="region-title">{{ entry.region }}</h2>
                    <span class="days-badge">{{ entry.days_range }}</span>
                  </div>
                  <p class="freq-text">📅 {{ entry.shipping_frequency }}</p>
                  <div class="states-pills">
                    @for (st of entry.states; track st) {
                      <span class="state-pill">{{ st }}</span>
                    }
                  </div>
                </div>
              }
            </div>
          </article>
        }

        <!-- ============================================================== -->
        <!-- TAB 4: PREGUNTAS FRECUENTES (FAQPage ACCORDIONS)               -->
        <!-- ============================================================== -->
        @if (activeTab() === 'faqs') {
          <article class="tab-pane" role="tabpanel">
            <header class="tab-header">
              <span class="tab-badge">Centro de Ayuda</span>
              <h1 class="tab-title">Preguntas Frecuentes</h1>
              <p class="tab-desc">
                Resolvemos todas tus dudas sobre precios, trámites aduanales, coberturas y tiempos de entrega.
              </p>
            </header>

            <!-- FAQ Accordions -->
            <div class="faq-accordion-group" itemscope itemtype="https://schema.org/FAQPage">
              @for (faq of content()?.faqs; track faq.id) {
                <div
                  class="faq-item"
                  [class.open]="openFaqId() === faq.id"
                  itemscope
                  itemprop="mainEntity"
                  itemtype="https://schema.org/Question"
                >
                  <button
                    type="button"
                    class="faq-question-btn"
                    (click)="toggleFaq(faq.id)"
                    [attr.aria-expanded]="openFaqId() === faq.id"
                  >
                    <span itemprop="name">{{ faq.question }}</span>
                    <svg
                      class="faq-icon"
                      [class.rotated]="openFaqId() === faq.id"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  @if (openFaqId() === faq.id) {
                    <div
                      class="faq-answer-panel"
                      itemscope
                      itemprop="acceptedAnswer"
                      itemtype="https://schema.org/Answer"
                    >
                      <p itemprop="text">{{ faq.answer }}</p>
                    </div>
                  }
                </div>
              }
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .content-page-section {
      padding: 3.5rem 1.25rem 5rem;
      background: var(--kangoo-surface-bg);
      min-height: calc(100vh - 120px);
    }

    .content-tabs-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      background: #FFFFFF;
      padding: 0.4rem;
      border-radius: var(--radius-2xl);
      border: 1px solid var(--kangoo-border);
      box-shadow: var(--shadow-sm);
      margin-bottom: 2.5rem;
      justify-content: center;
    }

    .tab-btn {
      background: transparent;
      border: none;
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      padding: 0.65rem 1.25rem;
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-fast);
      min-height: 44px;

      &:hover {
        background: var(--kangoo-surface-bg);
      }

      &.active {
        background: var(--kangoo-secondary);
        color: #FFFFFF;
        box-shadow: var(--shadow-sm);
      }
    }

    .tab-pane {
      animation: fadeIn 0.25s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .tab-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .tab-badge {
      display: inline-block;
      font-size: 0.78rem;
      font-weight: 800;
      text-transform: uppercase;
      background: var(--kangoo-primary-light);
      color: var(--kangoo-primary);
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      margin-bottom: 0.5rem;
    }

    .tab-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      margin-bottom: 0.75rem;
      line-height: 1.2;
    }

    .tab-desc {
      font-size: 1.05rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.5;
      max-width: 680px;
      margin: 0 auto;
    }

    // Guide Step Cards
    .guide-timeline {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-bottom: 3rem;
    }

    .guide-step-card {
      display: flex;
      gap: 1.25rem;
      background: #FFFFFF;
      border-radius: var(--radius-2xl);
      padding: 1.75rem;
      border: 1px solid var(--kangoo-border);
      box-shadow: var(--shadow-sm);
      align-items: flex-start;
    }

    .guide-number {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      background: var(--kangoo-primary-light);
      color: var(--kangoo-primary);
      font-size: 1.4rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .guide-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      margin-bottom: 0.35rem;
    }

    .guide-desc {
      font-size: 0.95rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.5;
    }

    .cta-banner {
      background: var(--kangoo-secondary);
      color: #FFFFFF;
      border-radius: var(--radius-2xl);
      padding: 2.5rem 2rem;
      text-align: center;

      h3 {
        color: #FFFFFF;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      p {
        color: #CBD5E1;
        margin-bottom: 1.5rem;
      }
    }

    // Search and Items List
    .items-search-box {
      max-width: 540px;
      margin: 1.5rem auto 0;
    }

    .items-subnav {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .subnav-btn {
      background: #FFFFFF;
      border: 1.5px solid var(--kangoo-border);
      padding: 0.6rem 1.25rem;
      border-radius: var(--radius-xl);
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      cursor: pointer;
      min-height: 44px;

      &.active {
        background: #10B981;
        color: #FFFFFF;
        border-color: #10B981;
      }

      &.danger.active {
        background: var(--kangoo-danger);
        color: #FFFFFF;
        border-color: var(--kangoo-danger);
      }
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .item-card {
      background: #FFFFFF;
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      border: 1.5px solid var(--kangoo-border);
      box-shadow: var(--shadow-sm);

      &.allowed-card {
        border-left: 4px solid #10B981;
      }

      &.prohibited-card {
        border-left: 4px solid var(--kangoo-danger);
      }
    }

    .item-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .item-cat-badge {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      background: #D1FAE5;
      color: #065F46;
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-sm);
    }

    .item-hazard-badge {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      background: #FEE2E2;
      color: #991B1B;
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-sm);
    }

    .status-icon {
      color: #10B981;
      font-weight: 900;
    }

    .status-icon-danger {
      color: var(--kangoo-danger);
      font-weight: 900;
    }

    .item-name {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      margin-bottom: 0.5rem;
    }

    .item-recom {
      font-size: 0.85rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.4;
    }

    .item-warning {
      font-size: 0.85rem;
      color: #991B1B;
      line-height: 1.4;
    }

    // Delivery Matrix
    .delivery-matrix {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .matrix-card {
      background: #FFFFFF;
      border-radius: var(--radius-2xl);
      padding: 1.75rem;
      border: 1px solid var(--kangoo-border);
      box-shadow: var(--shadow-sm);
    }

    .matrix-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .region-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
    }

    .days-badge {
      background: var(--kangoo-primary-light);
      color: var(--kangoo-primary);
      font-size: 0.85rem;
      font-weight: 800;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
    }

    .freq-text {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--kangoo-neutral-muted);
      margin-bottom: 1rem;
    }

    .states-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .state-pill {
      font-size: 0.8rem;
      font-weight: 600;
      background: var(--kangoo-surface-bg);
      color: var(--kangoo-secondary);
      padding: 0.3rem 0.65rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--kangoo-border);
    }

    // FAQs Accordion
    .faq-accordion-group {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .faq-item {
      background: #FFFFFF;
      border-radius: var(--radius-xl);
      border: 1.5px solid var(--kangoo-border);
      overflow: hidden;
      transition: all var(--transition-fast);

      &.open {
        border-color: var(--kangoo-secondary);
        box-shadow: var(--shadow-sm);
      }
    }

    .faq-question-btn {
      width: 100%;
      min-height: 56px;
      padding: 1rem 1.5rem;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: left;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      cursor: pointer;
    }

    .faq-icon {
      color: var(--kangoo-primary);
      flex-shrink: 0;
      transition: transform var(--transition-fast);

      &.rotated {
        transform: rotate(180deg);
      }
    }

    .faq-answer-panel {
      padding: 0 1.5rem 1.5rem;
      font-size: 0.95rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.6;
      border-top: 1px dashed var(--kangoo-border);
      padding-top: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentCenterComponent {
  private readonly api = inject(ApiService);
  readonly i18n = inject(I18nService);

  // Tab input from route data or query param
  readonly initialTab = input<ContentTab>('how-it-works');

  readonly activeTab = signal<ContentTab>('how-it-works');
  readonly content = signal<SiteContentResponse | null>(null);

  // FAQ accordion state
  readonly openFaqId = signal<string | null>('faq-1');

  // Search in items
  readonly itemsSearch = signal<string>('');
  readonly itemCategoryFilter = signal<'ALLOWED' | 'PROHIBITED'>('ALLOWED');

  constructor() {
    effect(() => {
      const tab = this.initialTab();
      if (tab) {
        this.activeTab.set(tab);
      }
    });

    this.api.getSiteContent().subscribe({
      next: res => this.content.set(res)
    });
  }

  toggleFaq(faqId: string): void {
    this.openFaqId.update(curr => (curr === faqId ? null : faqId));
  }

  readonly filteredAllowed = computed(() => {
    const list = this.content()?.allowed_items || [];
    const query = this.itemsSearch().trim().toLowerCase();
    if (!query) return list;
    return list.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.recommendations.toLowerCase().includes(query)
    );
  });

  readonly filteredProhibited = computed(() => {
    const list = this.content()?.prohibited_items || [];
    const query = this.itemsSearch().trim().toLowerCase();
    if (!query) return list;
    return list.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.hazard_type.toLowerCase().includes(query) ||
      item.legal_warning.toLowerCase().includes(query)
    );
  });
}
