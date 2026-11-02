import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { I18nService } from '../../../core/services/i18n.service';
import { ContactPayload } from '../../../core/models/api.models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="form-page-section" aria-labelledby="contactTitle">
      <div class="container container-narrow">
        <div class="form-container-card">
          <header class="form-header">
            <span class="badge badge-neutral">Atención Personalizada</span>
            <h1 id="contactTitle" class="form-title">Ponte en Contacto con Kangoo Xpress</h1>
            <p class="form-desc">
              Estamos aquí para resolver cualquier duda sobre tus envíos, cotizaciones corporativas o rastreo de paquetes.
            </p>
          </header>

          <div class="contact-channels-grid">
            <div class="channel-card">
              <span class="channel-icon">📞</span>
              <h3 class="channel-name">Teléfono EE. UU.</h3>
              <p class="channel-val">+1 (713) 555-0142</p>
              <span class="channel-note">Lun-Sáb: 9am - 6:30pm</span>
            </div>
            <div class="channel-card">
              <span class="channel-icon">💬</span>
              <h3 class="channel-name">WhatsApp Directo</h3>
              <p class="channel-val">+1 (713) 555-0143</p>
              <span class="channel-note">Atención rápida en línea</span>
            </div>
          </div>

          @if (isSuccess()) {
            <div class="success-alert">
              <div class="success-icon">✓</div>
              <h2 class="success-title">¡Mensaje Enviado con Éxito!</h2>
              <p class="success-desc">
                Gracias por escribirnos. Uno de nuestros asesores te responderá a la brevedad posible.
              </p>
              <button type="button" class="btn btn-secondary" (click)="resetForm()">Enviar otro mensaje</button>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" class="contact-form" #f="ngForm">
              <!-- Honeypot -->
              <div class="form-honeypot" aria-hidden="true">
                <input type="text" name="website" [(ngModel)]="honeypotValue" tabindex="-1" autocomplete="off" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="cFullName" class="form-label">Nombre Completo *</label>
                  <input id="cFullName" type="text" class="form-input" name="cFullName" [(ngModel)]="fullName" required placeholder="Tu nombre" />
                </div>
                <div class="form-group">
                  <label for="cEmail" class="form-label">Correo Electrónico *</label>
                  <input id="cEmail" type="email" class="form-input" name="cEmail" [(ngModel)]="email" required placeholder="tucorreo@ejemplo.com" />
                </div>
              </div>

              <div class="form-group">
                <label for="cSubject" class="form-label">Asunto del Mensaje *</label>
                <select id="cSubject" class="form-select" name="cSubject" [(ngModel)]="subject" required>
                  <option value="" disabled selected>Selecciona el tema de tu consulta...</option>
                  <option value="Duda sobre Cotización">Duda sobre Cotización</option>
                  <option value="Estatus de mi Paquete">Estatus de mi Paquete</option>
                  <option value="Recolección a Domicilio">Recolección a Domicilio en EE. UU.</option>
                  <option value="Facturación y Pagos">Facturación y Pagos</option>
                  <option value="Otro">Otro Asunto</option>
                </select>
              </div>

              <div class="form-group">
                <label for="cMessage" class="form-label">Mensaje o Detalle *</label>
                <textarea id="cMessage" class="form-textarea" rows="4" name="cMessage" [(ngModel)]="message" required placeholder="¿En qué te podemos apoyar hoy?"></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-lg submit-btn" [disabled]="isSubmitting() || !f.valid">
                @if (isSubmitting()) {
                  <span>Enviando...</span>
                } @else {
                  <span>Enviar Mensaje</span>
                }
              </button>
            </form>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .form-page-section {
      padding: 3.5rem 1.25rem 5rem;
      background: var(--kangoo-surface-bg);
      min-height: calc(100vh - 120px);
    }
    .form-container-card {
      background: #FFFFFF;
      border-radius: var(--radius-2xl);
      border: 1px solid var(--kangoo-border);
      box-shadow: var(--shadow-md);
      padding: 2.5rem;
    }
    .form-header { text-align: center; margin-bottom: 2rem; }
    .form-title { font-size: 2rem; font-weight: 800; color: var(--kangoo-secondary); margin: 0.5rem 0; }
    .form-desc { font-size: 0.95rem; color: var(--kangoo-neutral-text); }
    .contact-channels-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .channel-card {
      background: var(--kangoo-surface-bg);
      border: 1px solid var(--kangoo-border);
      border-radius: var(--radius-xl);
      padding: 1.25rem;
      text-align: center;
    }
    .channel-icon { font-size: 1.5rem; display: block; margin-bottom: 0.35rem; }
    .channel-name { font-size: 0.88rem; font-weight: 700; color: var(--kangoo-secondary); }
    .channel-val { font-size: 1rem; font-weight: 800; color: var(--kangoo-primary); margin: 0.2rem 0; }
    .channel-note { font-size: 0.75rem; color: var(--kangoo-neutral-muted); }
    .form-row { display: grid; grid-template-columns: 1fr; gap: 1rem; }
    @media (min-width: 640px) { .form-row { grid-template-columns: 1fr 1fr; } }
    .submit-btn { width: 100%; margin-top: 1rem; }
    .success-alert { text-align: center; padding: 2.5rem 1rem; }
    .success-icon { width: 64px; height: 64px; border-radius: 50%; background: var(--kangoo-success-light); color: var(--kangoo-success-dark); font-size: 2rem; font-weight: 900; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
    .success-title { font-size: 1.6rem; font-weight: 800; color: var(--kangoo-secondary); margin-bottom: 0.5rem; }
    .success-desc { font-size: 0.95rem; color: var(--kangoo-neutral-text); margin-bottom: 1.5rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private readonly api = inject(ApiService);
  readonly i18n = inject(I18nService);

  honeypotValue = '';
  fullName = '';
  email = '';
  subject = '';
  message = '';

  readonly isSubmitting = signal<boolean>(false);
  readonly isSuccess = signal<boolean>(false);

  onSubmit(): void {
    if (this.honeypotValue.trim() !== '') return;

    this.isSubmitting.set(true);
    const payload: ContactPayload = {
      website: '',
      fullName: this.fullName,
      email: this.email,
      subject: this.subject,
      message: this.message
    };

    this.api.submitContactForm(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  resetForm(): void {
    this.fullName = '';
    this.email = '';
    this.subject = '';
    this.message = '';
    this.isSuccess.set(false);
  }
}
