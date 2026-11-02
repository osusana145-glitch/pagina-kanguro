import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerCenterPayload } from '../../../core/models/api.models';

@Component({
  selector: 'app-partner-center',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="form-page-section" aria-labelledby="partnerTitle">
      <div class="container container-narrow">
        <div class="form-container-card">
          <header class="form-header">
            <span class="badge badge-success">Oportunidad de Negocio</span>
            <h1 id="partnerTitle" class="form-title">Conviértete en Centro de Acopio Kangoo</h1>
            <p class="form-desc">
              Si cuentas con un local comercial, tienda de abarrotes, negocio de envíos de dinero o bodega en Estados Unidos, genera ingresos recurrentes comisionando por cada caja recibida y vendida.
            </p>
          </header>

          @if (isSuccess()) {
            <div class="success-alert">
              <div class="success-icon">✓</div>
              <h2 class="success-title">¡Solicitud de Alianza Recibida!</h2>
              <p class="success-desc">
                Nuestro gerente de operaciones para la zona de <strong>{{ city }}, {{ state }}</strong> se pondrá en contacto contigo en un plazo de 24 a 48 horas hábiles.
              </p>
              <button type="button" class="btn btn-secondary" (click)="resetForm()">Enviar otra solicitud</button>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" class="partner-form" #f="ngForm">
              <!-- Honeypot -->
              <div class="form-honeypot" aria-hidden="true">
                <input type="text" name="website" [(ngModel)]="honeypotValue" tabindex="-1" autocomplete="off" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="bName" class="form-label">Nombre del Negocio o Tienda *</label>
                  <input id="bName" type="text" class="form-input" name="bName" [(ngModel)]="businessName" required placeholder="Ej. Abarrotes San Juan / Envios Express" />
                </div>
                <div class="form-group">
                  <label for="cName" class="form-label">Nombre del Responsable / Propietario *</label>
                  <input id="cName" type="text" class="form-input" name="cName" [(ngModel)]="contactName" required placeholder="Ej. Juan Pérez" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="pEmail" class="form-label">Correo Electrónico *</label>
                  <input id="pEmail" type="email" class="form-input" name="pEmail" [(ngModel)]="email" required placeholder="contacto@minegocio.com" />
                </div>
                <div class="form-group">
                  <label for="pPhone" class="form-label">Teléfono Directo *</label>
                  <input id="pPhone" type="tel" class="form-input" name="pPhone" [(ngModel)]="phone" required placeholder="+1 (000) 000-0000" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="pCity" class="form-label">Ciudad *</label>
                  <input id="pCity" type="text" class="form-input" name="pCity" [(ngModel)]="city" required placeholder="Ej. Dallas" />
                </div>
                <div class="form-group">
                  <label for="pState" class="form-label">Estado (USA) *</label>
                  <select id="pState" class="form-select" name="pState" [(ngModel)]="state" required>
                    <option value="" disabled selected>Selecciona Estado...</option>
                    <option value="TX">Texas (TX)</option>
                    <option value="CA">California (CA)</option>
                    <option value="IL">Illinois (IL)</option>
                    <option value="GA">Georgia (GA)</option>
                    <option value="FL">Florida (FL)</option>
                    <option value="NC">North Carolina (NC)</option>
                    <option value="OTRO">Otro Estado</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="pComments" class="form-label">
                  <span>Comentarios Adicionales</span>
                  <span class="hint">Horario de tu tienda, experiencia previa en envíos</span>
                </label>
                <textarea id="pComments" class="form-textarea" rows="3" name="pComments" [(ngModel)]="comments" placeholder="Tenemos una tienda con afluencia diaria de 200 personas y espacio disponible..."></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-lg submit-btn" [disabled]="isSubmitting() || !f.valid">
                @if (isSubmitting()) {
                  <span>Enviando solicitud...</span>
                } @else {
                  <span>Postular mi Negocio como Centro de Acopio</span>
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
    .form-desc { font-size: 0.95rem; color: var(--kangoo-neutral-text); line-height: 1.5; }
    .form-row { display: grid; grid-template-columns: 1fr; gap: 1rem; }
    @media (min-width: 640px) { .form-row { grid-template-columns: 1fr 1fr; } }
    .submit-btn { width: 100%; margin-top: 1.5rem; }
    .success-alert { text-align: center; padding: 2.5rem 1rem; }
    .success-icon { width: 64px; height: 64px; border-radius: 50%; background: var(--kangoo-success-light); color: var(--kangoo-success-dark); font-size: 2rem; font-weight: 900; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
    .success-title { font-size: 1.6rem; font-weight: 800; color: var(--kangoo-secondary); margin-bottom: 0.5rem; }
    .success-desc { font-size: 0.95rem; color: var(--kangoo-neutral-text); margin-bottom: 1.5rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnerCenterComponent {
  private readonly api = inject(ApiService);
  readonly i18n = inject(I18nService);

  honeypotValue = '';
  businessName = '';
  contactName = '';
  email = '';
  phone = '';
  city = '';
  state = '';
  comments = '';

  readonly isSubmitting = signal<boolean>(false);
  readonly isSuccess = signal<boolean>(false);

  onSubmit(): void {
    if (this.honeypotValue.trim() !== '') return;

    this.isSubmitting.set(true);
    const payload: PartnerCenterPayload = {
      website: '',
      businessName: this.businessName,
      contactName: this.contactName,
      email: this.email,
      phone: this.phone,
      city: this.city,
      state: this.state,
      storageCapacitySqFt: 300,
      hasForklift: false,
      comments: this.comments
    };

    this.api.submitPartnerForm(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  resetForm(): void {
    this.businessName = '';
    this.contactName = '';
    this.email = '';
    this.phone = '';
    this.city = '';
    this.state = '';
    this.comments = '';
    this.isSuccess.set(false);
  }
}
