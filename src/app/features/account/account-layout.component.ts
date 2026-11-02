import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <section class="account-page-section" aria-labelledby="accountHeading">
      <div class="container account-layout">
        <!-- Sidebar Navigation -->
        <aside class="account-sidebar" aria-label="Menú de cuenta">
          <div class="user-profile-badge">
            <div class="user-avatar">JP</div>
            <div>
              <h2 id="accountHeading" class="user-name">Juan Pérez Morales</h2>
              <span class="user-tier">Cliente Frecuente Kangoo</span>
            </div>
          </div>

          <nav class="sidebar-nav">
            <a routerLink="/cuenta/envios" routerLinkActive="active" class="side-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              <span>Mis Envíos Realizados</span>
            </a>
            <a routerLink="/cuenta/direcciones" routerLinkActive="active" class="side-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>Libreta de Direcciones</span>
            </a>
            <a routerLink="/" class="side-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Nuevo Envío / Cotizar</span>
            </a>
          </nav>
        </aside>

        <!-- Main Account Content Outlet -->
        <main class="account-main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </section>
  `,
  styles: [`
    .account-page-section {
      padding: 3rem 1.25rem 5rem;
      background: var(--kangoo-surface-bg);
      min-height: calc(100vh - 120px);
    }

    .account-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;

      @media (min-width: 880px) {
        grid-template-columns: 280px 1fr;
      }
    }

    .account-sidebar {
      background: #FFFFFF;
      border: 1px solid var(--kangoo-border);
      border-radius: var(--radius-2xl);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
      height: fit-content;
    }

    .user-profile-badge {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--kangoo-border);
      margin-bottom: 1.25rem;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--kangoo-secondary);
      color: #FFFFFF;
      font-size: 1.1rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .user-name {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      line-height: 1.2;
    }

    .user-tier {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--kangoo-primary);
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .side-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-lg);
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--kangoo-secondary);
      transition: all var(--transition-fast);

      &:hover {
        background: var(--kangoo-surface-bg);
        color: var(--kangoo-primary);
      }

      &.active {
        background: var(--kangoo-primary);
        color: #FFFFFF;
      }
    }

    .account-main-content {
      background: #FFFFFF;
      border-radius: var(--radius-2xl);
      border: 1px solid var(--kangoo-border);
      box-shadow: var(--shadow-sm);
      padding: 2rem;

      @media (max-width: 640px) {
        padding: 1.25rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountLayoutComponent {
  readonly i18n = inject(I18nService);
}
