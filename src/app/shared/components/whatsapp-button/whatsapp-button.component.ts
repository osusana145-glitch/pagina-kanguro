import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  template: `
    <aside class="whatsapp-float-container" aria-label="Atención por WhatsApp">
      <a
        [href]="whatsappUrl()"
        target="_blank"
        rel="noopener noreferrer"
        class="whatsapp-btn"
        aria-label="Contactar a Kangoo Xpress por WhatsApp"
      >
        <span class="tooltip-bubble">{{ tooltipText() }}</span>
        <div class="whatsapp-circle">
          <svg viewBox="0 0 32 32" fill="none" class="whatsapp-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16 2C8.268 2 2 8.268 2 16C2 18.665 2.748 21.16 4.053 23.292L2.5 29.5L8.91 27.979C10.985 29.243 13.407 29.999 16 29.999C23.732 29.999 30 23.732 30 16C30 8.268 23.732 2 16 2ZM23.018 20.375C22.688 21.303 21.385 22.062 20.448 22.259C19.809 22.392 18.981 22.497 16.175 21.332C12.585 19.843 10.272 16.208 10.093 15.968C9.914 15.729 8.641 14.041 8.641 12.298C8.641 10.556 9.526 9.711 9.885 9.352C10.184 9.053 10.672 8.922 11.139 8.922C11.289 8.922 11.424 8.929 11.543 8.935C11.892 8.951 12.067 8.972 12.296 9.522C12.584 10.219 13.284 11.932 13.374 12.112C13.464 12.292 13.553 12.532 13.434 12.771C13.314 13.011 13.214 13.111 13.035 13.32C12.855 13.53 12.685 13.689 12.505 13.918C12.341 14.118 12.152 14.327 12.351 14.667C12.551 15.006 13.239 16.128 14.256 17.034C15.568 18.201 16.634 18.57 17.013 18.73C17.312 18.86 17.671 18.83 17.89 18.591C18.17 18.281 18.508 17.783 18.857 17.295C19.106 16.946 19.426 16.996 19.805 17.135C20.194 17.265 22.257 18.281 22.676 18.491C23.095 18.701 23.374 18.8 23.474 18.97C23.573 19.139 23.573 19.957 23.018 20.375Z" fill="white"/>
          </svg>
        </div>
      </a>
    </aside>
  `,
  styles: [`
    .whatsapp-float-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 999;
      display: flex;
      align-items: center;
    }

    .whatsapp-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      position: relative;

      &:hover .tooltip-bubble {
        opacity: 1;
        transform: translateX(0);
        visibility: visible;
      }
    }

    .tooltip-bubble {
      background: var(--kangoo-secondary);
      color: #FFFFFF;
      font-size: 0.82rem;
      font-weight: 600;
      padding: 0.5rem 0.9rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      white-space: nowrap;
      opacity: 0;
      transform: translateX(8px);
      visibility: hidden;
      transition: all var(--transition-normal);
      pointer-events: none;
      border: 1px solid rgba(255, 255, 255, 0.15);

      @media (max-width: 640px) {
        display: none;
      }
    }

    .whatsapp-circle {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #25D366;
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform var(--transition-bounce), box-shadow var(--transition-normal);

      &:hover {
        transform: scale(1.08) translateY(-2px);
        box-shadow: 0 8px 26px rgba(37, 211, 102, 0.6);
      }
    }

    .whatsapp-icon {
      width: 34px;
      height: 34px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatsappButtonComponent {
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: any) => e.urlAfterRedirects || e.url)
    ),
    { initialValue: this.router.url }
  );

  readonly tooltipText = computed(() => {
    const url = this.currentUrl() || '';
    if (url.includes('rastrear')) return '¿Dudas con tu rastreo? Chatea aquí';
    if (url.includes('enviar') || url.includes('checkout')) return 'Asesoría para tu envío';
    if (url.includes('pedido-especial')) return 'Cotiza carga pesada por WhatsApp';
    return '¿Ayuda con tus envíos a México?';
  });

  readonly whatsappUrl = computed(() => {
    const url = this.currentUrl() || '';
    let message = 'Hola Kangoo Xpress, me gustaría recibir información sobre sus envíos de EE. UU. a México.';
    
    if (url.includes('rastrear')) {
      message = 'Hola Kangoo Xpress, necesito ayuda con el estatus de rastreo de mi paquete.';
    } else if (url.includes('enviar')) {
      message = 'Hola Kangoo Xpress, tengo una duda durante el proceso de envío y cotización.';
    } else if (url.includes('pedido-especial')) {
      message = 'Hola Kangoo Xpress, me gustaría cotizar una carga especial o de volumen extraordinario.';
    } else if (url.includes('centros-de-acopio')) {
      message = 'Hola Kangoo Xpress, quisiera información sobre el centro de acopio más cercano para entregar mi caja.';
    }

    const phoneNumber = '17135550143'; // Official WhatsApp business number
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  });
}
