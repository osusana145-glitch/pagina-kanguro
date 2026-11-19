import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  computed,
  PLATFORM_ID
} from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { I18nService } from '../../core/services/i18n.service';
import { QuoteStorageService } from '../../core/services/quote-storage.service';
import { MEXICAN_STATES_LIST, STATE_DEFAULT_CPS } from '../../core/services/mexican-postal-codes';
import {
  CatalogResponse,
  PostalCodeLookup,
  QuoteRequest,
  QuoteResponse,
  SiteContentResponse
} from '../../core/models/api.models';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { HomeInfoSectionsComponent } from './sections/home-info-sections.component';
import { HomeAppSectionComponent } from './sections/home-app-section.component';
import { HomeReviewsSectionComponent } from './sections/home-reviews-section.component';

/**
 * Home: the hero + quoter is the only thing rendered eagerly (LCP target).
 * Everything below the fold is split into @defer (on viewport) blocks so its
 * JS/CSS ships in separate lazy chunks.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DecimalPipe,
    IconComponent,
    HomeInfoSectionsComponent,
    HomeAppSectionComponent,
    HomeReviewsSectionComponent
  ],
  template: `
    <section class="hero" aria-labelledby="heroHeading">
      <div class="container hero-layout">
        <div class="hero-content">
          <p class="hero-badge">
            <kx-icon name="truck" [size]="16" />
            <span>{{ i18n.t('hero.badge') }}</span>
          </p>

          <h1 id="heroHeading" class="hero-title">{{ i18n.t('hero.title') }}</h1>
          <p class="hero-description">{{ i18n.t('hero.subtitle') }}</p>

          <!-- Social proof: rendered only when the API returns verified figures -->
          @if (stats(); as st) {
            @if (st.delivered_boxes || st.rating) {
              <div class="proof-bar">
                @if (st.rating) {
                  <div class="proof-item">
                    <kx-icon name="star" [size]="18" />
                    <span class="tabular-nums"><strong>{{ st.rating | number: '1.1-1' }} / 5</strong>
                      @if (st.reviews_count) { ({{ st.reviews_count | number }} {{ i18n.t('hero.statsReviews') }}) }
                    </span>
                  </div>
                }
                @if (st.delivered_boxes) {
                  <div class="proof-item">
                    <kx-icon name="package" [size]="18" />
                    <span class="tabular-nums"><strong>{{ st.delivered_boxes | number }}</strong> {{ i18n.t('hero.statsDelivered') }}</span>
                  </div>
                }
              </div>
            }
          }

          <ul class="trust-list">
            <li>
              <kx-icon name="check" [size]="18" />
              <span>{{ i18n.t('hero.bulletCustoms') }}</span>
            </li>
            <li>
              <kx-icon name="check" [size]="18" />
              <span>{{ i18n.t('hero.bulletDoor') }}</span>
            </li>
            <li>
              <kx-icon name="check" [size]="18" />
              <a routerLink="/rastrear" class="trust-link">{{ i18n.t('hero.bulletLive') }}</a>
            </li>
          </ul>

          <a href="#app" class="app-teaser">
            <kx-icon name="smartphone" [size]="18" />
            <span>{{ i18n.t('hero.appLink') }}</span>
            <kx-icon name="arrow-right" [size]="16" />
          </a>
        </div>

        <!-- Quoter (catalog resolved in SSR and reused via HTTP transfer cache) -->
        <div class="quoter" id="cotizador">
          <div class="quoter-head">
            <div>
              <h2 class="quoter-title">{{ i18n.t('quoter.title') }}</h2>
              <p class="quoter-sub">{{ i18n.t('quoter.subtitle') }}</p>
            </div>
            <span class="live-pill"><span class="live-dot" aria-hidden="true"></span>{{ i18n.t('quoter.live') }}</span>
          </div>

          <fieldset class="q-step">
            <legend class="q-label"><span class="q-num">1</span>{{ i18n.t('quoter.step1') }}</legend>
            <div class="box-grid" role="radiogroup" [attr.aria-label]="i18n.t('quoter.boxGroup')">
              @for (box of catalog()?.boxes; track box.id) {
                <button
                  type="button"
                  class="box-opt"
                  [class.selected]="selectedBoxId() === box.id"
                  (click)="selectBox(box.id)"
                  role="radio"
                  [attr.aria-checked]="selectedBoxId() === box.id"
                >
                  @if (box.badge) { <span class="box-badge">{{ box.badge }}</span> }
                  <kx-icon name="package" [size]="26" [stroke]="1.5" />
                  <span class="box-name">{{ box.name }}</span>
                  <span class="box-meta tabular-nums">{{ box.dimensions.length_in }}" × {{ box.dimensions.width_in }}" × {{ box.dimensions.height_in }}"</span>
                  <span class="box-meta tabular-nums">{{ i18n.t('quoter.upTo') }} {{ box.max_weight_lb }} lb</span>
                </button>
              } @empty {
                <div class="box-skeleton" aria-hidden="true"></div>
              }
            </div>
          </fieldset>

          <fieldset class="q-step">
            <legend class="q-label"><span class="q-num">2</span>{{ i18n.t('quoter.step2') }}</legend>
            <div class="dest-grid">
              <div class="field">
                <label for="postalCodeInput" class="field-label">{{ i18n.t('quoter.postalCode') }}</label>
                <div class="input-wrap">
                  <input
                    id="postalCodeInput"
                    type="text"
                    inputmode="numeric"
                    autocomplete="postal-code"
                    class="form-input tabular-nums"
                    [placeholder]="i18n.t('quoter.cpPlaceholder')"
                    maxlength="5"
                    [ngModel]="postalCode()"
                    (ngModelChange)="onPostalCodeChange($event)"
                  />
                  @if (isLookingUpCp()) {
                    <span class="spinner" role="status" [attr.aria-label]="i18n.t('quoter.lookingUp')"></span>
                  }
                </div>
              </div>
              <div class="field">
                <label for="stateSelect" class="field-label">{{ i18n.t('quoter.stateLabel') }}</label>
                <select
                  id="stateSelect"
                  class="form-select"
                  [ngModel]="selectedState()"
                  (ngModelChange)="onStateChange($event)"
                >
                  @for (st of mexicanStates; track st) {
                    <option [value]="st">{{ st }}</option>
                  }
                </select>
              </div>
            </div>

            @if (postalCodeData(); as cp) {
              <div class="cp-banner" role="status">
                <kx-icon name="map-pin" [size]="18" />
                <div>
                  <span>{{ i18n.t('quoter.detected') }} <strong>{{ cp.municipality }}, {{ cp.state_name }}</strong></span>
                  <span class="cp-sub">
                    {{ i18n.t('quoter.eta') }} {{ cp.delivery_estimate_days.min }}–{{ cp.delivery_estimate_days.max }} {{ i18n.t('quoter.businessDays') }}
                    @if (cp.settlements.length) { · {{ i18n.t('quoter.zone') }}: {{ cp.settlements[0] }} }
                  </span>
                </div>
              </div>
            }
          </fieldset>

          <fieldset class="q-step">
            <legend class="q-label"><span class="q-num">3</span>{{ i18n.t('quoter.step3') }}</legend>
            <div class="ins-list">
              @for (plan of catalog()?.insurance_plans; track plan.id) {
                <label class="ins-opt" [class.selected]="selectedInsurancePlanId() === plan.id">
                  <input
                    type="radio"
                    name="insurancePlan"
                    class="ins-radio"
                    [value]="plan.id"
                    [checked]="selectedInsurancePlanId() === plan.id"
                    (change)="selectedInsurancePlanId.set(plan.id)"
                  />
                  <span class="ins-text">
                    <span class="ins-name">
                      {{ plan.name }}
                      @if (plan.recommended) { <span class="tag">{{ i18n.t('quoter.recommended') }}</span> }
                    </span>
                    <span class="ins-cov tabular-nums">{{ i18n.t('quoter.coverageUpTo') }} {{ plan.coverage_formatted }}</span>
                  </span>
                </label>
              }
            </div>
          </fieldset>

          @if (catalog()?.extra_items?.length) {
            <div class="q-step">
              <button
                type="button"
                class="extras-toggle"
                (click)="isExtrasOpen.set(!isExtrasOpen())"
                [attr.aria-expanded]="isExtrasOpen()"
                aria-controls="extrasPanel"
              >
                <span class="q-label"><span class="q-num">4</span>{{ i18n.t('quoter.step4') }}</span>
                <kx-icon name="chevron-down" [size]="18" [class.rot]="isExtrasOpen()" />
              </button>

              @if (isExtrasOpen()) {
                <div class="extras" id="extrasPanel">
                  @for (extra of catalog()?.extra_items; track extra.id) {
                    <div class="extra-row">
                      <div class="extra-info">
                        <span class="extra-name">{{ extra.name }}</span>
                        <span class="extra-desc">{{ extra.description }}</span>
                      </div>
                      <div class="qty">
                        <button type="button" class="qty-btn" (click)="changeExtraQty(extra.id, -1)"
                          [disabled]="getExtraQty(extra.id) === 0" [attr.aria-label]="i18n.t('quoter.decrease')">
                          <kx-icon name="minus" [size]="16" />
                        </button>
                        <span class="qty-val tabular-nums" aria-live="polite">{{ getExtraQty(extra.id) }}</span>
                        <button type="button" class="qty-btn" (click)="changeExtraQty(extra.id, 1)"
                          [attr.aria-label]="i18n.t('quoter.increase')">
                          <kx-icon name="plus" [size]="16" />
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <div class="summary" aria-live="polite">
            @if (currentQuote(); as q) {
              <dl class="rows tabular-nums" [class.stale]="isQuoteLoading()">
                <div class="row"><dt>{{ i18n.t('quoter.baseShipping') }}</dt><dd>{{ q.breakdown.base_shipping_formatted }}</dd></div>
                <div class="row"><dt>{{ i18n.t('quoter.customsTax') }}</dt><dd>{{ q.breakdown.customs_tax_formatted }}</dd></div>
                <div class="row"><dt>{{ i18n.t('quoter.insurance') }}</dt><dd>{{ q.breakdown.insurance_formatted }}</dd></div>
                @if (hasExtras()) {
                  <div class="row"><dt>{{ i18n.t('quoter.extras') }}</dt><dd>{{ q.breakdown.extras_formatted }}</dd></div>
                }
              </dl>
              <div class="total">
                <div>
                  <span class="total-label">{{ i18n.t('quoter.total') }}</span>
                  <span class="total-hint">{{ i18n.t('quoter.guarantee') }}</span>
                </div>
                <span class="total-price tabular-nums">{{ q.total_formatted }}</span>
              </div>
              <button type="button" class="btn btn-primary btn-lg continue" (click)="proceedToCheckout()" [disabled]="isQuoteLoading()">
                <span>{{ i18n.t('quoter.continueBtn') }}</span>
                <kx-icon name="arrow-right" [size]="18" />
              </button>
            } @else {
              <p class="calc"><span class="spinner" aria-hidden="true"></span>{{ i18n.t('quoter.calculating') }}</p>
            }
          </div>
        </div>
      </div>
    </section>

    @defer (on viewport) {
      <kx-home-info-sections [catalog]="catalog()" (boxSelected)="selectBox($event); scrollToQuoter()" />
    } @placeholder {
      <div class="defer-ph" style="min-height: 1600px"></div>
    }

    @defer (on viewport) {
      <kx-home-app-section [links]="siteContent()?.mobile_app" />
    } @placeholder {
      <div class="defer-ph" id="app" style="min-height: 560px"></div>
    }

    @defer (on viewport) {
      <kx-home-reviews-section [reviews]="siteContent()?.reviews ?? []" />
    } @placeholder {
      <div class="defer-ph" style="min-height: 480px"></div>
    }
  `,
  styles: [`
    .hero {
      background: #fff;
      border-bottom: 1px solid var(--kx-border);
      padding: clamp(2rem, 4vw, 3.5rem) 0;
    }
    .hero-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: clamp(2rem, 4vw, 4rem);
      align-items: start;
      @media (min-width: 1024px) { grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); }
      @media (min-width: 1440px) { grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr); }
    }
    .hero-content { @media (min-width: 1024px) { position: sticky; top: 140px; } }
    .hero-badge {
      display: inline-flex; align-items: center; gap: .5rem;
      background: var(--kx-blue-soft-1); color: var(--kx-blue-600);
      border: 1px solid var(--kx-blue-soft-2); border-radius: var(--kx-radius-sm);
      font-size: .875rem; font-weight: 600; padding: .375rem .75rem; margin-bottom: 1.25rem;
    }
    .hero-title { font-size: clamp(2rem, 1.2rem + 3vw, 3.5rem); margin-bottom: 1.25rem; max-width: 18ch; }
    .hero-description { font-size: 1.125rem; color: var(--kx-text-secondary); margin-bottom: 1.75rem; max-width: 60ch; }

    .proof-bar {
      display: flex; flex-wrap: wrap; gap: .75rem 1.5rem;
      border: 1px solid var(--kx-border); border-radius: var(--kx-radius);
      padding: .875rem 1rem; margin-bottom: 1.75rem; color: var(--kx-text-primary);
    }
    .proof-item { display: flex; align-items: center; gap: .5rem; kx-icon { color: var(--kx-blue-600); } }

    .trust-list { list-style: none; display: grid; gap: .75rem; margin-bottom: 1.75rem; }
    .trust-list li { display: flex; align-items: center; gap: .625rem; font-weight: 500; color: var(--kx-text-primary); }
    .trust-list kx-icon { color: var(--kx-status-delivered); }
    .trust-link { color: var(--kx-blue-600); text-decoration: underline; text-underline-offset: 3px; }

    .app-teaser {
      display: inline-flex; align-items: center; gap: .5rem; min-height: 44px;
      padding: .5rem .875rem; border: 1px solid var(--kx-border); border-radius: var(--kx-radius);
      color: var(--kx-blue-600); font-weight: 600; font-size: .9375rem;
      &:hover { border-color: var(--kx-blue-600); background: var(--kx-blue-soft-1); }
    }

    .quoter {
      background: #fff; border: 1px solid var(--kx-border); border-radius: var(--kx-radius);
      padding: clamp(1.25rem, 2.5vw, 2rem);
    }
    .quoter-head { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
    .quoter-title { font-size: 1.5rem; margin-bottom: .25rem; }
    .quoter-sub { font-size: .9375rem; }
    .live-pill {
      display: inline-flex; align-items: center; gap: .375rem; align-self: flex-start; white-space: nowrap;
      font-size: .8125rem; font-weight: 600; color: var(--kx-status-delivered);
      border: 1px solid var(--kx-border); border-radius: var(--kx-radius-sm); padding: .25rem .625rem;
    }
    .live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--kx-status-delivered); }

    .q-step { border: 0; padding: 0; margin: 0 0 1.5rem; min-width: 0; }
    .q-label { display: flex; align-items: center; gap: .625rem; font-weight: 600; color: var(--kx-blue-900); margin-bottom: .75rem; padding: 0; }
    .q-num {
      display: inline-grid; place-items: center; width: 26px; height: 26px; flex-shrink: 0;
      border-radius: var(--kx-radius-sm); background: var(--kx-blue-600); color: #fff; font-size: .8125rem;
    }

    .box-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr)); gap: .75rem; }
    .box-opt {
      position: relative; display: flex; flex-direction: column; align-items: center; gap: .25rem; text-align: center;
      min-height: 44px; padding: 1.25rem .75rem .875rem; background: #fff; cursor: pointer;
      border: 1px solid var(--kx-border); border-radius: var(--kx-radius); color: var(--kx-blue-900);
      &:hover { border-color: var(--kx-blue-600); }
      &.selected { border-color: var(--kx-blue-600); background: var(--kx-blue-soft-1); box-shadow: inset 0 0 0 1px var(--kx-blue-600); }
      &:focus-visible { outline: 2px solid var(--kx-blue-600); outline-offset: 2px; }
    }
    .box-badge {
      position: absolute; top: -.625rem; left: 50%; transform: translateX(-50%); white-space: nowrap;
      background: var(--kx-blue-900); color: #fff; font-size: .6875rem; font-weight: 600;
      padding: .125rem .5rem; border-radius: 4px;
    }
    .box-name { font-weight: 600; font-size: .9375rem; }
    .box-meta { font-size: .8125rem; color: var(--kx-text-secondary); }
    .box-skeleton { height: 140px; border-radius: var(--kx-radius); background: var(--kx-blue-soft-1); }

    .dest-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: .75rem; }
    .field-label { display: block; font-size: .875rem; font-weight: 500; color: var(--kx-text-secondary); margin-bottom: .375rem; }
    .input-wrap { position: relative; .spinner { position: absolute; right: .875rem; top: 50%; margin-top: -8px; } }
    .cp-banner {
      display: flex; gap: .625rem; margin-top: .75rem; padding: .75rem .875rem;
      border: 1px solid var(--kx-border); border-left: 3px solid var(--kx-status-delivered);
      border-radius: var(--kx-radius-sm); font-size: .9375rem; color: var(--kx-text-primary);
      kx-icon { color: var(--kx-status-delivered); margin-top: 2px; }
    }
    .cp-sub { display: block; font-size: .875rem; color: var(--kx-text-secondary); }

    .ins-list { display: grid; gap: .5rem; }
    .ins-opt {
      display: flex; align-items: center; gap: .75rem; min-height: 44px; padding: .75rem .875rem; cursor: pointer;
      border: 1px solid var(--kx-border); border-radius: var(--kx-radius);
      &:hover { border-color: var(--kx-blue-600); }
      &.selected { border-color: var(--kx-blue-600); background: var(--kx-blue-soft-1); }
    }
    .ins-radio { width: 18px; height: 18px; accent-color: var(--kx-blue-600); flex-shrink: 0; }
    .ins-text { display: flex; flex-direction: column; min-width: 0; }
    .ins-name { font-weight: 600; color: var(--kx-blue-900); display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
    .ins-cov { font-size: .875rem; color: var(--kx-text-secondary); }
    .tag {
      font-size: .6875rem; font-weight: 600; color: var(--kx-blue-600);
      border: 1px solid var(--kx-blue-soft-3); border-radius: 4px; padding: 0 .375rem;
    }

    .extras-toggle {
      width: 100%; min-height: 44px; display: flex; align-items: center; justify-content: space-between;
      background: none; border: 1px solid var(--kx-border); border-radius: var(--kx-radius);
      padding: .5rem .875rem; cursor: pointer; color: var(--kx-blue-900);
      .q-label { margin: 0; }
      &:hover { border-color: var(--kx-blue-600); }
    }
    .rot { transform: rotate(180deg); }
    .extras { border: 1px solid var(--kx-border); border-top: 0; border-radius: 0 0 var(--kx-radius) var(--kx-radius); }
    .extra-row {
      display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .875rem;
      & + & { border-top: 1px solid var(--kx-border); }
    }
    .extra-info { display: flex; flex-direction: column; min-width: 0; }
    .extra-name { font-weight: 600; font-size: .9375rem; color: var(--kx-text-primary); }
    .extra-desc { font-size: .875rem; color: var(--kx-text-secondary); }
    .qty { display: flex; align-items: center; gap: .25rem; }
    .qty-btn {
      display: grid; place-items: center; width: 44px; height: 44px; cursor: pointer;
      background: #fff; border: 1px solid var(--kx-border); border-radius: var(--kx-radius-sm); color: var(--kx-blue-900);
      &:disabled { opacity: .45; cursor: not-allowed; }
      &:not(:disabled):hover { border-color: var(--kx-blue-600); }
    }
    .qty-val { min-width: 2ch; text-align: center; font-weight: 600; }

    .summary { border-top: 1px solid var(--kx-border); padding-top: 1.25rem; min-height: 220px; }
    .rows { display: grid; gap: .5rem; margin-bottom: 1rem; transition: opacity var(--transition-fast); &.stale { opacity: .55; } }
    .row { display: flex; justify-content: space-between; gap: 1rem; font-size: .9375rem; dt { color: var(--kx-text-secondary); } dd { color: var(--kx-text-primary); font-weight: 500; } }
    .total {
      display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem;
      padding: 1rem 0; border-top: 1px solid var(--kx-border); margin-bottom: 1rem;
    }
    .total-label { display: block; font-weight: 700; color: var(--kx-blue-900); }
    .total-hint { display: block; font-size: .8125rem; color: var(--kx-text-secondary); }
    .total-price { font-size: 2rem; font-weight: 700; color: var(--kx-blue-900); letter-spacing: -.02em; white-space: nowrap; }
    .continue { width: 100%; }
    .calc { display: flex; align-items: center; gap: .625rem; }

    .spinner {
      display: inline-block; width: 16px; height: 16px; border-radius: 50%;
      border: 2px solid var(--kx-blue-soft-2); border-top-color: var(--kx-blue-600);
      animation: spin .8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly api = inject(ApiService);
  readonly i18n = inject(I18nService);
  private readonly quoteStorage = inject(QuoteStorageService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly catalog = signal<CatalogResponse | null>(null);
  readonly siteContent = signal<SiteContentResponse | null>(null);
  readonly stats = computed(() => this.siteContent()?.stats ?? null);

  // Quoter state — defaults are taken from the catalog once it loads (no assumed IDs).
  readonly selectedBoxId = signal<string>('');
  readonly postalCode = signal<string>('72000');
  readonly selectedState = signal<string>('Puebla');
  readonly selectedInsurancePlanId = signal<string>('');
  readonly extraQuantities = signal<Record<string, number>>({});
  readonly isExtrasOpen = signal<boolean>(false);
  readonly hasExtras = computed(() => Object.keys(this.extraQuantities()).length > 0);

  readonly isLookingUpCp = signal<boolean>(false);
  readonly postalCodeData = signal<PostalCodeLookup | null>(null);
  readonly mexicanStates = MEXICAN_STATES_LIST;

  readonly isQuoteLoading = signal<boolean>(false);
  readonly currentQuote = signal<QuoteResponse | null>(null);

  constructor() {
    this.api.getCatalog().subscribe(cat => {
      this.catalog.set(cat);
      const box = cat.boxes.find(b => b.popular) ?? cat.boxes[0];
      const plan = cat.insurance_plans.find(p => p.recommended) ?? cat.insurance_plans[0];
      if (box) this.selectedBoxId.set(box.id);
      if (plan) this.selectedInsurancePlanId.set(plan.id);
    });

    this.api.getSiteContent().subscribe(content => this.siteContent.set(content));

    this.onPostalCodeChange(this.postalCode());

    // Recalculate on the server whenever any quoter input changes.
    effect(() => {
      const req = this.buildQuoteRequest();
      if (!req.box_id) return;
      this.isQuoteLoading.set(true);
      this.api.calculateQuote(req).subscribe({
        next: quote => {
          this.currentQuote.set(quote);
          this.isQuoteLoading.set(false);
        },
        error: () => this.isQuoteLoading.set(false)
      });
    });
  }

  selectBox(id: string): void {
    this.selectedBoxId.set(id);
  }

  onPostalCodeChange(newCp: string): void {
    const clean = (newCp || '').replace(/[^0-9]/g, '').slice(0, 5);
    this.postalCode.set(clean);

    if (clean.length !== 5) {
      this.postalCodeData.set(null);
      return;
    }
    this.isLookingUpCp.set(true);
    this.api.lookupPostalCode(clean).subscribe({
      next: lookup => {
        this.isLookingUpCp.set(false);
        this.postalCodeData.set(lookup);
        if (lookup.state_name) this.selectedState.set(lookup.state_name);
      },
      error: () => this.isLookingUpCp.set(false)
    });
  }

  onStateChange(newState: string): void {
    this.selectedState.set(newState);
    const defaultCp = STATE_DEFAULT_CPS[newState];
    if (defaultCp && this.postalCodeData()?.state_name !== newState) {
      this.onPostalCodeChange(defaultCp);
    }
  }

  changeExtraQty(extraId: string, delta: number): void {
    const current = { ...this.extraQuantities() };
    const next = Math.max(0, (current[extraId] || 0) + delta);
    if (next === 0) delete current[extraId];
    else current[extraId] = next;
    this.extraQuantities.set(current);
  }

  getExtraQty(extraId: string): number {
    return this.extraQuantities()[extraId] || 0;
  }

  private buildQuoteRequest(): QuoteRequest {
    return {
      box_id: this.selectedBoxId(),
      destination_postal_code: this.postalCode(),
      destination_state: this.selectedState(),
      insurance_plan_id: this.selectedInsurancePlanId(),
      extras: Object.entries(this.extraQuantities()).map(([extra_id, quantity]) => ({ extra_id, quantity }))
    };
  }

  proceedToCheckout(): void {
    const quote = this.currentQuote();
    if (!quote) return;
    const box = this.catalog()?.boxes.find(b => b.id === this.selectedBoxId());
    this.quoteStorage.saveQuote(quote, this.buildQuoteRequest(), box?.name ?? '');
    this.router.navigate(['/enviar']);
  }

  scrollToQuoter(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('cotizador')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
}
