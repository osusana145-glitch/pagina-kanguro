import { IconComponent } from '../../shared/components/icon/icon.component';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  input,
  effect,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { I18nService } from '../../core/services/i18n.service';
import { TrackingResponse } from '../../core/models/api.models';
import { StatusBadgeComponent } from '../../shared/components/badge/status-badge.component';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [IconComponent, FormsModule, RouterLink, StatusBadgeComponent],
  template: `
    <section class="tracking-page-section" aria-labelledby="trackHeading">
      <div class="container container-narrow">
        <!-- Search Header -->
        <div class="tracking-search-box">
          <div class="track-header-badge">
            <span class="live-dot" aria-hidden="true"></span>
            <span>{{ i18n.t('tracking.badge') }}</span>
          </div>

          <h1 id="trackHeading" class="track-title">{{ i18n.t('tracking.title') }}</h1>
          <p class="track-subtitle">{{ i18n.t('tracking.subtitle') }}</p>

          <form (ngSubmit)="performSearch()" class="track-main-form" role="search">
            <div class="search-input-wrapper">
              <input
                type="text"
                class="form-input track-huge-input"
                [placeholder]="i18n.t('tracking.inputPlaceholder')"
                [(ngModel)]="searchQuery"
                name="searchQuery"
                autocomplete="off"
                spellcheck="false"
              />
              <button type="submit" class="btn btn-primary btn-search-huge" [disabled]="isLoading()">
                @if (isLoading()) {
                  <span class="btn-spinner"></span>
                } @else {
                  <span>{{ i18n.t('tracking.searchBtn') }}</span>
                }
              </button>
            </div>
            <span class="search-hint">{{ i18n.t('tracking.hint') }}</span>
          </form>

          <!-- Mobile app promotion -->
          <div class="app-banner">
            <div class="app-banner-text">
              <span class="icon-tile"><kx-icon name="smartphone" [size]="20" /></span>
              <div>
                <strong>{{ i18n.t('tracking.appTitle') }}</strong>
                <span>{{ i18n.t('tracking.appDesc') }}</span>
              </div>
            </div>
            <a routerLink="/" fragment="app" class="btn btn-outline btn-sm">
              <span>{{ i18n.t('tracking.appCta') }}</span>
              <kx-icon name="arrow-right" [size]="16" />
            </a>
          </div>
        </div>

        <!-- Tracking Results View -->
        @if (trackingResult(); as result) {
          <article class="tracking-result-card" [attr.aria-label]="i18n.t('tracking.resultAria')">
            <!-- Header Bar with Status Tone & Reference -->
            <div class="result-header">
              <div>
                <span class="ref-label">{{ i18n.t('tracking.refLabel') }}</span>
                <h2 class="ref-code">{{ result.reference_id }}</h2>
                @if (result.tracking_number) {
                  <div class="guide-tag">
                    <span>{{ i18n.t('tracking.guide') }} <strong>{{ result.tracking_number }}</strong></span>
                  </div>
                }
              </div>

              <div class="header-status-area">
                <app-status-badge
                  [label]="result.status_label"
                  [tone]="result.status_tone"
                ></app-status-badge>
              </div>
            </div>

            <!-- RULE: Sin pago no hay guía - Alert Banner -->
            @if (!result.is_paid || result.status === 'pending_payment') {
              <div class="pending-payment-banner" role="alert">
                <div class="alert-icon">
                  <kx-icon name="bell" [size]="22" />
                </div>
                <div class="alert-content">
                  <h3 class="alert-title">{{ i18n.t('tracking.pendingTitle') }}</h3>
                  <p class="alert-desc">{{ i18n.t('tracking.pendingDesc') }}</p>
                  @if (result.payment_cta) {
                    <a [routerLink]="result.payment_cta.action_url" class="btn btn-primary btn-sm alert-btn">
                      {{ i18n.t('tracking.payNowBtn') }}
                    </a>
                  }
                </div>
              </div>
            }

            <!-- Attention / Delay Alerts -->
            @if (result.needs_attention && result.attention_reason) {
              <div class="attention-banner">
                <span class="att-title">{{ i18n.t('tracking.notice') }}</span>
                <span>{{ result.attention_reason }}</span>
              </div>
            }

            <!-- Package Details Grid -->
            <div class="details-summary-grid">
              <div class="summary-cell">
                <span class="cell-label">{{ i18n.t('tracking.origin') }}</span>
                <span class="cell-val">{{ result.origin_city }}</span>
              </div>
              <div class="summary-cell">
                <span class="cell-label">{{ i18n.t('tracking.destination') }}</span>
                <span class="cell-val">{{ result.destination_city }}</span>
              </div>
              <div class="summary-cell">
                <span class="cell-label">{{ i18n.t('tracking.recipient') }}</span>
                <span class="cell-val">{{ result.recipient_name }}</span>
              </div>
              <div class="summary-cell">
                <span class="cell-label">{{ i18n.t('tracking.eta') }}</span>
                <span class="cell-val highlight">{{ result.estimated_delivery_date }}</span>
              </div>
            </div>

            <!-- Timeline Steps (Customs in Blue) -->
            <div class="timeline-container">
              <h3 class="timeline-heading">{{ i18n.t('tracking.progress') }}</h3>

              <div class="timeline-steps">
                @for (step of result.timeline; track step.step_id; let isLast = $last) {
                  <div
                    class="timeline-item"
                    [class.completed]="step.completed"
                    [class.current]="step.current"
                    [class.customs-step]="step.is_customs"
                  >
                    <!-- Timeline Node Icon -->
                    <div class="node-wrapper">
                      <div class="timeline-node" [class.node-customs]="step.is_customs">
                        @if (step.completed) {
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        } @else if (step.current) {
                          <div class="current-pulse-dot"></div>
                        }
                      </div>
                      @if (!isLast) {
                        <div class="timeline-line"></div>
                      }
                    </div>

                    <!-- Step Content -->
                    <div class="step-details">
                      <div class="step-head">
                        <h4 class="step-name" [class.text-customs]="step.is_customs">
                          {{ step.title }}
                          @if (step.is_customs) {
                            <span class="customs-pill">{{ i18n.t('tracking.customsPill') }}</span>
                          }
                        </h4>
                        @if (step.timestamp) {
                          <span class="step-time">{{ step.timestamp }}</span>
                        }
                      </div>
                      <p class="step-desc">{{ step.description }}</p>
                      <span class="step-loc"><kx-icon name="map-pin" [size]="14" /> {{ step.location }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Footer Action: WhatsApp Support with Pre-filled Guide -->
            <div class="result-actions">
              <a
                [href]="whatsappTrackingUrl(result)"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline"
              >
                <kx-icon name="message-circle" [size]="18" />
                <span>{{ i18n.t('tracking.whatsapp') }}</span>
              </a>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .app-banner {
      margin-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
      background: #fff; border: 1px solid var(--kx-border); border-radius: var(--kx-radius); padding: 1rem 1.25rem; text-align: left;
      .icon-tile { margin: 0; }
      .btn { display: inline-flex; gap: .375rem; }
    }
    .app-banner-text {
      display: flex; align-items: center; gap: .875rem; min-width: 0;
      strong { display: block; color: var(--kx-blue-900); }
      span { color: var(--kx-text-secondary); font-size: .9375rem; }
    }

    .tracking-page-section {
      padding: 3.5rem 1.25rem 5rem;
      background: var(--kangoo-surface-bg);
      min-height: calc(100vh - 120px);
    }

    .tracking-search-box {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .track-header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #FFFFFF;
      color: var(--kangoo-secondary);
      font-size: 0.8rem;
      font-weight: 700;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--kangoo-border);
      margin-bottom: 1rem;
    }

    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: var(--kangoo-success);
    }

    .track-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }

    .track-subtitle {
      font-size: 1rem;
      color: var(--kangoo-neutral-muted);
      max-width: 600px;
      margin: 0 auto 1.5rem;
    }

    .track-main-form {
      max-width: 640px;
      margin: 0 auto;
    }

    .search-input-wrapper {
      display: flex;
      gap: 0.5rem;
      background: #FFFFFF;
      padding: 0.4rem;
      border-radius: var(--radius-2xl);
      border: 2px solid var(--kangoo-secondary);
      box-shadow: var(--shadow-md);

      @media (max-width: 600px) {
        flex-direction: column;
      }
    }

    .track-huge-input {
      border: none;
      min-height: 52px;
      font-size: 1.1rem;
      font-weight: 700;
      padding-left: 1.25rem;
      background: transparent;

      &:focus {
        box-shadow: none;
      }
    }

    .btn-search-huge {
      min-width: 140px;
      border-radius: var(--radius-xl);
      font-size: 1rem;
    }

    .btn-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #FFFFFF;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .search-hint {
      display: block;
      font-size: 0.78rem;
      color: var(--kangoo-neutral-muted);
      margin-top: 0.65rem;
    }

    // Result Card
    .tracking-result-card {
      background: #FFFFFF;
      border-radius: var(--radius-2xl);
      border: 1px solid var(--kangoo-border);
      box-shadow: var(--shadow-lg);
      padding: 2rem;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .result-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 1px solid var(--kangoo-border);
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
      gap: 1rem;
    }

    .ref-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--kangoo-neutral-muted);
      display: block;
    }

    .ref-code {
      font-size: 1.6rem;
      font-weight: 900;
      color: var(--kangoo-secondary);
      line-height: 1.2;
    }

    .guide-tag {
      font-size: 0.85rem;
      color: var(--kangoo-primary);
      margin-top: 0.25rem;
    }

    // Pending payment alert banner
    .pending-payment-banner {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      background: var(--kangoo-warning-light);
      border: 1.5px solid var(--kangoo-warning);
      border-radius: var(--radius-xl);
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .alert-icon {
      flex-shrink: 0;
    }

    .alert-title {
      font-size: 1rem;
      font-weight: 800;
      color: var(--kangoo-warning-dark);
      margin-bottom: 0.25rem;
    }

    .alert-desc {
      font-size: 0.85rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.4;
      margin-bottom: 0.75rem;
    }

    .attention-banner {
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      color: #1E40AF;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      margin-bottom: 1.5rem;

      .att-title {
        font-weight: 700;
        margin-right: 0.35rem;
      }
    }

    .details-summary-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      background: var(--kangoo-surface-bg);
      border-radius: var(--radius-xl);
      padding: 1.25rem;
      margin-bottom: 2rem;

      @media (min-width: 640px) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }

    .cell-label {
      font-size: 0.72rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--kangoo-neutral-muted);
      display: block;
      margin-bottom: 0.2rem;
    }

    .cell-val {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--kangoo-secondary);

      &.highlight {
        color: var(--kangoo-primary);
      }
    }

    // Timeline
    .timeline-container {
      margin-bottom: 2rem;
    }

    .timeline-heading {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      margin-bottom: 1.5rem;
    }

    .timeline-steps {
      display: flex;
      flex-direction: column;
    }

    .timeline-item {
      display: flex;
      gap: 1.25rem;

      &.completed .timeline-line {
        background-color: var(--kangoo-success);
      }

      &.customs-step .timeline-node {
        border-color: var(--kangoo-info-customs);
        background: #FFFFFF;
      }

      &.customs-step.completed .timeline-node {
        background-color: var(--kangoo-info-customs);
      }

      &.customs-step.current .timeline-node {
        border-color: var(--kangoo-info-customs);
        box-shadow: 0 0 0 4px var(--kangoo-info-customs-light);
      }
    }

    .node-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 28px;
      flex-shrink: 0;
    }

    .timeline-node {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #FFFFFF;
      border: 3px solid var(--kangoo-border);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      z-index: 2;

      .completed & {
        background-color: var(--kangoo-success);
        border-color: var(--kangoo-success);
      }

      .current & {
        border-color: var(--kangoo-primary);
        box-shadow: 0 0 0 4px var(--kangoo-primary-light);
      }
    }

    .current-pulse-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--kangoo-primary);
    }

    .timeline-line {
      width: 3px;
      min-height: 48px;
      background-color: var(--kangoo-border);
      margin: 4px 0;
    }

    .step-details {
      padding-bottom: 2rem;
      flex: 1;
    }

    .step-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .step-name {
      font-size: 1rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &.text-customs {
        color: var(--kangoo-info-customs);
      }
    }

    .customs-pill {
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      background: var(--kangoo-info-customs-light);
      color: var(--kangoo-info-customs-dark);
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-sm);
    }

    .step-time {
      font-size: 0.78rem;
      color: var(--kangoo-neutral-muted);
      font-weight: 600;
    }

    .step-desc {
      font-size: 0.85rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.4;
      margin-bottom: 0.25rem;
    }

    .step-loc {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--kangoo-secondary);
    }

    .result-actions {
      border-top: 1px solid var(--kangoo-border);
      padding-top: 1.5rem;
      display: flex;
      justify-content: flex-end;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackingComponent {
  private readonly api = inject(ApiService);
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  // Input from route param: /rastrear/:guia
  readonly guia = input<string>();

  searchQuery = '';
  readonly isLoading = signal<boolean>(false);
  readonly trackingResult = signal<TrackingResponse | null>(null);

  constructor() {
    effect(() => {
      const g = this.guia();
      if (g) {
        this.searchQuery = g;
        this.fetchTracking(g);
      } else {
        // Default initial demonstration
        this.fetchTracking('KG-892344-MX');
      }
    });
  }

  performSearch(): void {
    const raw = this.searchQuery.trim();
    if (!raw) {
      this.fetchTracking('KG-892344-MX');
      return;
    }
    this.fetchTracking(raw);
    this.router.navigate(['/rastrear', raw]);
  }

  private fetchTracking(code: string): void {
    // Normalization: strip spaces, dashes, convert to uppercase
    const clean = code.trim().toUpperCase();
    this.isLoading.set(true);

    this.api.getTracking(clean).subscribe({
      next: res => {
        this.trackingResult.set(res);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  whatsappTrackingUrl(result: TrackingResponse): string {
    const identifier = result.tracking_number || result.reference_id;
    const msg = this.i18n.t('tracking.waMessage', { id: identifier, dest: result.destination_city });
    return `https://wa.me/17076127290?text=${encodeURIComponent(msg)}`;
  }
}
