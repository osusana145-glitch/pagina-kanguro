import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { I18nService } from '../../core/services/i18n.service';
import { ApiService } from '../../core/services/api.service';
import { MobileAppLinks } from '../../core/models/api.models';
import { StoreBadgesComponent } from '../../shared/components/store-badges/store-badges.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LogoComponent, StoreBadgesComponent],
  template: `
    <footer class="footer-global" role="contentinfo">
      <!-- Top Trust Banner -->
      <div class="footer-trust-banner">
        <div class="container trust-grid">
          <div class="trust-item">
            <div class="trust-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div>
              <h4 class="trust-title">{{ i18n.t('footer.trust1Title') }}</h4>
              <p class="trust-desc">{{ i18n.t('footer.trust1Desc') }}</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div>
              <h4 class="trust-title">{{ i18n.t('footer.trust2Title') }}</h4>
              <p class="trust-desc">{{ i18n.t('footer.trust2Desc') }}</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div>
              <h4 class="trust-title">{{ i18n.t('footer.trust3Title') }}</h4>
              <p class="trust-desc">{{ i18n.t('footer.trust3Desc') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Footer Links Section -->
      <div class="container footer-main">
        <div class="footer-grid">
          <!-- Col 1: Brand & Contact -->
          <div class="footer-col brand-col">
            <app-logo [inverse]="true"></app-logo>
            <p class="footer-bio">
              {{ i18n.t('footer.bio') }}
            </p>
            <div class="footer-contact-info">
              <p><strong>{{ i18n.t('footer.warehouse') }}</strong> 321 Blodgett St Suite-A, Cotati, CA 94931</p>
              <p><strong>{{ i18n.t('footer.office') }}</strong> 1015 Center Dr, Suite A, Santa Rosa, CA 95403</p>
              <p><strong>{{ i18n.t('footer.phone') }}</strong> <a href="tel:7078009318">+1 (707) 800-9318</a></p>
              <p><strong>{{ i18n.t('footer.whatsapp') }}</strong> <a href="https://api.whatsapp.com/send?phone=+17076127290" target="_blank" rel="noopener noreferrer">+1 (707) 612-7290</a></p>
              <p><strong>{{ i18n.t('footer.email') }}</strong> <a href="mailto:info@kangoo-xpress.com">info&#64;kangoo-xpress.com</a></p>
            </div>
            <div class="footer-social-links">
              <a href="https://facebook.com/kangoo.xpress.us" target="_blank" rel="noopener noreferrer" class="social-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                <span>Facebook</span>
              </a>
              <span class="social-dot" aria-hidden="true">•</span>
              <a href="https://www.instagram.com/kangoo.xpress/" target="_blank" rel="noopener noreferrer" class="social-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          <!-- Col 2: Services -->
          <div class="footer-col">
            <h4 class="col-title">{{ i18n.t('footer.servicesTitle') }}</h4>
            <ul class="col-links">
              <li><a routerLink="/">{{ i18n.t('nav.quote') }}</a></li>
              <li><a routerLink="/rastrear">{{ i18n.t('nav.track') }}</a></li>
              <li><a routerLink="/centros-de-acopio">{{ i18n.t('nav.centers') }}</a></li>
              <li><a routerLink="/pedido-especial">{{ i18n.t('nav.specialOrder') }}</a></li>
              <li><a routerLink="/enviar">{{ i18n.t('quoter.continueBtn') }}</a></li>
            </ul>
          </div>

          <!-- Col 3: Customer Information -->
          <div class="footer-col">
            <h4 class="col-title">{{ i18n.t('footer.infoTitle') }}</h4>
            <ul class="col-links">
              <li><a routerLink="/como-funciona">{{ i18n.t('nav.howItWorks') }}</a></li>
              <li><a routerLink="/que-puedo-enviar">{{ i18n.t('nav.whatCanISend') }}</a></li>
              <li><a routerLink="/tiempos-de-entrega">{{ i18n.t('nav.deliveryTimes') }}</a></li>
              <li><a routerLink="/preguntas-frecuentes">{{ i18n.t('nav.faqs') }}</a></li>
              <li><a routerLink="/ser-centro-de-acopio">{{ i18n.t('nav.bePartner') }}</a></li>
            </ul>
          </div>

          <!-- Col 4: Mobile App & Portal -->
          <div class="footer-col">
            <h4 class="col-title">{{ i18n.t('footer.appTitle') }}</h4>
            <p class="app-desc">
              {{ i18n.t('footer.appDesc') }}
            </p>
            <kx-store-badges class="footer-badges" [onDark]="true" [iosUrl]="appLinks()?.ios_url" [androidUrl]="appLinks()?.android_url" />

            <div class="payment-methods">
              <span class="payment-title">{{ i18n.t('footer.payments') }}</span>
              <div class="payment-badges">
                <span class="p-badge">Stripe</span>
                <span class="p-badge">Visa</span>
                <span class="p-badge">Mastercard</span>
                <span class="p-badge">{{ i18n.t('footer.cash') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright Subfooter -->
      <div class="subfooter">
        <div class="container subfooter-inner">
          <p class="copyright">
            © {{ currentYear }} Kangoo Xpress ®. {{ i18n.t('footer.rights') }}
          </p>
          <p class="subfooter-tagline">
            {{ i18n.t('footer.fastAndSafe') }}
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-badges { margin-bottom: .25rem; }
    .footer-contact-info p { color: var(--kx-blue-soft-2); }
    .footer-contact-info a { color: #fff; text-decoration: underline; text-underline-offset: 2px; }
    .app-desc { color: var(--kx-blue-soft-2); font-size: .9375rem; line-height: 1.5; margin-bottom: .75rem; }
    .payment-methods { margin-top: 1.25rem; }
    .payment-title { display: block; font-size: .8125rem; text-transform: uppercase; letter-spacing: .05em; color: var(--kx-blue-soft-3); margin-bottom: .375rem; }
    .payment-badges { display: flex; gap: .375rem; flex-wrap: wrap; }

    .footer-global {
      background-color: var(--kx-blue-900);
      color: #FFFFFF;
      margin-top: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-trust-banner {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1.75rem 0;
      background: rgba(0, 0, 0, 0.12);
    }

    .trust-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1.5rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    .trust-item {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
    }

    .trust-icon {
      color: var(--kx-blue-soft-3);
      flex-shrink: 0;
      margin-top: 0.15rem;
    }

    .trust-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 0.25rem;
    }

    .trust-desc {
      font-size: 0.82rem;
      color: #b8c6e8;
      line-height: 1.4;
    }

    .footer-main {
      padding: 3rem 1.25rem 2rem;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 2rem;

      @media (min-width: 768px) {
        grid-template-columns: 1.5fr repeat(3, minmax(0, 1fr));
      }
    }

    .brand-col {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .footer-bio {
      color: #dce3f3;
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .footer-contact-info {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-size: 0.84rem;
      color: #dce3f3;
      margin-top: 0.5rem;

      strong {
        color: #FFFFFF;
      }
    }

    .footer-social-links {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-top: 0.5rem;
    }

    .social-link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: #dce3f3;
      font-size: 0.82rem;
      transition: color var(--transition-fast);

      &:hover {
        color: #FFFFFF;
      }
    }

    .social-dot {
      color: var(--kx-blue-soft-3);
    }

    .col-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 1rem;
    }

    .col-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      a {
        color: #dce3f3;
        font-size: 0.85rem;
        transition: color var(--transition-fast);

        &:hover {
          color: #FFFFFF;
          text-decoration: underline;
        }
      }
    }



    .p-badge {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-size: 0.72rem;
      color: #FFFFFF;
    }

    .subfooter {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 1.25rem 0;
      font-size: 0.8rem;
      color: var(--kx-blue-soft-3);
    }

    .subfooter-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .copyright {
      color: var(--kx-blue-soft-3);
    }

    .subfooter-tagline {
      color: #b8c6e8;
      font-style: italic;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  /** Store links from GET /site-content; badges stay non-clickable until set. */
  readonly appLinks = signal<MobileAppLinks | undefined>(undefined);

  constructor() {
    inject(ApiService).getSiteContent().subscribe(c => this.appLinks.set(c.mobile_app));
  }

  readonly i18n = inject(I18nService);
  readonly currentYear = new Date().getFullYear();
}
