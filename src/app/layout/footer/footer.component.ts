import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  template: `
    <footer class="footer-global" role="contentinfo">
      <!-- Top Trust Banner -->
      <div class="footer-trust-banner">
        <div class="container trust-grid">
          <div class="trust-item">
            <div class="trust-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div>
              <h4 class="trust-title">Desaduanamiento 100% Legal</h4>
              <p class="trust-desc">Pedimentos formales y sellos fiscales autorizados ante aduana mexicana.</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div>
              <h4 class="trust-title">Entrega Puerta a Puerta</h4>
              <p class="trust-desc">Flotilla terrestre propia con cobertura directa en todo México.</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div>
              <h4 class="trust-title">Rastreo 24/7 en Vivo</h4>
              <p class="trust-desc">Notificaciones automáticas y visibilidad satelital de tu envío.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Footer Links Section -->
      <div class="container footer-main">
        <div class="footer-grid">
          <!-- Col 1: Brand & Bio -->
          <div class="footer-col brand-col">
            <app-logo></app-logo>
            <p class="footer-bio">
              Kangoo Xpress es la empresa líder de paquetería y logística binacional especializada en envíos familiares y comerciales de Estados Unidos a México.
            </p>
            <div class="footer-contact-info">
              <p><strong>Hub Central:</strong> 7410 Airline Dr, Houston, TX 77076</p>
              <p><strong>Atención al Cliente:</strong> +1 (713) 555-0142</p>
              <p><strong>WhatsApp Oficial:</strong> +1 (713) 555-0143</p>
            </div>
          </div>

          <!-- Col 2: Servicios y Envíos -->
          <div class="footer-col">
            <h4 class="col-title">Servicios</h4>
            <ul class="col-links">
              <li><a routerLink="/">Cotizador en Tiempo Real</a></li>
              <li><a routerLink="/rastrear">Rastreo de Guías</a></li>
              <li><a routerLink="/centros-de-acopio">Centros de Acopio en EE. UU.</a></li>
              <li><a routerLink="/pedido-especial">Envíos Especiales y Tarimas</a></li>
              <li><a routerLink="/enviar">Generar Nuevo Envío</a></li>
            </ul>
          </div>

          <!-- Col 3: Guías de Ayuda -->
          <div class="footer-col">
            <h4 class="col-title">Información al Cliente</h4>
            <ul class="col-links">
              <li><a routerLink="/como-funciona">Cómo Funciona el Envío</a></li>
              <li><a routerLink="/que-puedo-enviar">Artículos Permitidos y Prohibidos</a></li>
              <li><a routerLink="/tiempos-de-entrega">Tiempos y Frecuencias</a></li>
              <li><a routerLink="/preguntas-frecuentes">Preguntas Frecuentes (FAQ)</a></li>
              <li><a routerLink="/ser-centro-de-acopio">Afíliate como Centro de Acopio</a></li>
            </ul>
          </div>

          <!-- Col 4: Mi Cuenta & Pagos -->
          <div class="footer-col">
            <h4 class="col-title">Portal de Clientes</h4>
            <ul class="col-links">
              <li><a routerLink="/cuenta">Iniciar Sesión / Registro</a></li>
              <li><a routerLink="/cuenta/envios">Historial de Mis Envíos</a></li>
              <li><a routerLink="/cuenta/direcciones">Mis Direcciones en México</a></li>
              <li><a routerLink="/contacto">Atención y Soporte</a></li>
            </ul>

            <div class="payment-methods">
              <span class="payment-title">Métodos Aceptados</span>
              <div class="payment-badges">
                <span class="p-badge">Stripe</span>
                <span class="p-badge">Visa</span>
                <span class="p-badge">Mastercard</span>
                <span class="p-badge">Amex</span>
                <span class="p-badge">PayPal</span>
                <span class="p-badge">Efectivo</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Copyright & Legal -->
        <div class="footer-bottom">
          <p class="copyright">
            © 2026 Kangoo Xpress Logistics LLC. {{ i18n.t('footer.rights') }}
          </p>
          <div class="legal-links">
            <a href="#terminos">Términos del Servicio</a>
            <span>•</span>
            <a href="#privacidad">Aviso de Privacidad</a>
            <span>•</span>
            <a href="#seguros">Póliza de Seguros</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-global {
      background-color: var(--kangoo-secondary);
      color: #FFFFFF;
      margin-top: auto;
      border-top: 4px solid var(--kangoo-primary);
    }

    .footer-trust-banner {
      background-color: var(--kangoo-secondary-dark);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 2rem 0;
    }

    .trust-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .trust-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .trust-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-lg);
      background: rgba(227, 27, 35, 0.15);
      color: var(--kangoo-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .trust-title {
      font-size: 1rem;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 0.25rem;
    }

    .trust-desc {
      font-size: 0.82rem;
      color: #94A3B8;
      line-height: 1.4;
    }

    .footer-main {
      padding: 4rem 1.25rem 2rem;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2.5rem;
      margin-bottom: 3.5rem;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: 2fr 1.2fr 1.2fr 1.2fr;
      }
    }

    .footer-bio {
      font-size: 0.88rem;
      color: #94A3B8;
      line-height: 1.6;
      margin-top: 1rem;
      margin-bottom: 1.25rem;
      max-width: 340px;
    }

    .footer-contact-info {
      font-size: 0.82rem;
      color: #CBD5E1;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      strong {
        color: #FFFFFF;
      }
    }

    .col-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 1.25rem;
      position: relative;
      padding-bottom: 0.5rem;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 24px;
        height: 2px;
        background: var(--kangoo-primary);
        border-radius: 2px;
      }
    }

    .col-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      a {
        font-size: 0.88rem;
        color: #94A3B8;
        transition: all var(--transition-fast);

        &:hover {
          color: #FFFFFF;
          padding-left: 4px;
        }
      }
    }

    .payment-methods {
      margin-top: 1.5rem;
    }

    .payment-title {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .payment-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }

    .p-badge {
      font-size: 0.7rem;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.1);
      color: #E2E8F0;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      font-size: 0.82rem;
      color: #94A3B8;

      @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
      }
    }

    .legal-links {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      a {
        color: #94A3B8;

        &:hover {
          color: #FFFFFF;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  readonly i18n = inject(I18nService);
}
