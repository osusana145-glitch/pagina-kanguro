import { IconComponent } from '../../shared/components/icon/icon.component';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  PLATFORM_ID
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { I18nService } from '../../core/services/i18n.service';
import { QuoteStorageService, PersistedQuote } from '../../core/services/quote-storage.service';
import { PostalCodeLookup, CollectionCenter } from '../../core/models/api.models';

export type CheckoutStep = 1 | 2 | 3 | 4 | 5; // 5 is confirmation success

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [IconComponent, RouterLink, FormsModule],
  template: `
    <section class="checkout-page-section" aria-labelledby="checkoutHeading">
      <div class="container container-narrow">
        <!-- Wizard Stepper Indicator -->
        @if (currentStep() < 5) {
          <div class="stepper-bar" role="progressbar" [attr.aria-valuenow]="currentStep()" aria-valuemin="1" aria-valuemax="4">
            <div class="step-indicator" [class.active]="currentStep() >= 1" [class.current]="currentStep() === 1">
              <span class="step-bubble">1</span>
              <span class="step-label">{{ i18n.t('checkout.stepRecipient') }}</span>
            </div>
            <div class="step-line" [class.filled]="currentStep() >= 2"></div>
            <div class="step-indicator" [class.active]="currentStep() >= 2" [class.current]="currentStep() === 2">
              <span class="step-bubble">2</span>
              <span class="step-label">{{ i18n.t('checkout.stepAddress') }}</span>
            </div>
            <div class="step-line" [class.filled]="currentStep() >= 3"></div>
            <div class="step-indicator" [class.active]="currentStep() >= 3" [class.current]="currentStep() === 3">
              <span class="step-bubble">3</span>
              <span class="step-label">{{ i18n.t('checkout.stepDropoff') }}</span>
            </div>
            <div class="step-line" [class.filled]="currentStep() >= 4"></div>
            <div class="step-indicator" [class.active]="currentStep() >= 4" [class.current]="currentStep() === 4">
              <span class="step-bubble">4</span>
              <span class="step-label">{{ i18n.t('checkout.stepPay') }}</span>
            </div>
          </div>
        }

        <div class="checkout-card">
          <!-- ============================================================== -->
          <!-- STEP 1: DESTINATARIO                                           -->
          <!-- ============================================================== -->
          @if (currentStep() === 1) {
            <div class="step-pane">
              <h1 id="checkoutHeading" class="step-title">{{ i18n.t('checkout.s1Title') }}</h1>
              <p class="step-subtitle">{{ i18n.t('checkout.s1Sub') }}</p>

              <form (ngSubmit)="goToStep(2)" class="checkout-form" #f1="ngForm">
                <div class="form-group">
                  <label for="recName" class="form-label">{{ i18n.t('checkout.recName') }}</label>
                  <input id="recName" type="text" class="form-input" name="recName" [(ngModel)]="recipientName" required [placeholder]="i18n.t('checkout.recNamePh')" autocomplete="name" />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="recPhone" class="form-label">{{ i18n.t('checkout.recPhone') }}</label>
                    <input id="recPhone" type="tel" class="form-input" name="recPhone" [(ngModel)]="recipientPhone" required placeholder="+52 (222) 000-0000" autocomplete="tel" />
                  </div>
                  <div class="form-group">
                    <label for="recEmail" class="form-label">{{ i18n.t('checkout.recEmail') }}</label>
                    <input id="recEmail" type="email" class="form-input" name="recEmail" [(ngModel)]="recipientEmail" [placeholder]="i18n.t('checkout.recEmailPh')" autocomplete="email" />
                  </div>
                </div>

                <div class="step-actions">
                  <a routerLink="/" class="btn btn-ghost">{{ i18n.t('checkout.cancel') }}</a>
                  <button type="submit" class="btn btn-primary btn-lg" [disabled]="!f1.valid">
                    <span>{{ i18n.t('checkout.toAddress') }}</span><kx-icon name="arrow-right" [size]="16" />
                  </button>
                </div>
              </form>
            </div>
          }

          <!-- ============================================================== -->
          <!-- STEP 2: DIRECCIÓN EN MÉXICO                                    -->
          <!-- ============================================================== -->
          @if (currentStep() === 2) {
            <div class="step-pane">
              <h2 class="step-title">{{ i18n.t('checkout.s2Title') }}</h2>
              <p class="step-subtitle">{{ i18n.t('checkout.s2Sub') }}</p>

              <form (ngSubmit)="goToStep(3)" class="checkout-form" #f2="ngForm">
                <div class="form-row">
                  <div class="form-group">
                    <label for="cpMx" class="form-label">
                      <span>{{ i18n.t('checkout.cp') }}</span>
                      @if (isLookingUpCp()) { <span class="hint">{{ i18n.t('checkout.cpChecking') }}</span> }
                    </label>
                    <input
                      id="cpMx"
                      type="text"
                      class="form-input"
                      name="cpMx"
                      maxlength="5"
                      [(ngModel)]="destinationCp"
                      (ngModelChange)="onCpLookup($event)"
                      required
                      inputmode="numeric"
                      [placeholder]="i18n.t('checkout.cpPh')"
                    />
                  </div>

                  <div class="form-group">
                    <label for="stateMx" class="form-label">{{ i18n.t('checkout.state') }}</label>
                    <input id="stateMx" type="text" class="form-input" name="stateMx" [(ngModel)]="destinationState" required [placeholder]="i18n.t('checkout.statePh')" />
                  </div>
                </div>

                @if (cpLookup(); as cpInfo) {
                  <div class="coverage-alert">
                    <span><kx-icon name="check" [size]="16" /> {{ i18n.t('checkout.coverage') }} <strong>{{ cpInfo.municipality }}, {{ cpInfo.state_name }}</strong>.</span>
                  </div>
                }

                <div class="form-row">
                  <div class="form-group">
                    <label for="streetMx" class="form-label">{{ i18n.t('checkout.street') }}</label>
                    <input id="streetMx" type="text" class="form-input" name="streetMx" [(ngModel)]="street" required [placeholder]="i18n.t('checkout.streetPh')" />
                  </div>
                  <div class="form-group">
                    <label for="extMx" class="form-label">{{ i18n.t('checkout.extNumber') }}</label>
                    <input id="extMx" type="text" class="form-input" name="extMx" [(ngModel)]="extNumber" required [placeholder]="i18n.t('checkout.extNumberPh')" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="coloniaMx" class="form-label">{{ i18n.t('checkout.colonia') }}</label>
                    <input id="coloniaMx" type="text" class="form-input" name="coloniaMx" [(ngModel)]="colonia" list="coloniasList" required [placeholder]="i18n.t('checkout.coloniaPh')" />
                    @if (cpLookup()?.settlements?.length) {
                      <datalist id="coloniasList">
                        @for (col of cpLookup()!.settlements; track col) {
                          <option [value]="col"></option>
                        }
                      </datalist>
                    }
                  </div>
                  <div class="form-group">
                    <label for="muniMx" class="form-label">{{ i18n.t('checkout.municipality') }}</label>
                    <input id="muniMx" type="text" class="form-input" name="muniMx" [(ngModel)]="municipality" required [placeholder]="i18n.t('checkout.municipalityPh')" />
                  </div>
                </div>

                <div class="form-group">
                  <label for="refMx" class="form-label">{{ i18n.t('checkout.references') }}</label>
                  <textarea id="refMx" class="form-textarea" rows="2" name="refMx" [(ngModel)]="references" [placeholder]="i18n.t('checkout.referencesPh')"></textarea>
                </div>

                <div class="step-actions">
                  <button type="button" class="btn btn-outline" (click)="goToStep(1)"><kx-icon name="arrow-right" [size]="16" class="flip" /><span>{{ i18n.t('checkout.back') }}</span></button>
                  <button type="submit" class="btn btn-primary btn-lg" [disabled]="!f2.valid">
                    <span>{{ i18n.t('checkout.toDropoff') }}</span><kx-icon name="arrow-right" [size]="16" />
                  </button>
                </div>
              </form>
            </div>
          }

          <!-- ============================================================== -->
          <!-- STEP 3: FORMA DE ENTREGA EN EE. UU.                            -->
          <!-- ============================================================== -->
          @if (currentStep() === 3) {
            <div class="step-pane">
              <h2 class="step-title">{{ i18n.t('checkout.s3Title') }}</h2>
              <p class="step-subtitle">{{ i18n.t('checkout.s3Sub') }}</p>

              <div class="fulfillment-selector">
                <label class="fulfillment-card" [class.selected]="fulfillmentType === 'dropoff_center'">
                  <input
                    type="radio"
                    name="fType"
                    value="dropoff_center"
                    [(ngModel)]="fulfillmentType"
                    class="sr-only"
                  />
                  <div class="f-icon"><kx-icon name="building" [size]="22" /></div>
                  <div class="f-text">
                    <h3 class="f-title">{{ i18n.t('checkout.dropoffTitle') }}</h3>
                    <p class="f-desc">{{ i18n.t('checkout.dropoffDesc') }} <a routerLink="/centros-de-acopio" target="_blank" class="inline-link">{{ i18n.t('checkout.dropoffLink') }}</a></p>
                  </div>
                </label>

                <label class="fulfillment-card" [class.selected]="fulfillmentType === 'home_pickup'">
                  <input
                    type="radio"
                    name="fType"
                    value="home_pickup"
                    [(ngModel)]="fulfillmentType"
                    class="sr-only"
                  />
                  <div class="f-icon"><kx-icon name="truck" [size]="22" /></div>
                  <div class="f-text">
                    <h3 class="f-title">{{ i18n.t('checkout.pickupTitle') }}</h3>
                    <p class="f-desc">{{ i18n.t('checkout.pickupDesc') }}</p>
                  </div>
                </label>
              </div>

              @if (fulfillmentType === 'home_pickup') {
                <div class="pickup-address-box">
                  <label for="pickupAddr" class="form-label">{{ i18n.t('checkout.pickupAddr') }}</label>
                  <input
                    id="pickupAddr"
                    type="text"
                    class="form-input"
                    [(ngModel)]="pickupAddressUs"
                    [placeholder]="i18n.t('checkout.pickupAddrPh')" autocomplete="street-address"
                  />
                </div>
              }

              <div class="step-actions">
                <button type="button" class="btn btn-outline" (click)="goToStep(2)"><kx-icon name="arrow-right" [size]="16" class="flip" /><span>{{ i18n.t('checkout.back') }}</span></button>
                <button type="button" class="btn btn-primary btn-lg" (click)="goToStep(4)">
                  <span>{{ i18n.t('checkout.toReview') }}</span><kx-icon name="arrow-right" [size]="16" />
                </button>
              </div>
            </div>
          }

          <!-- ============================================================== -->
          <!-- STEP 4: REVISAR Y PAGAR                                        -->
          <!-- ============================================================== -->
          @if (currentStep() === 4) {
            <div class="step-pane">
              <h2 class="step-title">{{ i18n.t('checkout.s4Title') }}</h2>
              <p class="step-subtitle">{{ i18n.t('checkout.s4Sub') }}</p>

              <!-- Order Summary from Quoter / Storage -->
              @if (persistedQuote(); as pQuote) {
                <div class="summary-receipt-card">
                  <div class="receipt-header">
                    <span class="receipt-box-name"><kx-icon name="package" [size]="14" /> {{ pQuote.box_name }}</span>
                    <span class="receipt-badge">{{ i18n.t('checkout.officialQuote') }}</span>
                  </div>

                  <div class="receipt-breakdown">
                    <div class="r-line">
                      <span>{{ i18n.t('checkout.base') }}</span>
                      <strong>{{ pQuote.quote.breakdown.base_shipping_formatted }}</strong>
                    </div>
                    <div class="r-line">
                      <span>{{ i18n.t('checkout.customs') }}</span>
                      <strong>{{ pQuote.quote.breakdown.customs_tax_formatted }}</strong>
                    </div>
                    <div class="r-line">
                      <span>{{ i18n.t('checkout.insurance') }}</span>
                      <strong>{{ pQuote.quote.breakdown.insurance_formatted }}</strong>
                    </div>
                    <div class="r-total-line">
                      <span>{{ i18n.t('checkout.total') }}</span>
                      <!-- STRICT RULE: Display API formatted only -->
                      <span class="r-total-val">{{ pQuote.quote.total_formatted }}</span>
                    </div>
                  </div>
                </div>
              }

              <!-- Payment Method Selection -->
              <div class="payment-methods-selector">
                <h3 class="pm-heading">{{ i18n.t('checkout.pmHeading') }}</h3>

                <div class="pm-tabs">
                  <button
                    type="button"
                    class="pm-tab"
                    [class.active]="selectedPaymentMethod === 'stripe'"
                    (click)="selectedPaymentMethod = 'stripe'"
                  >
                    <kx-icon name="credit-card" [size]="16" /> {{ i18n.t('checkout.pmCard') }}
                  </button>
                  <button
                    type="button"
                    class="pm-tab"
                    [class.active]="selectedPaymentMethod === 'paypal'"
                    (click)="selectedPaymentMethod = 'paypal'"
                  >
                    <kx-icon name="wallet" [size]="16" /> PayPal
                  </button>
                  <button
                    type="button"
                    class="pm-tab"
                    [class.active]="selectedPaymentMethod === 'cash'"
                    (click)="selectedPaymentMethod = 'cash'"
                  >
                    <kx-icon name="banknote" [size]="16" /> {{ i18n.t('checkout.pmCash') }}
                  </button>
                </div>

                <!-- Stripe Payment Element Mockup -->
                @if (selectedPaymentMethod === 'stripe') {
                  <div class="stripe-element-container">
                    <div class="stripe-security-banner">
                      <kx-icon name="shield-check" [size]="16" />
                      <span>{{ i18n.t('checkout.stripeSecure') }}</span>
                    </div>

                    <div class="form-group">
                      <label for="cardNumber" class="form-label">{{ i18n.t('checkout.cardNumber') }}</label>
                      <input id="cardNumber" type="text" class="form-input" placeholder="4242 •••• •••• 4242" />
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label for="cardExp" class="form-label">{{ i18n.t('checkout.cardExp') }}</label>
                        <input id="cardExp" type="text" class="form-input" [placeholder]="i18n.t('checkout.cardExpPh')" />
                      </div>
                      <div class="form-group">
                        <label for="cardCvc" class="form-label">{{ i18n.t('checkout.cardCvc') }}</label>
                        <input id="cardCvc" type="password" maxlength="4" class="form-input" placeholder="CVC" />
                      </div>
                    </div>
                  </div>
                }

                <!-- PayPal Button Mockup -->
                @if (selectedPaymentMethod === 'paypal') {
                  <div class="paypal-container">
                    <p class="paypal-desc">{{ i18n.t('checkout.paypalDesc') }}</p>
                    <div class="paypal-btn-mock">
                      <span>PayPal Checkout</span>
                    </div>
                  </div>
                }

                <!-- Cash Payment Instructions -->
                @if (selectedPaymentMethod === 'cash') {
                  <div class="cash-container">
                    <h4 class="cash-title">{{ i18n.t('checkout.cashTitle') }}</h4>
                    <p class="cash-desc">{{ i18n.t('checkout.cashDesc') }}</p>
                    <div class="cash-barcode-box">
                      <span class="barcode-lines">||||| | |||| ||| |||||| | ||||</span>
                      <span class="barcode-num">9384-0192-8472-0192</span>
                    </div>
                  </div>
                }
              </div>

              <div class="step-actions">
                <button type="button" class="btn btn-outline" (click)="goToStep(3)"><kx-icon name="arrow-right" [size]="16" class="flip" /><span>{{ i18n.t('checkout.back') }}</span></button>
                <button
                  type="button"
                  class="btn btn-primary btn-lg"
                  (click)="finalizePayment()"
                  [disabled]="isProcessingPayment()"
                >
                  @if (isProcessingPayment()) {
                    <span>{{ i18n.t('checkout.processing') }}</span>
                  } @else {
                    <span>{{ i18n.t('checkout.payNow') }}</span>
                  }
                </button>
              </div>
            </div>
          }

          <!-- ============================================================== -->
          <!-- STEP 5: SUCCESS / CONFIRMATION                                 -->
          <!-- ============================================================== -->
          @if (currentStep() === 5) {
            <div class="confirmation-pane">
              <div class="conf-badge-icon"><kx-icon name="check" [size]="28" /></div>
              <h1 class="conf-title">{{ i18n.t('checkout.doneTitle') }}</h1>
              <p class="conf-sub">
                @if (recipientEmail) {
                  {{ i18n.t('checkout.doneSub') }} <strong>{{ recipientEmail }}</strong>.
                } @else {
                  {{ i18n.t('checkout.doneSubNoEmail') }}
                }
              </p>

              <div class="guide-assigned-box">
                <span class="assigned-label">{{ i18n.t('checkout.guideLabel') }}</span>
                <span class="assigned-number">{{ assignedGuide() }}</span>
                <span class="assigned-ref">{{ i18n.t('checkout.refLabel') }} {{ assignedRef() }}</span>
              </div>

              <div class="next-steps-card">
                <h3 class="next-steps-title">{{ i18n.t('checkout.nextTitle') }}</h3>
                <ul class="next-steps-list">
                  <li>{{ i18n.t('checkout.next1') }} <strong>{{ assignedGuide() }}</strong>.</li>
                  <li>{{ i18n.t('checkout.next2') }}</li>
                  <li>{{ i18n.t('checkout.next3') }}</li>
                </ul>
              </div>

              <div class="conf-actions">
                <a [routerLink]="['/rastrear', assignedGuide()]" class="btn btn-primary btn-lg">
                  {{ i18n.t('checkout.trackBtn') }} <kx-icon name="arrow-right" [size]="16" />
                </a>
                <a routerLink="/" class="btn btn-outline btn-lg">
                  {{ i18n.t('checkout.homeBtn') }}
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .flip { transform: scaleX(-1); }
    .inline-link { color: var(--kx-blue-600); text-decoration: underline; text-underline-offset: 2px; font-weight: 600; }

    .checkout-page-section {
      padding: 3.5rem 1.25rem 5rem;
      background: var(--kangoo-surface-bg);
      min-height: calc(100vh - 120px);
    }

    .stepper-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2.5rem;
      max-width: 680px;
      margin-left: auto;
      margin-right: auto;
    }

    .step-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
    }

    .step-bubble {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #FFFFFF;
      border: 2px solid var(--kangoo-border);
      color: var(--kangoo-neutral-muted);
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      transition: all var(--transition-fast);

      .step-indicator.active & {
        border-color: var(--kangoo-primary);
        color: var(--kangoo-primary);
      }

      .step-indicator.current & {
        background: var(--kangoo-primary);
        color: #FFFFFF;
        box-shadow: 0 0 0 4px var(--kangoo-primary-light);
      }
    }

    .step-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--kangoo-neutral-muted);

      .step-indicator.active & {
        color: var(--kangoo-secondary);
      }
    }

    .step-line {
      flex: 1;
      height: 3px;
      background: var(--kangoo-border);
      margin: 0 0.5rem;
      position: relative;
      top: -10px;

      &.filled {
        background: var(--kangoo-primary);
      }
    }

    .checkout-card {
      background: #FFFFFF;
      border-radius: var(--radius-2xl);
      border: 1px solid var(--kangoo-border);
      box-shadow: var(--shadow-md);
      padding: 2.5rem;

      @media (max-width: 640px) {
        padding: 1.5rem;
      }
    }

    .step-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      margin-bottom: 0.25rem;
    }

    .step-subtitle {
      font-size: 0.9rem;
      color: var(--kangoo-neutral-muted);
      margin-bottom: 2rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1rem;

      @media (min-width: 640px) {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      }
    }

    .coverage-alert {
      background: var(--kangoo-success-light);
      color: var(--kangoo-success-dark);
      padding: 0.6rem 0.85rem;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
    }

    .fulfillment-selector {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .fulfillment-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.25rem;
      background: var(--kangoo-surface-bg);
      border: 1.5px solid var(--kangoo-border);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: #FFFFFF;
        border-color: var(--kangoo-secondary);
      }

      &.selected {
        background: #FFFFFF;
        border-color: var(--kangoo-primary);
        box-shadow: 0 0 0 2px var(--kangoo-primary-light);
      }
    }

    .f-icon {
      font-size: 1.8rem;
    }

    .f-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      margin-bottom: 0.25rem;
    }

    .f-desc {
      font-size: 0.85rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.4;
    }

    .pickup-address-box {
      margin-bottom: 1.5rem;
    }

    .step-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--kangoo-border);
      padding-top: 1.5rem;
      margin-top: 2rem;
    }

    // Summary Receipt Card
    .summary-receipt-card {
      background: var(--kangoo-secondary);
      color: #FFFFFF;
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .receipt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      padding-bottom: 0.75rem;
    }

    .receipt-box-name {
      font-size: 1.15rem;
      font-weight: 800;
    }

    .receipt-badge {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      background: var(--kangoo-primary);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
    }

    .receipt-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .r-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.88rem;
      color: #CBD5E1;
    }

    .r-total-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      padding-top: 0.75rem;
      font-size: 1rem;
      font-weight: 800;
    }

    .r-total-val {
      font-size: 1.6rem;
      color: #FFFFFF;
      font-weight: 900;
    }

    // Payment Methods
    .payment-methods-selector {
      margin-bottom: 2rem;
    }

    .pm-heading {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      margin-bottom: 1rem;
    }

    .pm-tabs {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.25rem;

      @media (min-width: 600px) {
        flex-direction: row;
      }
    }

    .pm-tab {
      flex: 1;
      padding: 0.75rem 1rem;
      background: var(--kangoo-surface-bg);
      border: 1.5px solid var(--kangoo-border);
      border-radius: var(--radius-lg);
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      cursor: pointer;
      min-height: 48px;

      &.active {
        background: #FFFFFF;
        border-color: var(--kangoo-secondary);
        box-shadow: var(--shadow-sm);
      }
    }

    .stripe-element-container {
      background: var(--kangoo-surface-bg);
      border: 1px solid var(--kangoo-border);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
    }

    .stripe-security-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.78rem;
      color: #065F46;
      background: #D1FAE5;
      padding: 0.4rem 0.75rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.25rem;
    }

    .paypal-container {
      background: #F0F7FF;
      border: 1px solid #BFDBFE;
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      text-align: center;
    }

    .paypal-desc {
      font-size: 0.88rem;
      color: #1E3A8A;
      margin-bottom: 1rem;
    }

    .paypal-btn-mock {
      background: #FFC439;
      color: #003087;
      font-weight: 900;
      padding: 0.75rem 2rem;
      border-radius: var(--radius-full);
      display: inline-block;
      box-shadow: var(--shadow-sm);
    }

    .cash-container {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: var(--radius-xl);
      padding: 1.5rem;
    }

    .cash-title {
      font-size: 1rem;
      font-weight: 800;
      color: #92400E;
      margin-bottom: 0.35rem;
    }

    .cash-desc {
      font-size: 0.85rem;
      color: #78350F;
      line-height: 1.4;
      margin-bottom: 1rem;
    }

    .cash-barcode-box {
      background: #FFFFFF;
      padding: 1rem;
      border-radius: var(--radius-md);
      text-align: center;
      border: 1px dashed #D97706;
    }

    .barcode-lines {
      font-family: monospace;
      font-size: 1.8rem;
      letter-spacing: 0.15em;
      display: block;
      color: var(--kx-blue-900);
    }

    .barcode-num {
      font-family: monospace;
      font-weight: 700;
      color: #78350F;
    }

    // Success confirmation
    .confirmation-pane {
      text-align: center;
      padding: 2rem 1rem;
    }

    .conf-badge-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: var(--kangoo-success-light);
      color: var(--kangoo-success-dark);
      font-size: 2.5rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
    }

    .conf-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      margin-bottom: 0.5rem;
    }

    .conf-sub {
      font-size: 1.05rem;
      color: var(--kangoo-neutral-text);
      max-width: 580px;
      margin: 0 auto 2rem;
    }

    .guide-assigned-box {
      background: var(--kangoo-surface-bg);
      border: 2px solid var(--kangoo-secondary);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      max-width: 440px;
      margin: 0 auto 2rem;
    }

    .assigned-label {
      font-size: 0.78rem;
      text-transform: uppercase;
      font-weight: 800;
      color: var(--kangoo-neutral-muted);
      display: block;
      margin-bottom: 0.25rem;
    }

    .assigned-number {
      font-size: 2rem;
      font-weight: 900;
      color: var(--kangoo-primary);
      display: block;
      letter-spacing: 0.05em;
    }

    .assigned-ref {
      font-size: 0.85rem;
      color: var(--kangoo-secondary);
      font-weight: 600;
    }

    .next-steps-card {
      background: #FFFFFF;
      border: 1px solid var(--kangoo-border);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      max-width: 600px;
      margin: 0 auto 2.5rem;
      text-align: left;
    }

    .next-steps-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      margin-bottom: 0.75rem;
    }

    .next-steps-list {
      padding-left: 1.25rem;
      font-size: 0.9rem;
      color: var(--kangoo-neutral-text);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .conf-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: center;

      @media (min-width: 600px) {
        flex-direction: row;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent {
  private readonly api = inject(ApiService);
  readonly i18n = inject(I18nService);
  private readonly quoteStorage = inject(QuoteStorageService);

  readonly currentStep = signal<CheckoutStep>(1);
  readonly persistedQuote = signal<PersistedQuote | null>(null);

  // Step 1: Recipient
  recipientName = '';
  recipientPhone = '';
  recipientEmail = '';

  // Step 2: Address in Mexico
  destinationCp = '72000';
  destinationState = 'Puebla';
  street = '';
  extNumber = '';
  colonia = '';
  municipality = '';
  references = '';
  readonly isLookingUpCp = signal<boolean>(false);
  readonly cpLookup = signal<PostalCodeLookup | null>(null);

  // Step 3: Fulfillment
  fulfillmentType: 'dropoff_center' | 'home_pickup' = 'dropoff_center';
  pickupAddressUs = '';

  // Step 4: Payment
  selectedPaymentMethod: 'stripe' | 'paypal' | 'cash' = 'stripe';
  readonly isProcessingPayment = signal<boolean>(false);

  // Step 5: Confirmation outputs
  readonly assignedGuide = signal<string>('KG-892344-MX');
  readonly assignedRef = signal<string>('REF-2026-9041');

  constructor() {
    const saved = this.quoteStorage.currentQuote();
    if (saved) {
      this.persistedQuote.set(saved);
      if (saved.request.destination_postal_code) {
        this.destinationCp = saved.request.destination_postal_code;
      }
      if (saved.request.destination_state) {
        this.destinationState = saved.request.destination_state;
      }
    }
    // Pre-fill municipality/colonia from the postal code chosen in the quoter.
    this.onCpLookup(this.destinationCp);
  }

  goToStep(step: CheckoutStep): void {
    this.currentStep.set(step);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onCpLookup(cp: string): void {
    const clean = cp.replace(/[^0-9]/g, '');
    if (clean.length === 5) {
      this.isLookingUpCp.set(true);
      this.api.lookupPostalCode(clean).subscribe({
        next: lookup => {
          this.isLookingUpCp.set(false);
          this.cpLookup.set(lookup);
          this.destinationState = lookup.state_name;
          this.municipality = lookup.municipality;
          if (lookup.settlements.length > 0) {
            this.colonia = lookup.settlements[0];
          }
        },
        error: () => this.isLookingUpCp.set(false)
      });
    } else {
      this.cpLookup.set(null);
    }
  }

  finalizePayment(): void {
    this.isProcessingPayment.set(true);
    setTimeout(() => {
      this.isProcessingPayment.set(false);
      const generatedGuide = `KG-${Math.floor(100000 + Math.random() * 900000)}-MX`;
      const generatedRef = `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      this.assignedGuide.set(generatedGuide);
      this.assignedRef.set(generatedRef);
      this.goToStep(5);
    }, 1200);
  }
}
