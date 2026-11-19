import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { I18nService } from '../../../core/services/i18n.service';
import { ContactPayload } from '../../../core/models/api.models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [IconComponent, FormsModule],
  template: `
    <section class="form-page-section" aria-labelledby="contactTitle">
      <div class="container container-narrow">
        <div class="form-container-card">
          <header class="form-header">
            <span class="badge badge-neutral">{{ i18n.t('contact.badge') }}</span>
            <h1 id="contactTitle" class="form-title">{{ i18n.t('contact.title') }}</h1>
            <p class="form-desc">{{ i18n.t('contact.desc') }}</p>
          </header>

          <div class="contact-channels-grid">
            <div class="channel-card">
              <span class="channel-icon"><kx-icon name="phone" [size]="20" /></span>
              <h3 class="channel-name">{{ i18n.t('contact.phoneTitle') }}</h3>
              <p class="channel-val"><a href="tel:7078009318" class="channel-link">707-800-9318</a></p>
              <span class="channel-note">{{ i18n.t('contact.phoneNote') }}</span>
            </div>
            <div class="channel-card">
              <span class="channel-icon"><kx-icon name="message-circle" [size]="20" /></span>
              <h3 class="channel-name">{{ i18n.t('contact.waTitle') }}</h3>
              <p class="channel-val"><a href="https://api.whatsapp.com/send?phone=+17076127290" target="_blank" rel="noopener noreferrer" class="channel-link">+1 (707) 612-7290</a></p>
              <span class="channel-note">{{ i18n.t('contact.waNote') }}</span>
            </div>
            <div class="channel-card">
              <span class="channel-icon"><kx-icon name="mail" [size]="20" /></span>
              <h3 class="channel-name">{{ i18n.t('contact.emailTitle') }}</h3>
              <p class="channel-val"><a href="mailto:info@kangoo-xpress.com" class="channel-link">info@kangoo-xpress.com</a></p>
              <span class="channel-note">{{ i18n.t('contact.emailNote') }}</span>
            </div>
            <div class="channel-card">
              <span class="channel-icon"><kx-icon name="map-pin" [size]="20" /></span>
              <h3 class="channel-name">{{ i18n.t('contact.officeTitle') }}</h3>
              <p class="channel-val">321 Blodgett St Suite-A</p>
              <span class="channel-note">Cotati, CA 94931</span>
            </div>
          </div>

          @if (isSuccess()) {
            <div class="success-alert">
              <div class="success-icon"><kx-icon name="check" [size]="28" /></div>
              <h2 class="success-title">{{ i18n.t('contact.successTitle') }}</h2>
              <p class="success-desc">{{ i18n.t('contact.successDesc') }}</p>
              <button type="button" class="btn btn-secondary" (click)="resetForm()">{{ i18n.t('contact.sendAnother') }}</button>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" class="contact-form" #f="ngForm">
              <!-- Honeypot -->
              <div class="form-honeypot" aria-hidden="true">
                <input type="text" name="website" [(ngModel)]="honeypotValue" tabindex="-1" autocomplete="off" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="cFullName" class="form-label">{{ i18n.t('forms.fullName') }}</label>
                  <input id="cFullName" type="text" class="form-input" name="cFullName" [(ngModel)]="fullName" required [placeholder]="i18n.t('contact.namePh')" autocomplete="name" />
                </div>
                <div class="form-group">
                  <label for="cEmail" class="form-label">{{ i18n.t('forms.email') }}</label>
                  <input id="cEmail" type="email" class="form-input" name="cEmail" [(ngModel)]="email" required [placeholder]="i18n.t('forms.emailPh')" autocomplete="email" />
                </div>
              </div>

              <div class="form-group">
                <label for="cSubject" class="form-label">{{ i18n.t('contact.subject') }}</label>
                <select id="cSubject" class="form-select" name="cSubject" [(ngModel)]="subject" required>
                  <option value="" disabled selected>{{ i18n.t('contact.subjectPh') }}</option>
                  <option value="Duda sobre Cotización">{{ i18n.t('contact.subjectQuote') }}</option>
                  <option value="Estatus de mi Paquete">{{ i18n.t('contact.subjectStatus') }}</option>
                  <option value="Recolección a Domicilio">{{ i18n.t('contact.subjectPickup') }}</option>
                  <option value="Facturación y Pagos">{{ i18n.t('contact.subjectBilling') }}</option>
                  <option value="Otro">{{ i18n.t('contact.subjectOther') }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="cMessage" class="form-label">{{ i18n.t('contact.message') }}</label>
                <textarea id="cMessage" class="form-textarea" rows="4" name="cMessage" [(ngModel)]="message" required [placeholder]="i18n.t('contact.messagePh')"></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-lg submit-btn" [disabled]="isSubmitting() || !f.valid">
                @if (isSubmitting()) {
                  <span>{{ i18n.t('forms.sending') }}</span>
                } @else {
                  <span>{{ i18n.t('contact.send') }}</span>
                }
              </button>
            </form>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .channel-link { color: inherit; text-decoration: none; &:hover { color: var(--kx-blue-600); text-decoration: underline; } }
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
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
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
    .form-row { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
    @media (min-width: 640px) { .form-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }
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
