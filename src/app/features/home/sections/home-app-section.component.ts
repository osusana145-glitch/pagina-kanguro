import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { MobileAppLinks } from '../../../core/models/api.models';
import { IconComponent, IconName } from '../../../shared/components/icon/icon.component';
import { StoreBadgesComponent } from '../../../shared/components/store-badges/store-badges.component';

/**
 * Promotes the official Kangoo Xpress mobile app. Store links come from
 * GET /site-content (mobile_app). Until the API returns them, the section
 * shows a "search the store" hint instead of dead buttons.
 */
@Component({
  selector: 'kx-home-app-section',
  standalone: true,
  imports: [RouterLink, IconComponent, StoreBadgesComponent],
  template: `
    <section class="section app-section" id="app" aria-labelledby="appHeading">
      <div class="container app-layout">
        <div>
          <span class="section-tag">{{ i18n.t('home.appBadge') }}</span>
          <h2 id="appHeading" class="section-title">{{ i18n.t('home.appTitle') }}</h2>
          <p class="section-subtitle">{{ i18n.t('home.appSub') }}</p>

          <ul class="feats">
            @for (f of feats; track f.n) {
              <li>
                <span class="icon-tile"><kx-icon [name]="f.icon" [size]="20" /></span>
                <div>
                  <h3>{{ i18n.t('home.appFeat' + f.n + 'Title') }}</h3>
                  <p>{{ i18n.t('home.appFeat' + f.n + 'Desc') }}</p>
                </div>
              </li>
            }
          </ul>

          <div class="actions">
            <kx-store-badges [iosUrl]="links()?.ios_url" [androidUrl]="links()?.android_url" />
            <a routerLink="/rastrear" class="btn btn-outline track-web">
              <kx-icon name="search" [size]="18" />{{ i18n.t('home.appTrackWeb') }}
            </a>
          </div>
          @if (!links()?.ios_url && !links()?.android_url) {
            <p class="hint"><kx-icon name="smartphone" [size]="16" />{{ i18n.t('home.appSearchHint') }}</p>
          }
        </div>

        <!-- Illustrative phone: shows the live-tracking flow, no real data -->
        <div class="phone" aria-hidden="true">
          <div class="screen">
            <p class="scr-title">{{ i18n.t('home.appMockGuide') }}</p>
            <ol class="timeline">
              <li class="done"><span class="dot"></span>{{ i18n.t('tracking.stepReceived') }}</li>
              <li class="done"><span class="dot"></span>{{ i18n.t('tracking.stepInTransit') }}</li>
              <li class="customs"><span class="dot"></span>{{ i18n.t('tracking.stepCustoms') }}</li>
              <li><span class="dot"></span>{{ i18n.t('tracking.stepOutForDelivery') }}</li>
              <li><span class="dot"></span>{{ i18n.t('tracking.stepDelivered') }}</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .app-section { background: var(--kx-blue-soft-1); border-block: 1px solid var(--kx-blue-soft-2); }
    .app-layout {
      display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(2rem, 5vw, 5rem); align-items: center;
      @media (min-width: 900px) { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); }
    }
    .section-title, .section-subtitle { text-align: left; margin-inline: 0; }
    .feats { list-style: none; display: grid; gap: 1.25rem; margin: 2rem 0; }
    .feats li { display: flex; gap: 1rem; align-items: flex-start; }
    .feats h3 { font-size: 1.0625rem; margin-bottom: .125rem; }
    .feats .icon-tile { background: #fff; }
    .actions { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }
    .track-web { min-height: 48px; }
    .hint { display: flex; align-items: center; gap: .5rem; margin-top: 1rem; font-size: .9375rem; color: var(--kx-text-primary); }

    .phone {
      justify-self: center; width: min(100%, 300px); aspect-ratio: 9 / 18;
      border: 10px solid var(--kx-blue-900); border-radius: 28px; background: #fff; padding: 1.5rem 1.125rem;
    }
    .scr-title { font-weight: 700; color: var(--kx-blue-900); margin-bottom: 1.25rem; }
    .timeline { list-style: none; display: grid; gap: 1.125rem; font-size: .875rem; color: var(--kx-text-secondary); }
    .timeline li { display: flex; align-items: center; gap: .625rem; }
    .dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--kx-border); flex-shrink: 0; }
    .done { color: var(--kx-text-primary); .dot { background: var(--kx-status-delivered); border-color: var(--kx-status-delivered); } }
    .customs { color: var(--kx-blue-900); font-weight: 600; .dot { background: var(--kx-status-customs); border-color: var(--kx-status-customs); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeAppSectionComponent {
  readonly i18n = inject(I18nService);
  readonly links = input<MobileAppLinks | undefined>(undefined);
  readonly feats: { n: number; icon: IconName }[] = [
    { n: 1, icon: 'bell' },
    { n: 2, icon: 'calculator' },
    { n: 3, icon: 'receipt' }
  ];
}
