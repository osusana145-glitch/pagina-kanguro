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
            <span class="live-dot"></span>
            <span>Rutas Activas Diarias EE. UU. ⇄ México • Despacho Aduanal Garantizado</span>
          </div>
          <div class="announcement-meta">
            <a href="tel:+17135550142" class="meta-link" aria-label="Teléfono de atención">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>+1 (713) 555-0142</span>
            </a>
            <span class="meta-divider">•</span>
            <span class="meta-schedule">Lun-Sáb: 9am - 6:30pm</span>
          </div>
        </div>
      </div>

      <!-- Main Navigation Header -->
      <nav class="main-nav" role="navigation" aria-label="Navegación principal">
        <div class="container nav-container">
          <!-- Logo -->
          <app-logo></app-logo>

          <!-- Quick Tracking Search in Header -->
          <div class="header-search">
            <form (ngSubmit)="submitTrackingSearch()" class="quick-track-form" role="search">
              <label for="headerTrackInput" class="sr-only">Número de guía de rastreo</label>
              <div class="track-input-wrapper">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  id="headerTrackInput"
                  type="text"
                  class="quick-track-input"
                  [placeholder]="i18n.t('nav.trackPlaceholder')"
                  [(ngModel)]="searchGuide"
                  name="searchGuide"
                  autocomplete="off"
                  spellcheck="false"
                />
                <button type="submit" class="quick-track-btn" aria-label="Buscar rastreo de guía">
                  <span>{{ i18n.t('tracking.searchBtn') }}</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Desktop Navigation Links -->
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
          </div>

          <!-- Actions: Language Selector & My Account -->
          <div class="nav-actions">
            <!-- Language Selector Toggle [ ES | EN ] -->
            <div class="lang-selector" role="group" aria-label="Selector de idioma">
              <button
                type="button"
                class="lang-btn"
                [class.active]="i18n.currentLang() === 'es'"
                (click)="i18n.setLanguage('es')"
                aria-label="Cambiar idioma a Español"
              >
                ES
              </button>
              <span class="lang-divider">|</span>
              <button
                type="button"
                class="lang-btn"
                [class.active]="i18n.currentLang() === 'en'"
                (click)="i18n.setLanguage('en')"
                aria-label="Change language to English"
              >
                EN
              </button>
            </div>

            <!-- "Mi Cuenta" / "Entrar" CTA -->
            <a routerLink="/cuenta" class="btn btn-secondary btn-account">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
              aria-label="Alternar menú móvil"
            >
              @if (isMobileMenuOpen()) {
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              } @else {
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
                <a routerLink="/cuenta" (click)="closeMobileMenu()" class="mobile-link highlight">{{ i18n.t('nav.myAccount') }}</a>
              </div>
            </div>
          </div>
        }
      </nav>
    </header>
  `,
  styles: [`
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }

    .header-fixed {
      position: sticky;
      top: 0;
      z-index: 1000;
      width: 100%;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--kangoo-border);
      box-shadow: 0 4px 20px rgba(10, 37, 64, 0.05);
    }

    .top-announcement {
      background-color: var(--kangoo-secondary);
      color: #FFFFFF;
      font-size: 0.78rem;
      padding: 0.35rem 0;
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
      color: #E2E8F0;
    }

    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: var(--kangoo-primary);
      box-shadow: 0 0 8px var(--kangoo-primary);
      animation: pulse 1.8s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.3); }
      100% { opacity: 1; transform: scale(1); }
    }

    .announcement-meta {
      display: none;
      align-items: center;
      gap: 0.5rem;
      color: #94A3B8;

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
        color: var(--kangoo-primary-light);
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
      gap: 1.25rem;
    }

    .header-search {
      display: none;
      flex: 1;
      max-width: 320px;

      @media (min-width: 1024px) {
        display: block;
      }
    }

    .quick-track-form {
      width: 100%;
    }

    .track-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: var(--kangoo-surface-bg);
      border: 1.5px solid var(--kangoo-border);
      border-radius: var(--radius-full);
      padding: 0.2rem 0.25rem 0.2rem 0.85rem;
      transition: all var(--transition-fast);

      &:focus-within {
        border-color: var(--kangoo-secondary);
        background: #FFFFFF;
        box-shadow: 0 0 0 3px rgba(10, 37, 64, 0.08);
      }
    }

    .search-icon {
      color: var(--kangoo-neutral-muted);
      margin-right: 0.4rem;
      flex-shrink: 0;
    }

    .quick-track-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.82rem;
      color: var(--kangoo-secondary);
      width: 100%;

      &::placeholder {
        color: var(--kangoo-neutral-muted);
      }
    }

    .quick-track-btn {
      background: var(--kangoo-primary);
      color: #FFFFFF;
      border: none;
      border-radius: var(--radius-full);
      padding: 0.35rem 0.85rem;
      font-size: 0.76rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: background var(--transition-fast);

      &:hover {
        background: var(--kangoo-primary-hover);
      }
    }

    .nav-links {
      display: none;
      align-items: center;
      gap: 1.5rem;

      @media (min-width: 880px) {
        display: flex;
      }
    }

    .nav-link {
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--kangoo-secondary);
      transition: color var(--transition-fast);
      position: relative;
      padding: 0.4rem 0;

      &:hover {
        color: var(--kangoo-primary);
      }

      &.active {
        color: var(--kangoo-primary);

        &::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--kangoo-primary);
          border-radius: 2px;
        }
      }
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .lang-selector {
      display: flex;
      align-items: center;
      background: var(--kangoo-surface-bg);
      border: 1px solid var(--kangoo-border);
      border-radius: var(--radius-full);
      padding: 0.2rem 0.45rem;
      gap: 0.3rem;
      font-size: 0.78rem;
      font-weight: 700;
    }

    .lang-btn {
      background: transparent;
      border: none;
      color: var(--kangoo-neutral-muted);
      padding: 0.2rem 0.35rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        color: var(--kangoo-secondary);
      }

      &.active {
        color: var(--kangoo-primary);
        font-weight: 800;
      }
    }

    .lang-divider {
      color: var(--kangoo-border);
    }

    .btn-account {
      display: none;

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
      border: 1.5px solid var(--kangoo-border);
      border-radius: var(--radius-lg);
      color: var(--kangoo-secondary);
      cursor: pointer;

      @media (min-width: 880px) {
        display: none;
      }
    }

    .mobile-drawer {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #FFFFFF;
      border-bottom: 2px solid var(--kangoo-secondary);
      box-shadow: var(--shadow-xl);
      padding: 1.25rem 1rem 2rem;
      animation: slideDown 0.2s ease-out;

      @media (min-width: 880px) {
        display: none;
      }
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .mobile-nav-links {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-top: 1rem;
    }

    .mobile-link {
      display: block;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--kangoo-secondary);
      border-radius: var(--radius-md);

      &:hover {
        background: var(--kangoo-surface-bg);
        color: var(--kangoo-primary);
      }

      &.highlight {
        background: var(--kangoo-primary);
        color: #FFFFFF;
        text-align: center;
        margin-top: 0.5rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  searchGuide = '';
  readonly isMobileMenuOpen = signal<boolean>(false);

  submitTrackingSearch(): void {
    const raw = this.searchGuide.trim();
    this.closeMobileMenu();
    if (!raw) {
      this.router.navigate(['/rastrear']);
      return;
    }
    this.router.navigate(['/rastrear', raw]);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
