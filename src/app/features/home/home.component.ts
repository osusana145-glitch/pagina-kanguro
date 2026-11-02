import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  computed,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { I18nService } from '../../core/services/i18n.service';
import { QuoteStorageService } from '../../core/services/quote-storage.service';
import { MEXICAN_STATES_LIST, STATE_DEFAULT_CPS } from '../../core/services/mexican-postal-codes';
import {
  BoxOption,
  CatalogResponse,
  InsurancePlan,
  ExtraItem,
  PostalCodeLookup,
  QuoteRequest,
  QuoteResponse,
  CustomerReview
} from '../../core/models/api.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <!-- ====================================================================== -->
    <!-- HERO SECTION WITH INSTANT QUOTER ABOVE THE FOLD                       -->
    <!-- ====================================================================== -->
    <section class="hero-section" aria-labelledby="heroHeading">
      <div class="container hero-layout">
        <!-- Left: Hero Headline & Social Proof -->
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">🦘</span>
            <span>{{ i18n.t('hero.badge') }}</span>
          </div>

          <h1 id="heroHeading" class="hero-title">
            Envíos Rápidos, Seguros y <span class="highlight-red">Sin Trámites</span> a Todo México
          </h1>

          <p class="hero-description">
            {{ i18n.t('hero.subtitle') }}
          </p>

          <!-- Social Proof Badges -->
          <div class="social-proof-bar">
            <div class="social-stat">
              <div class="stars-row" aria-label="Calificación 4.9 estrellas">
                <span class="star">★</span>
                <span class="star">★</span>
                <span class="star">★</span>
                <span class="star">★</span>
                <span class="star">★</span>
              </div>
              <span class="stat-text"><strong>4.9 / 5</strong> (3,500+ reseñas)</span>
            </div>
            <div class="stat-divider"></div>
            <div class="social-stat">
              <span class="stat-number">45,800+</span>
              <span class="stat-label">Cajas entregadas con éxito</span>
            </div>
          </div>

          <!-- Quick Trust Bullets -->
          <div class="trust-bullets">
            <div class="bullet-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Despacho aduanal y pedimento 100% legal</span>
            </div>
            <div class="bullet-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>El destinatario en México no paga ningún arancel extra</span>
            </div>
            <a routerLink="/rastrear" class="bullet-item bullet-link" title="Ir al Rastreo Satelital en Vivo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Rastreo satelital y notificaciones automáticas ➔</span>
            </a>
          </div>
        </div>

        <!-- Right: Above-The-Fold Real-Time Quoter Card -->
        <div class="hero-quoter" id="cotizador">
          <div class="quoter-card">
            <div class="quoter-header">
              <div class="quoter-header-text">
                <h2 class="quoter-title">{{ i18n.t('quoter.title') }}</h2>
                <p class="quoter-subtitle">{{ i18n.t('quoter.subtitle') }}</p>
              </div>
              <span class="live-pill">En Vivo</span>
            </div>

            <!-- Step 1: Box Selection (Dynamic from API) -->
            <div class="quoter-step">
              <label class="step-label">
                <span class="step-num">1</span>
                <span>{{ i18n.t('quoter.step1') }}</span>
              </label>

              <div class="box-grid" role="radiogroup" aria-label="Tamaño de caja">
                @for (box of catalog()?.boxes; track box.id) {
                  <button
                    type="button"
                    class="box-card"
                    [class.selected]="selectedBoxId() === box.id"
                    (click)="selectBox(box.id)"
                    role="radio"
                    [attr.aria-checked]="selectedBoxId() === box.id"
                  >
                    @if (box.badge) {
                      <span class="box-badge">{{ box.badge }}</span>
                    }
                    <div class="box-visual">
                      <svg viewBox="0 0 48 48" class="box-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" fill="#F4F6F8" stroke="#0A2540" stroke-width="2"/>
                        <path d="M6 14L24 24L42 14" stroke="#0A2540" stroke-width="2"/>
                        <path d="M24 24V44" stroke="#0A2540" stroke-width="2"/>
                        <path d="M15 9L33 19" stroke="#E31B23" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </div>
                    <span class="box-title">{{ box.name }}</span>
                    <span class="box-dims">{{ box.dimensions.length_in }}" x {{ box.dimensions.width_in }}" x {{ box.dimensions.height_in }}"</span>
                    <span class="box-weight">Hasta {{ box.max_weight_lb }} lb</span>
                  </button>
                }
              </div>
            </div>

            <!-- Step 2: Destination Postal Code or State -->
            <div class="quoter-step">
              <label class="step-label">
                <span class="step-num">2</span>
                <span>{{ i18n.t('quoter.step2') }}</span>
              </label>

              <div class="dest-inputs">
                <div class="cp-input-group">
                  <label for="postalCodeInput" class="form-sublabel">Código Postal México (5 dígitos)</label>
                  <div class="input-with-icon">
                    <input
                      id="postalCodeInput"
                      type="text"
                      class="form-input"
                      placeholder="Ej. 72000"
                      maxlength="5"
                      [ngModel]="postalCode()"
                      (ngModelChange)="onPostalCodeChange($event)"
                    />
                    @if (isLookingUpCp()) {
                      <span class="input-spinner" aria-label="Buscando código postal"></span>
                    }
                  </div>
                </div>

                <div class="state-select-group">
                  <label for="stateSelect" class="form-sublabel">O selecciona el Estado</label>
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

              @if (postalCodeData(); as cpData) {
                <div class="cp-confirmation-banner">
                  <div class="cp-banner-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div class="cp-banner-content">
                    <span class="cp-location-text">
                      Ubicación detectada: <strong>{{ cpData.municipality }}, {{ cpData.state_name }}</strong>
                    </span>
                    <span class="cp-sub-text">
                      Entrega estimada: {{ cpData.delivery_estimate_days.min }} a {{ cpData.delivery_estimate_days.max }} días hábiles
                      @if (cpData.settlements && cpData.settlements.length > 0) {
                        • Zona: {{ cpData.settlements[0] }}
                      }
                    </span>
                  </div>
                </div>
              }
            </div>

            <!-- Step 3: Insurance Plan -->
            <div class="quoter-step">
              <label class="step-label">
                <span class="step-num">3</span>
                <span>{{ i18n.t('quoter.step3') }}</span>
              </label>

              <div class="insurance-options">
                @for (plan of catalog()?.insurance_plans; track plan.id) {
                  <label class="insurance-card" [class.selected]="selectedInsurancePlanId() === plan.id">
                    <input
                      type="radio"
                      name="insurancePlan"
                      [value]="plan.id"
                      [ngModel]="selectedInsurancePlanId()"
                      (ngModelChange)="selectInsurancePlan(plan.id)"
                      class="sr-only"
                    />
                    <div class="insurance-radio-circle"></div>
                    <div class="insurance-info">
                      <div class="plan-head">
                        <span class="plan-name">{{ plan.name }}</span>
                        @if (plan.recommended) {
                          <span class="plan-recommended-badge">Recomendado</span>
                        }
                      </div>
                      <span class="plan-coverage">Cobertura hasta {{ plan.coverage_formatted }}</span>
                    </div>
                  </label>
                }
              </div>
            </div>

            <!-- Step 4: Collapsible Extras -->
            <div class="quoter-step">
              <button
                type="button"
                class="extras-toggle-btn"
                (click)="isExtrasOpen.set(!isExtrasOpen())"
                [attr.aria-expanded]="isExtrasOpen()"
              >
                <div class="toggle-left">
                  <span class="step-num">4</span>
                  <span class="toggle-text">{{ i18n.t('quoter.step4') }}</span>
                </div>
                <svg
                  class="chevron-icon"
                  [class.open]="isExtrasOpen()"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              @if (isExtrasOpen()) {
                <div class="extras-panel">
                  @for (extra of catalog()?.extra_items; track extra.id) {
                    <div class="extra-item-row">
                      <div class="extra-info">
                        <span class="extra-title">{{ extra.name }}</span>
                        <span class="extra-desc">{{ extra.description }}</span>
                      </div>
                      <div class="extra-qty-picker">
                        <button
                          type="button"
                          class="qty-btn"
                          (click)="changeExtraQty(extra.id, -1)"
                          [disabled]="getExtraQty(extra.id) === 0"
                        >
                          -
                        </button>
                        <span class="qty-val">{{ getExtraQty(extra.id) }}</span>
                        <button
                          type="button"
                          class="qty-btn"
                          (click)="changeExtraQty(extra.id, 1)"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Real-Time Price Breakdown (Directly from API - Zero JS math) -->
            <div class="quote-breakdown-card">
              @if (isQuoteLoading()) {
                <div class="quote-loading-state">
                  <span class="input-spinner"></span>
                  <span>{{ i18n.t('quoter.calculating') }}</span>
                </div>
              } @else if (currentQuote(); as q) {
                <div class="breakdown-rows">
                  <div class="breakdown-row">
                    <span class="b-label">{{ i18n.t('quoter.baseShipping') }}</span>
                    <span class="b-val">{{ q.breakdown.base_shipping_formatted }}</span>
                  </div>
                  <div class="breakdown-row">
                    <span class="b-label">{{ i18n.t('quoter.customsTax') }}</span>
                    <span class="b-val">{{ q.breakdown.customs_tax_formatted }}</span>
                  </div>
                  <div class="breakdown-row">
                    <span class="b-label">{{ i18n.t('quoter.insurance') }}</span>
                    <span class="b-val">{{ q.breakdown.insurance_formatted }}</span>
                  </div>
                  @if (q.breakdown.extras_formatted !== '$0.00 USD') {
                    <div class="breakdown-row">
                      <span class="b-label">{{ i18n.t('quoter.extras') }}</span>
                      <span class="b-val">{{ q.breakdown.extras_formatted }}</span>
                    </div>
                  }
                </div>

                <div class="breakdown-divider"></div>

                <div class="breakdown-total">
                  <div>
                    <span class="total-label">{{ i18n.t('quoter.total') }}</span>
                    <span class="total-hint">{{ i18n.t('quoter.guarantee') }}</span>
                  </div>
                  <!-- STRICT RULE: Display only API formatted field -->
                  <div class="total-amount-box">
                    <span class="total-price">{{ q.total_formatted }}</span>
                    <span class="total-currency">USD</span>
                  </div>
                </div>

                <button
                  type="button"
                  class="btn btn-primary btn-lg continue-btn"
                  (click)="proceedToCheckout()"
                >
                  <span>{{ i18n.t('quoter.continueBtn') }}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================== -->
    <!-- VALUE PROPOSITIONS & HOW IT WORKS                                      -->
    <!-- ====================================================================== -->
    <section class="how-section container">
      <div class="section-header">
        <span class="section-tag">Logística Fácil</span>
        <h2 class="section-title">¿Cómo Enviar con Kangoo Xpress?</h2>
        <p class="section-subtitle">Tu envío en 4 pasos sencillos sin complicaciones de aduana.</p>
      </div>

      <div class="steps-grid">
        <div class="step-card">
          <div class="step-badge-num">1</div>
          <h3 class="step-title">Cotiza y Lleva tu Caja</h3>
          <p class="step-desc">Elige el tamaño que necesitas o recoge tus cajas oficiales en nuestros centros de acopio autorizados.</p>
        </div>

        <div class="step-card">
          <div class="step-badge-num">2</div>
          <h3 class="step-title">Empaca sin Preocupación</h3>
          <p class="step-desc">Llena tu caja con ropa, herramientas o regalos familiares. Nosotros te asesoramos con el inventario.</p>
        </div>

        <div class="step-card">
          <div class="step-badge-num">3</div>
          <h3 class="step-title">Despacho Aduanal</h3>
          <p class="step-desc">Cruce formal y seguro por la frontera con Laredo. Todo el trámite aduanal corre por nuestra cuenta.</p>
        </div>

        <div class="step-card">
          <div class="step-badge-num">4</div>
          <h3 class="step-title">Entrega en Puerta</h3>
          <p class="step-desc">Camiones de reparto entregan directo al domicilio en México, sin cobros sorpresa al recibir.</p>
        </div>
      </div>
    </section>

    <!-- ====================================================================== -->
    <!-- CUSTOMER REVIEWS / SOCIAL PROOF                                        -->
    <!-- ====================================================================== -->
    <section class="reviews-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Testimonios Reales</span>
          <h2 class="section-title">Familias Que Confían en Kangoo Xpress</h2>
          <p class="section-subtitle">Conectando a nuestros paisanos en EE. UU. con sus seres queridos en México.</p>
        </div>

        <div class="reviews-grid">
          @for (review of catalog()?.reviews; track review.id) {
            <div class="review-card">
              <div class="review-stars">
                @for (star of [1,2,3,4,5]; track star) {
                  <span class="star-filled">★</span>
                }
              </div>
              <p class="review-comment">"{{ review.comment }}"</p>
              <div class="review-author-row">
                <div class="author-avatar">{{ review.author.charAt(0) }}</div>
                <div>
                  <h4 class="author-name">{{ review.author }}</h4>
                  <span class="author-route">{{ review.city_origin }} ➔ {{ review.city_dest }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(180deg, #FFFFFF 0%, var(--kangoo-surface-bg) 100%);
      padding: 3rem 0 4rem;
      border-bottom: 1px solid var(--kangoo-border);
    }

    .hero-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      align-items: flex-start;

      @media (min-width: 1024px) {
        grid-template-columns: 1fr 1.15fr;
      }
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--kangoo-primary-light);
      color: var(--kangoo-primary);
      font-size: 0.85rem;
      font-weight: 700;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      margin-bottom: 1.25rem;
      border: 1px solid rgba(227, 27, 35, 0.2);
    }

    .hero-title {
      font-size: 2.35rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      line-height: 1.15;
      margin-bottom: 1.25rem;

      @media (min-width: 768px) {
        font-size: 3rem;
      }

      .highlight-red {
        color: var(--kangoo-primary);
      }
    }

    .hero-description {
      font-size: 1.1rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .social-proof-bar {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      background: #FFFFFF;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-xl);
      border: 1px solid var(--kangoo-border);
      box-shadow: var(--shadow-sm);
      margin-bottom: 2rem;
    }

    .stars-row {
      display: flex;
      color: #F59E0B;
      font-size: 1.1rem;
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .stat-text {
      font-size: 0.85rem;
      color: var(--kangoo-secondary);
    }

    .stat-divider {
      width: 1px;
      height: 36px;
      background: var(--kangoo-border);
    }

    .stat-number {
      display: block;
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--kangoo-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.78rem;
      color: var(--kangoo-neutral-muted);
    }

    .trust-bullets {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .bullet-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--kangoo-secondary);
      text-decoration: none;

      &.bullet-link {
        cursor: pointer;
        transition: transform var(--transition-fast), color var(--transition-fast);

        &:hover {
          color: var(--kangoo-primary);
          transform: translateX(4px);
        }
      }
    }

    // Quoter Card Styles
    .hero-quoter {
      width: 100%;
    }

    .quoter-card {
      background: #FFFFFF;
      border-radius: var(--radius-2xl);
      border: 2px solid rgba(10, 37, 64, 0.08);
      box-shadow: var(--shadow-lg);
      padding: 1.75rem;

      @media (min-width: 640px) {
        padding: 2.25rem;
      }
    }

    .quoter-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--kangoo-border);
      padding-bottom: 1rem;
    }

    .quoter-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
    }

    .quoter-subtitle {
      font-size: 0.85rem;
      color: var(--kangoo-neutral-muted);
      margin-top: 0.2rem;
    }

    .live-pill {
      background: var(--kangoo-success-light);
      color: var(--kangoo-success-dark);
      font-size: 0.72rem;
      font-weight: 800;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      text-transform: uppercase;
    }

    .quoter-step {
      margin-bottom: 1.5rem;
    }

    .step-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      margin-bottom: 0.85rem;
    }

    .step-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--kangoo-secondary);
      color: #FFFFFF;
      font-size: 0.75rem;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .box-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;

      @media (min-width: 640px) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .box-card {
      position: relative;
      background: var(--kangoo-surface-bg);
      border: 1.5px solid var(--kangoo-border);
      border-radius: var(--radius-lg);
      padding: 0.85rem 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      cursor: pointer;
      transition: all var(--transition-fast);
      min-height: 140px;

      &:hover {
        border-color: var(--kangoo-secondary);
        background: #FFFFFF;
        transform: translateY(-2px);
      }

      &.selected {
        border-color: var(--kangoo-primary);
        background: var(--kangoo-primary-light);
        box-shadow: 0 0 0 2px var(--kangoo-primary);
      }
    }

    .box-badge {
      position: absolute;
      top: -8px;
      background: var(--kangoo-primary);
      color: #FFFFFF;
      font-size: 0.62rem;
      font-weight: 800;
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-full);
      text-transform: uppercase;
    }

    .box-visual {
      width: 40px;
      height: 40px;
      margin-bottom: 0.5rem;
    }

    .box-svg {
      width: 100%;
      height: 100%;
    }

    .box-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      line-height: 1.2;
    }

    .box-dims {
      font-size: 0.72rem;
      color: var(--kangoo-neutral-muted);
      margin-top: 0.2rem;
    }

    .box-weight {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--kangoo-primary);
      margin-top: 0.2rem;
    }

    .dest-inputs {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.85rem;

      @media (min-width: 640px) {
        grid-template-columns: 1.2fr 1.5fr;
      }
    }

    .form-sublabel {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--kangoo-neutral-text);
      display: block;
      margin-bottom: 0.35rem;
    }

    .input-with-icon {
      position: relative;
    }

    .input-spinner {
      position: absolute;
      right: 12px;
      top: calc(50% - 8px);
      width: 16px;
      height: 16px;
      border: 2px solid var(--kangoo-border);
      border-top-color: var(--kangoo-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .cp-confirmation-banner {
      margin-top: 0.75rem;
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      background: var(--kangoo-success-light);
      color: var(--kangoo-success-dark);
      padding: 0.65rem 0.95rem;
      border-radius: var(--radius-md);
      border-left: 4px solid var(--kangoo-success);
      font-size: 0.82rem;

      .cp-banner-icon {
        margin-top: 2px;
        flex-shrink: 0;
      }

      .cp-banner-content {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }

      .cp-location-text {
        font-weight: 600;
      }

      .cp-sub-text {
        font-size: 0.78rem;
        opacity: 0.9;
      }
    }

    .insurance-options {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .insurance-card {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem 1rem;
      background: var(--kangoo-surface-bg);
      border: 1.5px solid var(--kangoo-border);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: #FFFFFF;
        border-color: var(--kangoo-secondary);
      }

      &.selected {
        border-color: var(--kangoo-primary);
        background: #FFFFFF;
        box-shadow: 0 0 0 2px var(--kangoo-primary-light);

        .insurance-radio-circle {
          border-color: var(--kangoo-primary);
          background: var(--kangoo-primary);
          box-shadow: inset 0 0 0 3px #FFFFFF;
        }
      }
    }

    .insurance-radio-circle {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid var(--kangoo-border);
      flex-shrink: 0;
      transition: all var(--transition-fast);
    }

    .insurance-info {
      flex: 1;
    }

    .plan-head {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .plan-name {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
    }

    .plan-recommended-badge {
      background: var(--kangoo-warning-light);
      color: var(--kangoo-warning-dark);
      font-size: 0.65rem;
      font-weight: 800;
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-sm);
      text-transform: uppercase;
    }

    .plan-coverage {
      font-size: 0.78rem;
      color: var(--kangoo-neutral-muted);
    }

    .extras-toggle-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--kangoo-surface-bg);
      border: 1.5px solid var(--kangoo-border);
      border-radius: var(--radius-lg);
      padding: 0.75rem 1rem;
      cursor: pointer;
      font-family: inherit;

      &:hover {
        background: #FFFFFF;
      }
    }

    .toggle-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .toggle-text {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
    }

    .chevron-icon {
      transition: transform var(--transition-fast);
      color: var(--kangoo-secondary);

      &.open {
        transform: rotate(180deg);
      }
    }

    .extras-panel {
      margin-top: 0.75rem;
      background: var(--kangoo-surface-bg);
      border: 1px solid var(--kangoo-border);
      border-radius: var(--radius-lg);
      padding: 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .extra-item-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px dashed var(--kangoo-border);

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
    }

    .extra-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      display: block;
    }

    .extra-desc {
      font-size: 0.75rem;
      color: var(--kangoo-neutral-muted);
    }

    .extra-qty-picker {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .qty-btn {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      border: 1.5px solid var(--kangoo-border);
      background: #FFFFFF;
      font-size: 1rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      cursor: pointer;

      &:hover:not(:disabled) {
        border-color: var(--kangoo-primary);
        color: var(--kangoo-primary);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    .qty-val {
      font-size: 0.9rem;
      font-weight: 800;
      width: 20px;
      text-align: center;
    }

    // Breakdown
    .quote-breakdown-card {
      background: var(--kangoo-secondary);
      color: #FFFFFF;
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      margin-top: 1.5rem;
      box-shadow: var(--shadow-md);
    }

    .quote-loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1.5rem 0;
      color: #E2E8F0;
      font-size: 0.9rem;
    }

    .breakdown-rows {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .breakdown-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #CBD5E1;
    }

    .b-val {
      font-weight: 600;
      color: #FFFFFF;
    }

    .breakdown-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.15);
      margin: 1rem 0;
    }

    .breakdown-total {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .total-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94A3B8;
    }

    .total-hint {
      display: block;
      font-size: 0.75rem;
      color: #A7F3D0;
    }

    .total-amount-box {
      display: flex;
      align-items: baseline;
      gap: 0.35rem;
    }

    .total-price {
      font-size: 2rem;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    .total-currency {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--kangoo-primary);
    }

    .continue-btn {
      width: 100%;
    }

    // Section 2: How It Works
    .how-section {
      padding: 5rem 1.25rem;
    }

    .section-header {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 3rem;
    }

    .section-tag {
      font-size: 0.82rem;
      font-weight: 800;
      color: var(--kangoo-primary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: block;
      margin-bottom: 0.5rem;
    }

    .section-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      line-height: 1.2;
      margin-bottom: 0.75rem;
    }

    .section-subtitle {
      font-size: 1.05rem;
      color: var(--kangoo-neutral-text);
    }

    .steps-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .step-card {
      background: #FFFFFF;
      border: 1px solid var(--kangoo-border);
      border-radius: var(--radius-xl);
      padding: 2rem 1.5rem;
      position: relative;
      transition: all var(--transition-normal);

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
        border-color: var(--kangoo-secondary);
      }
    }

    .step-badge-num {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--kangoo-primary-light);
      color: var(--kangoo-primary);
      font-size: 1.15rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }

    .step-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      margin-bottom: 0.5rem;
    }

    .step-desc {
      font-size: 0.88rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.5;
    }

    // Section 3: Reviews
    .reviews-section {
      background: #FFFFFF;
      padding: 5rem 0;
      border-top: 1px solid var(--kangoo-border);
    }

    .reviews-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .review-card {
      background: var(--kangoo-surface-bg);
      border: 1px solid var(--kangoo-border);
      border-radius: var(--radius-xl);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .review-stars {
      display: flex;
      color: #F59E0B;
      font-size: 1.15rem;
      margin-bottom: 1rem;
    }

    .review-comment {
      font-size: 0.95rem;
      font-style: italic;
      color: var(--kangoo-secondary);
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    .review-author-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .author-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--kangoo-secondary);
      color: #FFFFFF;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .author-name {
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      line-height: 1.2;
    }

    .author-route {
      font-size: 0.78rem;
      color: var(--kangoo-neutral-muted);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly api = inject(ApiService);
  readonly i18n = inject(I18nService);
  private readonly quoteStorage = inject(QuoteStorageService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  // Catalog Signal
  readonly catalog = signal<CatalogResponse | null>(null);

  // Interactive Quoter States (Signals)
  readonly selectedBoxId = signal<string>('box-md');
  readonly postalCode = signal<string>('72000');
  readonly selectedState = signal<string>('Puebla');
  readonly selectedInsurancePlanId = signal<string>('ins-standard');
  readonly extraQuantities = signal<Record<string, number>>({});
  readonly isExtrasOpen = signal<boolean>(false);

  readonly isLookingUpCp = signal<boolean>(false);
  readonly postalCodeData = signal<PostalCodeLookup | null>(null);
  readonly mexicanStates = MEXICAN_STATES_LIST;

  readonly isQuoteLoading = signal<boolean>(false);
  readonly currentQuote = signal<QuoteResponse | null>(null);

  constructor() {
    // Initial fetch of catalog
    this.api.getCatalog().subscribe({
      next: cat => {
        this.catalog.set(cat);
        this.triggerRealtimeQuote();
      }
    });

    // Initial lookup for default CP 72000
    this.onPostalCodeChange(this.postalCode());

    // Reactive quote recalculation whenever selection signals change
    effect(() => {
      // Register signal dependencies
      const box = this.selectedBoxId();
      const state = this.selectedState();
      const cp = this.postalCode();
      const plan = this.selectedInsurancePlanId();
      const extras = this.extraQuantities();

      // Trigger server calculation
      this.triggerRealtimeQuote();
    });
  }

  selectBox(id: string): void {
    this.selectedBoxId.set(id);
  }

  selectInsurancePlan(id: string): void {
    this.selectedInsurancePlanId.set(id);
  }

  onPostalCodeChange(newCp: string): void {
    const clean = (newCp || '').replace(/[^0-9]/g, '').slice(0, 5);
    this.postalCode.set(clean);

    if (clean.length === 5) {
      this.isLookingUpCp.set(true);
      this.api.lookupPostalCode(clean).subscribe({
        next: lookup => {
          this.isLookingUpCp.set(false);
          this.postalCodeData.set(lookup);
          if (lookup.state_name) {
            this.selectedState.set(lookup.state_name);
          }
        },
        error: () => this.isLookingUpCp.set(false)
      });
    } else {
      this.postalCodeData.set(null);
    }
  }

  onStateChange(newState: string): void {
    this.selectedState.set(newState);
    const defaultCp = STATE_DEFAULT_CPS[newState];
    if (defaultCp && (!this.postalCodeData() || this.postalCodeData()?.state_name !== newState)) {
      this.onPostalCodeChange(defaultCp);
    }
  }

  changeExtraQty(extraId: string, delta: number): void {
    const current = { ...this.extraQuantities() };
    const oldVal = current[extraId] || 0;
    const newVal = Math.max(0, oldVal + delta);
    if (newVal === 0) {
      delete current[extraId];
    } else {
      current[extraId] = newVal;
    }
    this.extraQuantities.set(current);
  }

  getExtraQty(extraId: string): number {
    return this.extraQuantities()[extraId] || 0;
  }

  private triggerRealtimeQuote(): void {
    const extrasPayload = Object.entries(this.extraQuantities()).map(([extra_id, quantity]) => ({
      extra_id,
      quantity
    }));

    const quoteReq: QuoteRequest = {
      box_id: this.selectedBoxId(),
      destination_postal_code: this.postalCode(),
      destination_state: this.selectedState(),
      insurance_plan_id: this.selectedInsurancePlanId(),
      extras: extrasPayload
    };

    this.isQuoteLoading.set(true);
    this.api.calculateQuote(quoteReq).subscribe({
      next: quote => {
        this.currentQuote.set(quote);
        this.isQuoteLoading.set(false);
      },
      error: () => this.isQuoteLoading.set(false)
    });
  }

  proceedToCheckout(): void {
    const quote = this.currentQuote();
    if (!quote) return;

    const boxes = this.catalog()?.boxes || [];
    const chosenBox = boxes.find(b => b.id === this.selectedBoxId());
    const boxName = chosenBox ? chosenBox.name : 'Caja Kangoo';

    const extrasPayload = Object.entries(this.extraQuantities()).map(([extra_id, quantity]) => ({
      extra_id,
      quantity
    }));

    const quoteReq: QuoteRequest = {
      box_id: this.selectedBoxId(),
      destination_postal_code: this.postalCode(),
      destination_state: this.selectedState(),
      insurance_plan_id: this.selectedInsurancePlanId(),
      extras: extrasPayload
    };

    // Store in sessionStorage with persist: true for guests
    this.quoteStorage.saveQuote(quote, quoteReq, boxName);

    // Navigate to /enviar
    this.router.navigate(['/enviar']);
  }
}
