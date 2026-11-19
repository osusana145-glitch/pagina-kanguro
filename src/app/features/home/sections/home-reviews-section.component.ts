import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { CustomerReview } from '../../../core/models/api.models';
import { IconComponent } from '../../../shared/components/icon/icon.component';

/** Reviews (only if the API returns any) + closing call to action. */
@Component({
  selector: 'kx-home-reviews-section',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    @if (reviews().length) {
      <section class="section">
        <div class="container">
          <header class="section-header">
            <span class="section-tag">{{ i18n.t('home.reviewsTag') }}</span>
            <h2 class="section-title">{{ i18n.t('home.reviewsTitle') }}</h2>
            <p class="section-subtitle">{{ i18n.t('home.reviewsSub') }}</p>
          </header>
          <div class="cards-auto">
            @for (r of reviews(); track r.id) {
              <figure class="card review">
                <div class="stars" role="img" [attr.aria-label]="r.rating + ' / 5'">
                  @for (s of [1, 2, 3, 4, 5]; track s) {
                    <kx-icon name="star" [size]="16" [class.off]="s > r.rating" />
                  }
                </div>
                <blockquote>{{ r.comment }}</blockquote>
                <figcaption>
                  <span class="avatar" aria-hidden="true">{{ r.author.charAt(0) }}</span>
                  <span>
                    <strong>{{ r.author }}</strong>
                    <span class="route">{{ r.city_origin }} → {{ r.city_dest }}</span>
                  </span>
                </figcaption>
              </figure>
            }
          </div>
        </div>
      </section>
    }

    <section class="cta">
      <div class="container cta-inner">
        <div>
          <h2>{{ i18n.t('home.ctaTitle') }}</h2>
          <p>{{ i18n.t('home.ctaSub') }}</p>
        </div>
        <div class="cta-actions">
          <a class="btn btn-light" href="https://api.whatsapp.com/send?phone=+17076127290" target="_blank" rel="noopener noreferrer">
            <kx-icon name="message-circle" [size]="18" />{{ i18n.t('home.ctaWhatsApp') }}
          </a>
          <a class="btn btn-ghost-light" href="tel:+17078009318">
            <kx-icon name="phone" [size]="18" />{{ i18n.t('home.ctaCall') }}
          </a>
          <a class="btn btn-ghost-light" routerLink="/centros-de-acopio">
            <kx-icon name="map-pin" [size]="18" />{{ i18n.t('home.ctaCenters') }}
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .review { display: flex; flex-direction: column; gap: 1rem; margin: 0; }
    .stars { display: flex; gap: 2px; color: var(--kx-blue-600); .off { color: var(--kx-border); } }
    blockquote { color: var(--kx-text-primary); flex: 1; }
    figcaption { display: flex; align-items: center; gap: .75rem; font-size: .9375rem; color: var(--kx-text-primary); }
    .avatar {
      display: grid; place-items: center; width: 40px; height: 40px; flex-shrink: 0;
      border-radius: 50%; background: var(--kx-blue-soft-2); color: var(--kx-blue-900); font-weight: 700;
    }
    .route { display: block; font-size: .875rem; color: var(--kx-text-secondary); }

    .cta { background: var(--kx-blue-900); color: #fff; padding: clamp(2.5rem, 5vw, 4rem) 0; }
    .cta-inner {
      display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; align-items: center;
      @media (min-width: 1024px) { grid-template-columns: minmax(0, 1fr) auto; }
    }
    .cta h2 { color: #fff; font-size: clamp(1.5rem, 1rem + 2vw, 2.25rem); margin-bottom: .5rem; }
    .cta p { color: var(--kx-blue-soft-2); }
    .cta-actions { display: flex; flex-wrap: wrap; gap: .75rem; }
    .btn-light { background: #fff; color: var(--kx-blue-900); &:hover { background: var(--kx-blue-soft-1); } }
    .btn-ghost-light {
      background: transparent; color: #fff; border-color: rgba(255, 255, 255, .5);
      &:hover { border-color: #fff; background: rgba(255, 255, 255, .08); }
    }
    .btn:focus-visible { outline-color: #fff; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeReviewsSectionComponent {
  readonly i18n = inject(I18nService);
  readonly reviews = input<CustomerReview[]>([]);
}
