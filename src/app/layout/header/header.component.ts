import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, LogoComponent],
  template: `
    <header class="header-fixed" role="banner">
      <!-- Announcement / Social trust bar -->
      <div class="top-announcement">
        <div class="container announcement-inner">
          <div class="announcement-badge">
            <span class="live-dot" aria-hidden="true"></span>
            <span>California ⇄ México • Fast and Safe</span>
          </div>
          <div class="announcement-meta">
            <a href="tel:+17078009318" class="meta-link" [attr.aria-label]="i18n.t('header.phoneAria')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>+1 (707) 800-9318</span>
            </a>
            <span class="meta-divider" aria-hidden="true">•</span>
            <span class="meta-schedule">Cotati / Santa Rosa, CA</span>
          </div>
        </div>
      </div>

      <!-- Main Navigation Header -->
      <nav class="main-nav" [attr.aria-label]="i18n.t('header.navAria')">
        <div class="container nav-container">
          <!-- Logo -->
          <app-logo></app-logo>

          <!-- Desktop Navigation Links (Spaced & Uncompressed) -->
          <div class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
              {{ i18n.t('nav.home') }}
            </a>
            <a routerLink="/rastrear" routerLinkActive="active" class="nav-link">
              {{ i18n.t('nav.track') }}
            </a>
            <a routerLink="/centros-de-acopio" routerLinkActive="active" class="nav-link">
              {{ i18n.t('nav.centers') }}
            </a>
            <a routerLink="/como-funciona" routerLinkActive="active" class="nav-link">
              {{ i18n.t('nav.howItWorks') }}
            </a>
            <a routerLink="/que-puedo-enviar" routerLinkActive="active" class="nav-link">
              {{ i18n.t('nav.whatCanISend') }}
            </a>
            <a routerLink="/preguntas-frecuentes" routerLinkActive="active" class="nav-link">
              {{ i18n.t('nav.faqs') }}
            </a>
            <a routerLink="/contacto" routerLinkActive="active" class="nav-link">
              {{ i18n.t('nav.contact') }}
            </a>
          </div>

          <!-- Actions: Language Selector & My Account -->
          <div class="nav-actions">
            <!-- Language Selector Toggle [ EN | ES ] -->
            <div class="lang-selector" role="group" [attr.aria-label]="i18n.t('header.langAria')">
              <button
                type="button"
                class="lang-btn"
                [class.active]="i18n.currentLang() === 'en'"
                (click)="i18n.setLanguage('en')"
                aria-label="Change language to English"
              >
                EN
              </button>
                            <button
                type="button"
                class="lang-btn"
                [class.active]="i18n.currentLang() === 'es'"
                (click)="i18n.setLanguage('es')"
                aria-label="Cambiar idioma a Español"
              >
                ES
              </button>
            </div>

            <!-- "My Account" CTA -->
            <a routerLink="/cuenta" class="btn btn-secondary btn-account">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{{ i18n.t('nav.myAccount') }}</span>
            </a>

            <!-- Mobile Hamburger Toggle -->
            <button
              type="button"
              class="mobile-toggle-btn"
              (click)="isMobileMenuOpen.set(!isMobileMenuOpen())"
              [attr.aria-expanded]="isMobileMenuOpen()"
              [attr.aria-label]="i18n.t('header.menuAria')"
            >
              @if (isMobileMenuOpen()) {
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              } @else {
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              }
            </button>
          </div>
        </div>

        <!-- Mobile Drawer Overlay -->
        @if (isMobileMenuOpen()) {
          <div class="mobile-drawer" role="dialog" aria-modal="true">
            <div class="mobile-drawer-inner">
              <form (ngSubmit)="submitTrackingSearch()" class="mobile-track-form">
                <input
                  type="text"
                  class="form-input"
                  [placeholder]="i18n.t('nav.trackPlaceholder')"
                  [(ngModel)]="searchGuide"
                  name="mSearchGuide"
                />
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
                  {{ i18n.t('tracking.searchBtn') }}
                </button>
              </form>

              <div class="mobile-nav-links">
                <a routerLink="/" (click)="closeMobileMenu()" class="mobile-link">{{ i18n.t('nav.home') }}</a>
                <a routerLink="/rastrear" (click)="closeMobileMenu()" class="mobile-link">{{ i18n.t('nav.track') }}</a>
                <a routerLink="/centros-de-acopio" (click)="closeMobileMenu()" class="mobile-link">{{ i18n.t('nav.centers') }}</a>
                <a routerLink="/como-funciona" (click)="closeMobileMenu()" class="mobile-link">{{ i18n.t('nav.howItWorks') }}</a>
                <a routerLink="/que-puedo-enviar" (click)="closeMobileMenu()" class="mobile-link">{{ i18n.t('nav.whatCanISend') }}</a>
                <a routerLink="/tiempos-de-entrega" (click)="closeMobileMenu()" class="mobile-link">{{ i18n.t('nav.deliveryTimes') }}</a>
                <a routerLink="/preguntas-frecuentes" (click)="closeMobileMenu()" class="mobile-link">{{ i18n.t('nav.faqs') }}</a>
                <a routerLink="/pedido-especial" (click)="closeMobileMenu()" class="mobile-link">{{ i18n.t('nav.specialOrder') }}</a>
                <a routerLink="/ser-centro-de-acopio" (click)="closeMobileMenu()" class="mobile-link">{{ i18n.t('nav.bePartner') }}</a>
                <a routerLink="/contacto" (click)="closeMobileMenu()" class="mobile-link">{{ i18n.t('nav.contact') }}</a>
                <a href="/#app" (click)="closeMobileMenu()" class="mobile-link">{{ i18n.t('nav.app') }}</a>
                <a routerLink="/cuenta" (click)="closeMobileMenu()" class="mobile-link highlight">{{ i18n.t('nav.myAccount') }}</a>
              </div>
            </div>
          </div>
        }
      </nav>
    </header>
  `,
  styles: [`
    .header-fixed {
      position: sticky;
      top: 0;
      z-index: 1000;
      width: 100%;
      background: #FFFFFF;
      border-bottom: 1px solid var(--kx-border);
    }

    .top-announcement {
      background-color: var(--kx-blue-900);
      color: #FFFFFF;
      font-size: 0.8125rem;
      padding: 0.375rem 0;
    }

    .announcement-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .announcement-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      color: #FFFFFF;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--kx-status-transit);
      display: inline-block;
    }

    .announcement-meta {
      display: none;
      align-items: center;
      gap: 0.5rem;
      color: #dce3f3;

      @media (min-width: 768px) {
        display: flex;
      }
    }

    .meta-link {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      color: #FFFFFF;
      font-weight: 600;

      &:hover {
        color: var(--kx-blue-soft-2);
      }
    }

    .main-nav {
      position: relative;
    }

    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
      gap: clamp(0.5rem, 2vw, 2.5rem);
    }

    .nav-links {
      display: none;
      flex: 1;
      justify-content: center;
      align-items: center;
      gap: clamp(1.25rem, 2.2vw, 2.5rem);

      @media (min-width: 1140px) {
        display: flex;
      }
    }

    .nav-link {
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--kx-text-primary);
      transition: color var(--transition-fast);
      position: relative;
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      padding: 0 0.125rem;
      white-space: nowrap;

      &:hover {
        color: var(--kx-blue-600);
      }

      &.active {
        color: var(--kx-blue-600);
        font-weight: 700;

        &::after {
          content: '';
          position: absolute;
          bottom: 6px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--kx-blue-600);
        }
      }
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .lang-selector {
      display: flex;
      align-items: center;
      background: var(--kx-bg-page);
      border: 1px solid var(--kx-border);
      border-radius: var(--kx-radius-sm);
      padding: 0;
      gap: 0;
      font-size: 0.8125rem;
      font-weight: 700;
    }

    .lang-btn {
      background: transparent;
      border: none;
      color: var(--kx-text-secondary);
      min-width: 44px;
      min-height: 42px;
      padding: 0 0.5rem;
      border-radius: var(--kx-radius-sm);
      font-weight: 700;
      cursor: pointer;
      transition: color var(--transition-fast);

      &:hover {
        color: var(--kx-blue-900);
      }

      &.active {
        color: var(--kx-blue-600);
        background: #FFFFFF;
        box-shadow: inset 0 0 0 1px var(--kx-blue-soft-3);
      }
    }

    .lang-divider {
      color: var(--kx-border);
      font-size: 0.75rem;
    }

    .btn-account {
      display: none;
      padding: 0.5rem 1rem;
      font-size: 0.9375rem;

      @media (min-width: 640px) {
        display: inline-flex;
      }
    }

    .mobile-toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: transparent;
      border: 1px solid var(--kx-border);
      border-radius: var(--kx-radius-sm);
      color: var(--kx-blue-900);
      cursor: pointer;

      @media (min-width: 1140px) {
        display: none;
      }
    }

    .mobile-drawer {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #FFFFFF;
      border-bottom: 1px solid var(--kx-border);
      box-shadow: var(--shadow-xl);
      z-index: 999;
      padding: 1.25rem clamp(1rem, 2.5vw, 2.5rem);
      max-height: calc(100vh - 110px);
      overflow-y: auto;
    }

    .mobile-drawer-inner {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .mobile-track-form {
      .form-input {
        width: 100%;
        height: 44px;
        border: 1px solid var(--kx-border);
        border-radius: var(--kx-radius-sm);
        padding: 0 0.75rem;
      }
    }

    .mobile-nav-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .mobile-link {
      display: flex;
      align-items: center;
      min-height: 44px;
      padding: 0 0.75rem;
      font-size: 1rem;
      font-weight: 500;
      color: var(--kx-text-primary);
      border-radius: var(--kx-radius-sm);
      transition: background var(--transition-fast);

      &:hover {
        background: var(--kx-blue-soft-1);
        color: var(--kx-blue-600);
      }

      &.highlight {
        color: var(--kx-blue-600);
        font-weight: 700;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  readonly isMobileMenuOpen = signal(false);
  searchGuide = '';

  submitTrackingSearch(): void {
    const term = this.searchGuide.trim();
    if (term) {
      this.closeMobileMenu();
      this.router.navigate(['/rastrear', term]);
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
