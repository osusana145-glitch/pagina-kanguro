import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { I18nService } from '../../../core/services/i18n.service';
import { PartnerCenterPayload } from '../../../core/models/api.models';

@Component({
  selector: 'app-partner-center',
  standalone: true,
  imports: [IconComponent, FormsModule],
  template: `
    <section class="form-page-section" aria-labelledby="partnerTitle">
      <div class="container container-narrow">
        <div class="form-container-card">
          <header class="form-header">
            <span class="badge badge-success">{{ i18n.t('partner.badge') }}</span>
            <h1 id="partnerTitle" class="form-title">{{ i18n.t('partner.title') }}</h1>
            <p class="form-desc">{{ i18n.t('partner.desc') }}</p>
          </header>

          @if (isSuccess()) {
            <div class="success-alert">
              <div class="success-icon"><kx-icon name="check" [size]="28" /></div>
              <h2 class="success-title">{{ i18n.t('partner.successTitle') }}</h2>
              <p class="success-desc">{{ i18n.t('partner.successDesc', { city: city, state: state }) }}</p>
              <button type="button" class="btn btn-secondary" (click)="resetForm()">{{ i18n.t('forms.sendAnother') }}</button>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" class="partner-form" #f="ngForm">
              <!-- Honeypot -->
              <div class="form-honeypot" aria-hidden="true">
                <input type="text" name="website" [(ngModel)]="honeypotValue" tabindex="-1" autocomplete="off" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="bName" class="form-label">{{ i18n.t('partner.businessName') }}</label>
                  <input id="bName" type="text" class="form-input" name="bName" [(ngModel)]="businessName" required [placeholder]="i18n.t('partner.businessNamePh')" autocomplete="organization" />
                </div>
                <div class="form-group">
                  <label for="cName" class="form-label">{{ i18n.t('partner.contactName') }}</label>
                  <input id="cName" type="text" class="form-input" name="cName" [(ngModel)]="contactName" required [placeholder]="i18n.t('partner.contactNamePh')" autocomplete="name" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="pEmail" class="form-label">{{ i18n.t('forms.email') }}</label>
                  <input id="pEmail" type="email" class="form-input" name="pEmail" [(ngModel)]="email" required [placeholder]="i18n.t('partner.emailPh')" autocomplete="email" />
                </div>
                <div class="form-group">
                  <label for="pPhone" class="form-label">{{ i18n.t('partner.phone') }}</label>
                  <input id="pPhone" type="tel" class="form-input" name="pPhone" [(ngModel)]="phone" required placeholder="+1 (000) 000-0000" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="pCity" class="form-label">{{ i18n.t('partner.city') }}</label>
                  <input id="pCity" type="text" class="form-input" name="pCity" [(ngModel)]="city" required [placeholder]="i18n.t('partner.cityPh')" />
                </div>
                <div class="form-group">
                  <label for="pState" class="form-label">{{ i18n.t('partner.state') }}</label>
                  <select id="pState" class="form-select" name="pState" [(ngModel)]="state" required>
                    <option value="" disabled selected>{{ i18n.t('partner.statePh') }}</option>
                    <option value="CA">California (CA)</option>
                    <option value="TX">Texas (TX)</option>
                    <option value="NV">Nevada (NV)</option>
                    <option value="AZ">Arizona (AZ)</option>
                    <option value="IL">Illinois (IL)</option>
                    <option value="OTRO">{{ i18n.t('partner.stateOther') }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="pComments" class="form-label">
                  <span>{{ i18n.t('partner.comments') }}</span>
                  <span class="hint">{{ i18n.t('partner.commentsHint') }}</span>
                </label>
                <textarea id="pComments" class="form-textarea" rows="3" name="pComments" [(ngModel)]="comments" [placeholder]="i18n.t('partner.commentsPh')"></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-lg submit-btn" [disabled]="isSubmitting() || !f.valid">
                @if (isSubmitting()) {
                  <span>{{ i18n.t('partner.sending') }}</span>
                } @else {
                  <span>{{ i18n.t('partner.submit') }}</span>
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
    .form-row { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
    @media (min-width: 640px) { .form-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }
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
