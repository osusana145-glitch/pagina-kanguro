import { IconComponent } from '../../../shared/components/icon/icon.component';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  input,
  effect
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { I18nService } from '../../../core/services/i18n.service';
import { UserShipmentDetail } from '../../../core/models/api.models';
import { StatusBadgeComponent } from '../../../shared/components/badge/status-badge.component';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  imports: [IconComponent, RouterLink, StatusBadgeComponent],
  template: `
    @if (shipment(); as detail) {
      <div class="shipment-detail-wrapper">
        <!-- Top Back Nav and Actions -->
        <div class="detail-nav-bar">
          <a routerLink="/cuenta/envios" class="back-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            <span>{{ i18n.t('detail.back') }}</span>
          </a>

          <div class="action-buttons">
            <!-- Signed Receipt PDF Download Button -->
            <button
              type="button"
              class="btn btn-outline btn-sm"
              (click)="downloadReceipt(detail.reference_id)"
              [disabled]="isGeneratingPdf() || !detail.is_paid"
            >
              @if (isGeneratingPdf()) {
                <span class="btn-spinner"></span>
                <span>{{ i18n.t('detail.generating') }}</span>
              } @else {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>{{ i18n.t('detail.download') }}</span>
              }
            </button>
          </div>
        </div>

        @if (receiptUrl()) {
          <div class="signed-receipt-banner" role="status">
            <span>{{ i18n.t('detail.linkReady') }}</span>
            <a [href]="receiptUrl()" target="_blank" class="download-link">{{ i18n.t('detail.openPdf') }} <kx-icon name="arrow-right" [size]="14" /></a>
          </div>
        }

        <!-- Header Overview Card -->
        <header class="detail-header-card">
          <div class="header-main">
            <div>
              <span class="ref-sub">{{ i18n.t('detail.reference') }}</span>
              <h1 class="ref-title">{{ detail.reference_id }}</h1>
              @if (detail.tracking_number) {
                <span class="guide-badge">{{ i18n.t('detail.guide', { n: detail.tracking_number }) }}</span>
              }
            </div>
            <app-status-badge
              [label]="detail.status_label"
              [tone]="detail.status_tone"
            ></app-status-badge>
          </div>

          <div class="meta-pills-row">
            <span class="meta-pill"><kx-icon name="calendar" [size]="14" /> {{ i18n.t('detail.date', { d: detail.created_at }) }}</span>
            <span class="meta-pill"><kx-icon name="package" [size]="14" /> {{ detail.box_name }}</span>
            <span class="meta-pill"><kx-icon name="shield" [size]="14" /> {{ detail.insurance_plan_name }}</span>
          </div>
        </header>

        <!-- Addresses Route Row -->
        <div class="addresses-card">
          <div class="address-col">
            <span class="addr-label">{{ i18n.t('detail.origin') }}</span>
            <h3 class="addr-title">{{ i18n.t('detail.originHub') }}</h3>
            <p class="addr-text">{{ detail.origin_address }}</p>
          </div>
          <div class="route-arrow"><kx-icon name="arrow-right" [size]="20" /></div>
          <div class="address-col">
            <span class="addr-label">{{ i18n.t('detail.destination') }}</span>
            <h3 class="addr-title">{{ detail.recipient_name }}</h3>
            <p class="addr-text">{{ detail.destination_address }}</p>
          </div>
        </div>

        <!-- Official Payment Breakdown (Strict Rule: from API only) -->
        <section class="breakdown-section" aria-labelledby="breakdownTitle">
          <h2 id="breakdownTitle" class="section-title">{{ i18n.t('detail.breakdown') }}</h2>
          <div class="breakdown-card">
            <div class="breakdown-line">
              <span>{{ i18n.t('detail.base') }}</span>
              <strong>{{ detail.breakdown.base_shipping_formatted }}</strong>
            </div>
            <div class="breakdown-line">
              <span>{{ i18n.t('detail.customs') }}</span>
              <strong>{{ detail.breakdown.customs_tax_formatted }}</strong>
            </div>
            <div class="breakdown-line">
              <span>{{ i18n.t('detail.insurance') }}</span>
              <strong>{{ detail.breakdown.insurance_formatted }}</strong>
            </div>
            @if (detail.breakdown.extras_formatted !== '$0.00 USD') {
              <div class="breakdown-line">
                <span>{{ i18n.t('detail.extras') }}</span>
                <strong>{{ detail.breakdown.extras_formatted }}</strong>
              </div>
            }
            <div class="breakdown-total-line">
              <span>{{ i18n.t('detail.total') }}</span>
              <span class="total-highlight">{{ detail.total_formatted }}</span>
            </div>
          </div>
        </section>
      </div>
    }
  `,
  styles: [`
    .shipment-detail-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .detail-nav-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .back-link {
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

    .signed-receipt-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--kangoo-success-light);
      border: 1px solid var(--kangoo-success);
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-lg);
      font-size: 0.88rem;
      color: var(--kangoo-success-dark);
      font-weight: 600;

      .download-link {
        color: var(--kangoo-secondary);
        font-weight: 800;
        text-decoration: underline;
      }
    }

    .detail-header-card {
      background: var(--kangoo-surface-bg);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      border: 1px solid var(--kangoo-border);
    }

    .header-main {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .ref-sub {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--kangoo-neutral-muted);
    }

    .ref-title {
      font-size: 1.8rem;
      font-weight: 900;
      color: var(--kangoo-secondary);
      line-height: 1.2;
    }

    .guide-badge {
      display: inline-block;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--kangoo-primary);
      margin-top: 0.25rem;
    }

    .meta-pills-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .meta-pill {
      font-size: 0.78rem;
      font-weight: 600;
      background: #FFFFFF;
      border: 1px solid var(--kangoo-border);
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      color: var(--kangoo-secondary);
    }

    .addresses-card {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1.5rem;
      background: #FFFFFF;
      border: 1px solid var(--kangoo-border);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      align-items: center;

      @media (min-width: 640px) {
        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      }
    }

    .route-arrow {
      font-size: 1.5rem;
      color: var(--kangoo-primary);
      text-align: center;
    }

    .addr-label {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--kangoo-neutral-muted);
      display: block;
      margin-bottom: 0.25rem;
    }

    .addr-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      margin-bottom: 0.25rem;
    }

    .addr-text {
      font-size: 0.88rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.4;
    }

    .breakdown-section {
      margin-top: 0.5rem;
    }

    .section-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      margin-bottom: 0.75rem;
    }

    .breakdown-card {
      background: var(--kangoo-surface-bg);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      border: 1px solid var(--kangoo-border);
    }

    .breakdown-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: var(--kangoo-neutral-text);
      margin-bottom: 0.65rem;

      strong {
        color: var(--kangoo-secondary);
      }
    }

    .breakdown-total-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px solid var(--kangoo-border);
      padding-top: 0.85rem;
      margin-top: 0.85rem;
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
    }

    .total-highlight {
      font-size: 1.6rem;
      font-weight: 900;
      color: var(--kangoo-primary);
    }

    .btn-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipmentDetailComponent {
  private readonly api = inject(ApiService);
  readonly i18n = inject(I18nService);

  readonly referencia = input<string>();
  readonly shipment = signal<UserShipmentDetail | null>(null);
  readonly isGeneratingPdf = signal<boolean>(false);
  readonly receiptUrl = signal<string | null>(null);

  constructor() {
    effect(() => {
      const ref = this.referencia();
      if (ref) {
        this.api.getUserShipmentDetail(ref).subscribe({
          next: d => this.shipment.set(d)
        });
      }
    });
  }

  downloadReceipt(ref: string): void {
    this.isGeneratingPdf.set(true);
    this.api.getSignedReceipt(ref).subscribe({
      next: res => {
        this.receiptUrl.set(res.receipt_url);
        this.isGeneratingPdf.set(false);
      },
      error: () => this.isGeneratingPdf.set(false)
    });
  }
}
