import { Component, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { CatalogResponse } from '../../../core/models/api.models';
import { IconComponent, IconName } from '../../../shared/components/icon/icon.component';

/** Below-the-fold informational sections of the home page (lazy, via @defer). */
@Component({
  selector: 'kx-home-info-sections',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <!-- How it works -->
    <section class="section">
      <div class="container">
        <header class="section-header">
          <span class="section-tag">{{ i18n.t('home.howTag') }}</span>
          <h2 class="section-title">{{ i18n.t('home.howTitle') }}</h2>
          <p class="section-subtitle">{{ i18n.t('home.howSub') }}</p>
        </header>
        <ol class="cards-4 steps">
          @for (s of steps; track s; let i = $index) {
            <li class="card">
              <span class="step-n tabular-nums">{{ i + 1 }}</span>
              <h3 class="card-title">{{ i18n.t('home.step' + s + 'Title') }}</h3>
              <p>{{ i18n.t('home.step' + s + 'Desc') }}</p>
            </li>
          }
        </ol>
      </div>
    </section>

    <!-- Services -->
    <section class="section section-alt">
      <div class="container">
        <header class="section-header">
          <span class="section-tag">{{ i18n.t('home.servicesTag') }}</span>
          <h2 class="section-title">{{ i18n.t('home.servicesTitle') }}</h2>
          <p class="section-subtitle">{{ i18n.t('home.servicesSub') }}</p>
        </header>
        <div class="cards-4">
          @for (p of pillars; track p.key) {
            <div class="card">
              <span class="icon-tile"><kx-icon [name]="p.icon" [size]="22" /></span>
              <h3 class="card-title">{{ i18n.t('home.pillar' + p.key) }}</h3>
              <p>{{ i18n.t('home.pillar' + p.key + 'Desc') }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Box sizes: 100% from the catalog API (no assumed count or sizes) -->
    @if (catalog()?.boxes?.length) {
      <section class="section" id="tamanos">
        <div class="container">
          <header class="section-header">
            <span class="section-tag">{{ i18n.t('home.boxesTag') }}</span>
            <h2 class="section-title">{{ i18n.t('home.boxesTitle') }}</h2>
            <p class="section-subtitle">{{ i18n.t('home.boxesSub') }}</p>
          </header>
          <div class="cards-auto">
            @for (box of catalog()!.boxes; track box.id) {
              <div class="card box-card" [class.featured]="box.popular">
                @if (box.badge) { <span class="tag">{{ box.badge }}</span> }
                <h3 class="card-title">{{ box.name }}</h3>
                @if (box.price_formatted) {
                  <p class="price tabular-nums">{{ box.price_formatted }}</p>
                } @else {
                  <p class="muted">{{ i18n.t('home.boxQuote') }}</p>
                }
                <p class="dims tabular-nums">
                  <strong>{{ box.dimensions.length_in }}" × {{ box.dimensions.width_in }}" × {{ box.dimensions.height_in }}"</strong>
                  <span>{{ i18n.t('home.boxDims') }}</span>
                </p>
                <ul class="checks">
                  <li><kx-icon name="check" [size]="16" />{{ i18n.t('home.boxFeature1') }}</li>
                  <li><kx-icon name="check" [size]="16" />{{ i18n.t('home.boxFeature2') }}</li>
                  <li><kx-icon name="check" [size]="16" />{{ i18n.t('home.boxFeature3') }}</li>
                </ul>
                <button type="button" class="btn" [class.btn-primary]="box.popular" [class.btn-outline]="!box.popular"
                  (click)="boxSelected.emit(box.id)">
                  {{ i18n.t('home.selectBox') }}
                </button>
              </div>
            }
          </div>
          <p class="callout">
            {{ i18n.t('home.specialSizePrompt') }}
            <a routerLink="/pedido-especial">{{ i18n.t('home.specialSizeLink') }}</a>
            <a href="https://api.whatsapp.com/send?phone=+17076127290" target="_blank" rel="noopener noreferrer">{{ i18n.t('home.specialSizeWa') }}</a>
          </p>
        </div>
      </section>
    }

    <!-- Insurance: plans from the catalog API -->
    @if (catalog()?.insurance_plans?.length) {
      <section class="section section-alt">
        <div class="container ins-layout">
          <div>
            <header class="section-header left">
              <span class="section-tag">{{ i18n.t('home.insTag') }}</span>
              <h2 class="section-title">{{ i18n.t('home.insTitle') }}</h2>
              <p class="section-subtitle">{{ i18n.t('home.insSub') }}</p>
            </header>
            <div class="table-wrap">
              <table class="table tabular-nums">
                <thead>
                  <tr>
                    <th scope="col">{{ i18n.t('home.insPlanCol') }}</th>
                    <th scope="col">{{ i18n.t('home.insCostCol') }}</th>
                    <th scope="col">{{ i18n.t('home.insCoverageCol') }}</th>
                  </tr>
                </thead>
                <tbody>
                  @for (plan of catalog()!.insurance_plans; track plan.id) {
                    @if (plan.coverage_amount_usd > 0) {
                      <tr>
                        <td><strong>{{ plan.name }}</strong></td>
                        <td>{{ plan.price_formatted ?? '—' }}</td>
                        <td>{{ plan.coverage_formatted }}</td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>
            <p class="foot">{{ i18n.t('home.insFootnote') }}</p>
          </div>
          <div class="card ins-aside">
            <span class="icon-tile"><kx-icon name="shield-check" [size]="22" /></span>
            <h3 class="card-title">{{ i18n.t('home.insShieldTitle') }}</h3>
            <p>{{ i18n.t('home.insShieldDesc') }}</p>
          </div>
        </div>
      </section>
    }

    <!-- Mission / vision / values -->
    <section class="section">
      <div class="container cards-3">
        <div class="card">
          <span class="icon-tile"><kx-icon name="flag" [size]="22" /></span>
          <h3 class="card-title">{{ i18n.t('home.missionTitle') }}</h3>
          <p>{{ i18n.t('home.missionDesc') }}</p>
        </div>
        <div class="card">
          <span class="icon-tile"><kx-icon name="target" [size]="22" /></span>
          <h3 class="card-title">{{ i18n.t('home.visionTitle') }}</h3>
          <p>{{ i18n.t('home.visionDesc') }}</p>
        </div>
        <div class="card">
          <span class="icon-tile"><kx-icon name="heart" [size]="22" /></span>
          <h3 class="card-title">{{ i18n.t('home.valuesTitle') }}</h3>
          <ul class="checks">
            @for (v of values; track v) {
              <li><kx-icon name="check" [size]="16" />{{ i18n.t('home.val' + v) }}</li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .steps { list-style: none; counter-reset: none; }
    .step-n {
      display: inline-grid; place-items: center; width: 36px; height: 36px; margin-bottom: 1rem;
      border-radius: var(--kx-radius-sm); background: var(--kx-blue-600); color: #fff; font-weight: 700;
    }
    .box-card { display: flex; flex-direction: column; gap: .75rem; .btn { margin-top: auto; width: 100%; } }
    .box-card.featured { border-color: var(--kx-blue-600); box-shadow: inset 0 0 0 1px var(--kx-blue-600); }
    .box-card .tag { align-self: flex-start; }
    .price { font-size: 2rem; font-weight: 700; color: var(--kx-blue-900); letter-spacing: -.02em; }
    .muted { font-size: .9375rem; }
    .dims { display: flex; flex-direction: column; strong { color: var(--kx-text-primary); } span { font-size: .875rem; } }
    .checks { list-style: none; display: grid; gap: .5rem; }
    .checks li { display: flex; gap: .5rem; align-items: flex-start; color: var(--kx-text-primary); font-size: .9375rem; }
    .checks kx-icon { color: var(--kx-status-delivered); margin-top: 3px; }
    .callout {
      margin-top: 1.5rem; padding: 1rem 1.25rem; border: 1px solid var(--kx-border); border-radius: var(--kx-radius);
      background: #fff; color: var(--kx-text-primary);
      a { color: var(--kx-blue-600); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; margin-left: .25rem; }
    }
    .ins-layout {
      display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; align-items: start;
      @media (min-width: 1024px) { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); }
    }
    .table-wrap { overflow-x: auto; border: 1px solid var(--kx-border); border-radius: var(--kx-radius); background: #fff; }
    .table { width: 100%; border-collapse: collapse; font-size: .9375rem; }
    .table th, .table td { text-align: left; padding: .875rem 1rem; border-bottom: 1px solid var(--kx-border); }
    .table th { font-weight: 600; color: var(--kx-blue-900); background: var(--kx-blue-soft-1); }
    .table tr:last-child td { border-bottom: 0; }
    .foot { font-size: .875rem; margin-top: .75rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeInfoSectionsComponent {
  readonly i18n = inject(I18nService);
  readonly catalog = input<CatalogResponse | null>(null);
  readonly boxSelected = output<string>();

  readonly steps = [1, 2, 3, 4];
  readonly values = [1, 2, 3, 4, 5];
  readonly pillars: { key: string; icon: IconName }[] = [
    { key: 'Packing', icon: 'package' },
    { key: 'Convenience', icon: 'clock' },
    { key: 'Care', icon: 'users' },
    { key: 'Security', icon: 'shield' }
  ];
}
