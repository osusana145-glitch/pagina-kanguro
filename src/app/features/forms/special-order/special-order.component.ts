import { MEXICAN_STATES_LIST } from '../../../core/services/mexican-postal-codes';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-special-order',
  standalone: true,
  imports: [IconComponent, FormsModule],
  template: `
    <section class="form-page-section" aria-labelledby="formTitle">
      <div class="container container-narrow">
        <div class="form-container-card">
          <header class="form-header">
            <span class="badge badge-neutral">{{ i18n.t('special.badge') }}</span>
            <h1 id="formTitle" class="form-title">{{ i18n.t('special.title') }}</h1>
            <p class="form-desc">{{ i18n.t('special.desc') }}</p>
          </header>

          @if (isSuccess()) {
            <div class="success-alert" role="status">
              <div class="success-icon"><kx-icon name="check" [size]="28" /></div>
              <h2 class="success-title">{{ i18n.t('special.successTitle') }}</h2>
              <p class="success-desc">{{ i18n.t('special.successDesc', { folio: folio() }) }}</p>
              <button type="button" class="btn btn-secondary" (click)="resetForm()">{{ i18n.t('forms.sendAnother') }}</button>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" class="special-form" #f="ngForm" novalidate>
              <!-- ANTI-SPAM HONEYPOT FIELD (Hidden from real users) -->
              <div class="form-honeypot" aria-hidden="true">
                <label for="honeypotWebsite">{{ i18n.t('special.honeypot') }}</label>
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
                  <label for="fullName" class="form-label">{{ i18n.t('forms.fullName') }}</label>
                  <input
                    id="fullName"
                    type="text"
                    class="form-input"
                    name="fullName"
                    [(ngModel)]="fullName"
                    required
                    [placeholder]="i18n.t('special.namePh')"
                    autocomplete="name"
                  />
                </div>

                <div class="form-group">
                  <label for="email" class="form-label">{{ i18n.t('forms.email') }}</label>
                  <input
                    id="email"
                    type="email"
                    class="form-input"
                    name="email"
                    [(ngModel)]="email"
                    required
                    [placeholder]="i18n.t('forms.emailPh')"
                    autocomplete="email"
                  />
                </div>
              </div>

              <!-- Phone & Origin City -->
              <div class="form-row">
                <div class="form-group">
                  <label for="phone" class="form-label">{{ i18n.t('special.phone') }}</label>
                  <input
                    id="phone"
                    type="tel"
                    class="form-input"
                    name="phone"
                    [(ngModel)]="phone"
                    required
                    placeholder="+1 (707) 000-0000"
                  />
                </div>

                <div class="form-group">
                  <label for="originCity" class="form-label">{{ i18n.t('special.origin') }}</label>
                  <input
                    id="originCity"
                    type="text"
                    class="form-input"
                    name="originCity"
                    [(ngModel)]="originCity"
                    required
                    [placeholder]="i18n.t('special.originPh')"
                  />
                </div>
              </div>

              <!-- Destination State in Mexico -->
              <div class="form-group">
                <label for="destState" class="form-label">{{ i18n.t('special.dest') }}</label>
                <select
                  id="destState"
                  class="form-select"
                  name="destState"
                  [(ngModel)]="destState"
                  required
                >
                  <option value="" disabled selected>{{ i18n.t('special.destPh') }}</option>
                  @for (st of mexicanStates; track st) {
                    <option [value]="st">{{ st }}</option>
                  }
                </select>
              </div>

              <!-- Item Description -->
              <div class="form-group">
                <label for="itemDescription" class="form-label">
                  <span>{{ i18n.t('special.item') }}</span>
                  <span class="hint">{{ i18n.t('special.itemHint') }}</span>
                </label>
                <textarea
                  id="itemDescription"
                  class="form-textarea"
                  rows="4"
                  name="itemDescription"
                  [(ngModel)]="itemDescription"
                  required
                  [placeholder]="i18n.t('special.itemPh')"
                ></textarea>
              </div>

              <!-- Multipart Photos Upload with Preview -->
              <div class="form-group">
                <label class="form-label">
                  <span>{{ i18n.t('special.photos') }}</span>
                  <span class="hint">{{ i18n.t('special.photosHint') }}</span>
                </label>
                <div class="file-dropzone" role="button" tabindex="0" (click)="fileInput.click()" (keydown.enter)="fileInput.click()" (keydown.space)="$event.preventDefault(); fileInput.click()">
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
                    <span class="dropzone-title">{{ i18n.t('special.dropTitle') }}</span>
                    <span class="dropzone-sub">{{ i18n.t('special.dropSub') }}</span>
                  </div>
                </div>

                @if (selectedFileNames().length > 0) {
                  <div class="files-preview-list">
                    @for (name of selectedFileNames(); track name) {
                      <span class="file-chip"><kx-icon name="camera" [size]="14" /> {{ name }}</span>
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
                  <span>{{ i18n.t('special.processing') }}</span>
                } @else {
                  <span>{{ i18n.t('special.submit') }}</span>
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
      grid-template-columns: minmax(0, 1fr);
      gap: 1rem;

      @media (min-width: 640px) {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
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
  readonly mexicanStates = MEXICAN_STATES_LIST;

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
