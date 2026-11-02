import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { I18nService } from '../../../core/services/i18n.service';
import { SavedAddress, PostalCodeLookup } from '../../../core/models/api.models';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="addresses-container">
      <header class="addr-header">
        <div>
          <h1 class="page-title">Libreta de Direcciones en México</h1>
          <p class="page-subtitle">Guarda y administra las direcciones de tus familiares para agilizar tus envíos.</p>
        </div>

        <button
          type="button"
          class="btn btn-primary btn-sm"
          (click)="showNewAddressModal.set(true)"
        >
          + Nueva Dirección
        </button>
      </header>

      <!-- Saved Addresses Grid -->
      <div class="addresses-grid">
        @for (addr of addresses(); track addr.id) {
          <article class="address-card" [class.default]="addr.is_default">
            <div class="card-head">
              <div class="alias-group">
                <span class="alias-title">{{ addr.alias }}</span>
                @if (addr.is_default) {
                  <span class="default-badge">Predeterminada</span>
                }
              </div>
              <span class="pin-icon">📍</span>
            </div>

            <h3 class="recipient-name">{{ addr.recipient_name }}</h3>
            <span class="recipient-phone">📞 {{ addr.phone }}</span>

            <p class="street-address">
              {{ addr.street }} #{{ addr.exterior_number }}
              @if (addr.interior_number) { (Int. {{ addr.interior_number }}) }
            </p>
            <p class="neighborhood-city">
              Col. {{ addr.neighborhood }}, CP {{ addr.postal_code }}
            </p>
            <p class="state-country">
              {{ addr.municipality }}, {{ addr.state }}, México
            </p>

            @if (addr.references) {
              <div class="references-box">
                <span class="ref-label">Referencias:</span>
                <span class="ref-text">{{ addr.references }}</span>
              </div>
            }
          </article>
        }
      </div>

      <!-- Add New Address Modal Dialog -->
      @if (showNewAddressModal()) {
        <div class="modal-backdrop" (click)="showNewAddressModal.set(false)">
          <div class="modal-dialog" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
            <div class="modal-head">
              <h2 class="modal-title">Agregar Nueva Dirección</h2>
              <button type="button" class="close-btn" (click)="showNewAddressModal.set(false)">✕</button>
            </div>

            <form (ngSubmit)="saveNewAddress()" class="modal-form" #f="ngForm">
              <div class="form-row">
                <div class="form-group">
                  <label for="alias" class="form-label">Alias de la Dirección *</label>
                  <input id="alias" type="text" class="form-input" [(ngModel)]="newAlias" name="alias" required placeholder="Ej. Casa Mamá / Tía Rosa" />
                </div>
                <div class="form-group">
                  <label for="recipient" class="form-label">Nombre del Destinatario *</label>
                  <input id="recipient" type="text" class="form-input" [(ngModel)]="newRecipient" name="recipient" required placeholder="Nombre completo" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="phone" class="form-label">Teléfono de Contacto (México) *</label>
                  <input id="phone" type="tel" class="form-input" [(ngModel)]="newPhone" name="phone" required placeholder="+52 (000) 000-0000" />
                </div>
                <!-- Postal Code Autocomplete -->
                <div class="form-group">
                  <label for="cp" class="form-label">
                    <span>Código Postal (5 dígitos) *</span>
                    @if (isLookingUpCp()) { <span class="hint">Buscando...</span> }
                  </label>
                  <input
                    id="cp"
                    type="text"
                    class="form-input"
                    maxlength="5"
                    [(ngModel)]="newCp"
                    (ngModelChange)="onCpLookup($event)"
                    name="cp"
                    required
                    placeholder="Ej. 72000"
                  />
                </div>
              </div>

              @if (cpData(); as cpInfo) {
                <div class="cp-lookup-result">
                  <span>Cobertura confirmada en <strong>{{ cpInfo.municipality }}, {{ cpInfo.state_name }}</strong></span>
                </div>
              }

              <div class="form-row">
                <div class="form-group">
                  <label for="street" class="form-label">Calle *</label>
                  <input id="street" type="text" class="form-input" [(ngModel)]="newStreet" name="street" required placeholder="Nombre de calle o avenida" />
                </div>
                <div class="form-group">
                  <label for="extNum" class="form-label">No. Exterior *</label>
                  <input id="extNum" type="text" class="form-input" [(ngModel)]="newExtNum" name="extNum" required placeholder="Ej. 124" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="neighborhood" class="form-label">Colonia / Asentamiento *</label>
                  <input id="neighborhood" type="text" class="form-input" [(ngModel)]="newNeighborhood" name="neighborhood" required placeholder="Nombre de la colonia" />
                </div>
                <div class="form-group">
                  <label for="state" class="form-label">Estado *</label>
                  <input id="state" type="text" class="form-input" [(ngModel)]="newState" name="state" required placeholder="Estado" />
                </div>
              </div>

              <div class="form-group">
                <label for="references" class="form-label">Referencias visuales del domicilio</label>
                <textarea id="references" class="form-textarea" rows="2" [(ngModel)]="newReferences" name="references" placeholder="Entre qué calles, color de fachada o señas particulares..."></textarea>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn btn-outline" (click)="showNewAddressModal.set(false)">Cancelar</button>
                <button type="submit" class="btn btn-primary" [disabled]="!f.valid">Guardar Dirección</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .addr-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--kangoo-border);
      padding-bottom: 1rem;
      gap: 1rem;
    }

    .page-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
    }

    .page-subtitle {
      font-size: 0.88rem;
      color: var(--kangoo-neutral-muted);
    }

    .addresses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .address-card {
      background: #FFFFFF;
      border: 1.5px solid var(--kangoo-border);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--kangoo-secondary);
        box-shadow: var(--shadow-sm);
      }

      &.default {
        border-color: var(--kangoo-primary);
        background: #FFFDFD;
      }
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .alias-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .alias-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
    }

    .default-badge {
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      background: var(--kangoo-primary-light);
      color: var(--kangoo-primary);
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-sm);
    }

    .recipient-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      margin-bottom: 0.2rem;
    }

    .recipient-phone {
      font-size: 0.82rem;
      color: var(--kangoo-neutral-muted);
      display: block;
      margin-bottom: 0.75rem;
    }

    .street-address, .neighborhood-city, .state-country {
      font-size: 0.85rem;
      color: var(--kangoo-neutral-text);
      line-height: 1.4;
    }

    .references-box {
      margin-top: 0.75rem;
      background: var(--kangoo-surface-bg);
      border-radius: var(--radius-md);
      padding: 0.5rem 0.75rem;
      font-size: 0.78rem;
    }

    .ref-label {
      font-weight: 700;
      color: var(--kangoo-secondary);
      margin-right: 0.35rem;
    }

    .ref-text {
      color: var(--kangoo-neutral-text);
    }

    // Modal
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10, 37, 64, 0.65);
      backdrop-filter: blur(4px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
    }

    .modal-dialog {
      background: #FFFFFF;
      border-radius: var(--radius-2xl);
      max-width: 600px;
      width: 100%;
      padding: 2rem;
      box-shadow: var(--shadow-xl);
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--kangoo-border);
      padding-bottom: 0.75rem;
    }

    .modal-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
    }

    .close-btn {
      background: transparent;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--kangoo-neutral-muted);

      &:hover { color: var(--kangoo-secondary); }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;

      @media (min-width: 600px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .cp-lookup-result {
      background: var(--kangoo-success-light);
      color: var(--kangoo-success-dark);
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-md);
      font-size: 0.82rem;
      margin-bottom: 1rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressesComponent {
  private readonly api = inject(ApiService);
  readonly i18n = inject(I18nService);

  readonly addresses = signal<SavedAddress[]>([]);
  readonly showNewAddressModal = signal<boolean>(false);
  readonly isLookingUpCp = signal<boolean>(false);
  readonly cpData = signal<PostalCodeLookup | null>(null);

  // New Address form bindings
  newAlias = '';
  newRecipient = '';
  newPhone = '';
  newCp = '';
  newStreet = '';
  newExtNum = '';
  newNeighborhood = '';
  newState = '';
  newReferences = '';

  constructor() {
    this.api.getUserAddresses().subscribe({
      next: list => this.addresses.set(list)
    });
  }

  onCpLookup(cp: string): void {
    const clean = cp.replace(/[^0-9]/g, '');
    if (clean.length === 5) {
      this.isLookingUpCp.set(true);
      this.api.lookupPostalCode(clean).subscribe({
        next: info => {
          this.isLookingUpCp.set(false);
          this.cpData.set(info);
          this.newState = info.state_name;
          if (info.settlements && info.settlements.length > 0) {
            this.newNeighborhood = info.settlements[0];
          }
        },
        error: () => this.isLookingUpCp.set(false)
      });
    } else {
      this.cpData.set(null);
    }
  }

  saveNewAddress(): void {
    const newEntry: SavedAddress = {
      id: `addr-${Date.now()}`,
      alias: this.newAlias,
      recipient_name: this.newRecipient,
      phone: this.newPhone,
      street: this.newStreet,
      exterior_number: this.newExtNum,
      postal_code: this.newCp,
      neighborhood: this.newNeighborhood,
      municipality: this.cpData()?.municipality || 'Municipio',
      state: this.newState,
      references: this.newReferences,
      is_default: this.addresses().length === 0
    };

    this.addresses.update(list => [newEntry, ...list]);
    this.showNewAddressModal.set(false);
    this.resetModalForm();
  }

  private resetModalForm(): void {
    this.newAlias = '';
    this.newRecipient = '';
    this.newPhone = '';
    this.newCp = '';
    this.newStreet = '';
    this.newExtNum = '';
    this.newNeighborhood = '';
    this.newState = '';
    this.newReferences = '';
    this.cpData.set(null);
  }
}
