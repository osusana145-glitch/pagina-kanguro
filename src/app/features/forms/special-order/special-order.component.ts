import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-special-order',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="form-page-section" aria-labelledby="formTitle">
      <div class="container container-narrow">
        <div class="form-container-card">
          <header class="form-header">
            <span class="badge badge-neutral">Cargas Extraordinarias</span>
            <h1 id="formTitle" class="form-title">Cotización de Pedido Especial</h1>
            <p class="form-desc">
              ¿Deseas enviar tarimas completas, maquinaria pesada, herramientas industriales o mudanzas? Llena este formulario y nuestro equipo de logística aduanal te enviará una propuesta formal en menos de 24 horas.
            </p>
          </header>

          @if (isSuccess()) {
            <div class="success-alert" role="status">
              <div class="success-icon">✓</div>
              <h2 class="success-title">¡Solicitud de Carga Recibida!</h2>
              <p class="success-desc">
                Hemos asignado el folio <strong>#ESP-{{ folio() }}</strong> a tu solicitud. Un asesor especializado en logística aduanal revisará tus fotografías y te contactará por teléfono y correo.
              </p>
              <button type="button" class="btn btn-secondary" (click)="resetForm()">Enviar otra solicitud</button>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" class="special-form" #f="ngForm" novalidate>
              <!-- ANTI-SPAM HONEYPOT FIELD (Hidden from real users) -->
              <div class="form-honeypot" aria-hidden="true">
                <label for="honeypotWebsite">No llenar si eres humano</label>
                <input
                  id="honeypotWebsite"
                  type="text"
                  name="website"
                  [(ngModel)]="honeypotValue"
                  tabindex="-1"
                  autocomplete="off"
                />
              </div>

              <!-- Full Name & Email -->
              <div class="form-row">
                <div class="form-group">
                  <label for="fullName" class="form-label">Nombre Completo *</label>
                  <input
                    id="fullName"
                    type="text"
                    class="form-input"
                    name="fullName"
                    [(ngModel)]="fullName"
                    required
                    placeholder="Ej. Roberto Morales"
                  />
                </div>

                <div class="form-group">
                  <label for="email" class="form-label">Correo Electrónico *</label>
                  <input
                    id="email"
                    type="email"
                    class="form-input"
                    name="email"
                    [(ngModel)]="email"
                    required
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>
              </div>

              <!-- Phone & Origin City -->
              <div class="form-row">
                <div class="form-group">
                  <label for="phone" class="form-label">Teléfono / WhatsApp en EE. UU. *</label>
                  <input
                    id="phone"
                    type="tel"
                    class="form-input"
                    name="phone"
                    [(ngModel)]="phone"
                    required
                    placeholder="+1 (713) 000-0000"
                  />
                </div>

                <div class="form-group">
                  <label for="originCity" class="form-label">Ciudad y Estado de Origen (USA) *</label>
                  <input
                    id="originCity"
                    type="text"
                    class="form-input"
                    name="originCity"
                    [(ngModel)]="originCity"
                    required
                    placeholder="Ej. Houston, TX"
                  />
                </div>
              </div>

              <!-- Destination State in Mexico -->
              <div class="form-group">
                <label for="destState" class="form-label">Estado de Destino en México *</label>
                <select
                  id="destState"
                  class="form-select"
                  name="destState"
                  [(ngModel)]="destState"
                  required
                >
                  <option value="" disabled selected>Selecciona el estado destino...</option>
                  <option value="Puebla">Puebla</option>
                  <option value="Jalisco">Jalisco</option>
                  <option value="Michoacán">Michoacán</option>
                  <option value="Ciudad de México">Ciudad de México</option>
                  <option value="Nuevo León">Nuevo León</option>
                  <option value="Guanajuato">Guanajuato</option>
                  <option value="Estado de México">Estado de México</option>
                  <option value="Veracruz">Veracruz</option>
                  <option value="Guerrero">Guerrero</option>
                  <option value="Oaxaca">Oaxaca</option>
                  <option value="San Luis Potosí">San Luis Potosí</option>
                  <option value="Zacatecas">Zacatecas</option>
                  <option value="Otro Estado">Otro Estado</option>
                </select>
              </div>

              <!-- Item Description -->
              <div class="form-group">
                <label for="itemDescription" class="form-label">
                  <span>Descripción Detallada de la Mercancía *</span>
                  <span class="hint">Dimensiones aprox., contenido y peso</span>
                </label>
                <textarea
                  id="itemDescription"
                  class="form-textarea"
                  rows="4"
                  name="itemDescription"
                  [(ngModel)]="itemDescription"
                  required
                  placeholder="Ej. 2 tarimas de refacciones automotrices empacadas y 1 torno mecánico seminuevo. Peso aproximado 800 lb..."
                ></textarea>
              </div>

              <!-- Multipart Photos Upload with Preview -->
              <div class="form-group">
                <label class="form-label">
                  <span>Fotografías de la Mercancía</span>
                  <span class="hint">Opcional pero muy recomendado para aduanas</span>
                </label>
                <div class="file-dropzone" (click)="fileInput.click()">
                  <input
                    #fileInput
                    type="file"
                    multiple
                    accept="image/*"
                    (change)="onFileSelected($event)"
                    style="display: none;"
                  />
                  <div class="dropzone-content">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    <span class="dropzone-title">Haz clic aquí para subir fotos</span>
                    <span class="dropzone-sub">Archivos JPG o PNG (Hasta 5 imágenes)</span>
                  </div>
                </div>

                @if (selectedFileNames().length > 0) {
                  <div class="files-preview-list">
                    @for (name of selectedFileNames(); track name) {
                      <span class="file-chip">📷 {{ name }}</span>
                    }
                  </div>
                }
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="btn btn-primary btn-lg submit-btn"
                [disabled]="isSubmitting() || !f.valid"
              >
                @if (isSubmitting()) {
                  <span class="btn-spinner"></span>
                  <span>Procesando solicitud...</span>
                } @else {
                  <span>Solicitar Cotización de Carga Especial</span>
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

      @media (max-width: 640px) {
        padding: 1.5rem;
      }
    }

    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-title {
      font-size: 2rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      margin-top: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .form-desc {
      font-size: 0.95rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.5;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;

      @media (min-width: 640px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .file-dropzone {
      border: 2px dashed var(--kangoo-border);
      border-radius: var(--radius-xl);
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      background: var(--kangoo-surface-bg);
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--kangoo-primary);
        background: var(--kangoo-primary-light);
      }
    }

    .upload-icon {
      color: var(--kangoo-primary);
      margin-bottom: 0.5rem;
    }

    .dropzone-title {
      display: block;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
    }

    .dropzone-sub {
      font-size: 0.78rem;
      color: var(--kangoo-neutral-muted);
    }

    .files-preview-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .file-chip {
      font-size: 0.78rem;
      font-weight: 600;
      background: var(--kangoo-surface-bg);
      border: 1px solid var(--kangoo-border);
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-sm);
    }

    .submit-btn {
      width: 100%;
      margin-top: 1.5rem;
    }

    .btn-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid #FFFFFF;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .success-alert {
      text-align: center;
      padding: 2.5rem 1rem;
    }

    .success-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--kangoo-success-light);
      color: var(--kangoo-success-dark);
      font-size: 2rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
    }

    .success-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      margin-bottom: 0.5rem;
    }

    .success-desc {
      font-size: 0.95rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.5;
      margin-bottom: 1.75rem;
      max-width: 520px;
      margin-left: auto;
      margin-right: auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialOrderComponent {
  private readonly api = inject(ApiService);
  readonly i18n = inject(I18nService);

  // Form Fields
  honeypotValue = ''; // Must remain empty
  fullName = '';
  email = '';
  phone = '';
  originCity = '';
  destState = '';
  itemDescription = '';
  selectedFiles: File[] = [];

  readonly selectedFileNames = signal<string[]>([]);
  readonly isSubmitting = signal<boolean>(false);
  readonly isSuccess = signal<boolean>(false);
  readonly folio = signal<string>('');

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
      this.selectedFileNames.set(this.selectedFiles.map(f => f.name));
    }
  }

  onSubmit(): void {
    // Honeypot check: If filled, silently drop or reject spam
    if (this.honeypotValue.trim() !== '') {
      console.warn('Spam bot detected via honeypot field');
      return;
    }

    this.isSubmitting.set(true);

    const formData = new FormData();
    formData.append('fullName', this.fullName);
    formData.append('email', this.email);
    formData.append('phone', this.phone);
    formData.append('originCity', this.originCity);
    formData.append('destState', this.destState);
    formData.append('itemDescription', this.itemDescription);

    this.selectedFiles.forEach((file, index) => {
      formData.append(`photo_${index}`, file);
    });

    this.api.submitSpecialOrder(formData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.folio.set(Math.floor(1000 + Math.random() * 9000).toString());
        this.isSuccess.set(true);
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  resetForm(): void {
    this.fullName = '';
    this.email = '';
    this.phone = '';
    this.originCity = '';
    this.destState = '';
    this.itemDescription = '';
    this.selectedFiles = [];
    this.selectedFileNames.set([]);
    this.isSuccess.set(false);
  }
}
