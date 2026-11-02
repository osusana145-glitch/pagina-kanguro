import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { I18nService } from '../../../core/services/i18n.service';
import { UserShipmentSummary } from '../../../core/models/api.models';
import { StatusBadgeComponent } from '../../../shared/components/badge/status-badge.component';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent],
  template: `
    <div class="shipments-container">
      <header class="list-header">
        <div>
          <h1 class="page-title">Historial de Mis Envíos</h1>
          <p class="page-subtitle">Monitorea y descarga comprobantes de tus paquetes hacia México.</p>
        </div>

        <a routerLink="/" class="btn btn-primary btn-sm">
          <span>+ Nuevo Envío</span>
        </a>
      </header>

      <!-- Status Filter Tabs -->
      <div class="filter-tabs" role="group" aria-label="Filtrar envíos por estado">
        <button
          type="button"
          class="tab-pill"
          [class.active]="filterStatus() === 'ALL'"
          (click)="filterStatus.set('ALL')"
        >
          Todos ({{ shipments().length }})
        </button>
        <button
          type="button"
          class="tab-pill"
          [class.active]="filterStatus() === 'ACTIVE'"
          (click)="filterStatus.set('ACTIVE')"
        >
          En Curso / Aduana
        </button>
        <button
          type="button"
          class="tab-pill"
          [class.active]="filterStatus() === 'DELIVERED'"
          (click)="filterStatus.set('DELIVERED')"
        >
          Entregados
        </button>
        <button
          type="button"
          class="tab-pill"
          [class.active]="filterStatus() === 'PENDING'"
          (click)="filterStatus.set('PENDING')"
        >
          Pendientes de Pago
        </button>
      </div>

      <!-- Shipments Table / Responsive Cards -->
      <div class="shipments-grid">
        @for (item of filteredShipments(); track item.id) {
          <article class="shipment-card" [class.unpaid]="!item.is_paid">
            <div class="card-top">
              <div>
                <span class="ref-label">Referencia</span>
                <h2 class="ref-id">{{ item.reference_id }}</h2>
                @if (item.tracking_number) {
                  <span class="guide-num">Guía: {{ item.tracking_number }}</span>
                } @else {
                  <span class="guide-pending">Guía no asignada (Pendiente de pago)</span>
                }
              </div>

              <app-status-badge
                [label]="item.status_label"
                [tone]="item.status_tone"
              ></app-status-badge>
            </div>

            <div class="card-details-row">
              <div class="detail-col">
                <span class="d-label">Destinatario</span>
                <span class="d-val">{{ item.recipient_name }}</span>
              </div>
              <div class="detail-col">
                <span class="d-label">Destino</span>
                <span class="d-val">{{ item.destination_city }}</span>
              </div>
              <div class="detail-col">
                <span class="d-label">Fecha</span>
                <span class="d-val">{{ item.created_at }}</span>
              </div>
              <div class="detail-col">
                <span class="d-label">Monto Pagado</span>
                <!-- STRICT RULE: Display API formatted only -->
                <span class="d-val price">{{ item.total_formatted }}</span>
              </div>
            </div>

            <div class="card-bottom">
              @if (!item.is_paid) {
                <a [routerLink]="['/enviar']" class="btn btn-primary btn-sm">
                  <span>Pagar Ahora</span>
                </a>
              } @else {
                <a [routerLink]="['/cuenta/envios', item.reference_id]" class="btn btn-outline btn-sm">
                  <span>Ver Detalle y Comprobante</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              }

              @if (item.tracking_number) {
                <a [routerLink]="['/rastrear', item.tracking_number]" class="track-link">
                  Rastrear en Vivo ➔
                </a>
              }
            </div>
          </article>
        } @empty {
          <div class="empty-list">
            <p>No tienes envíos registrados bajo este filtro.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .list-header {
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

    .filter-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .tab-pill {
      background: var(--kangoo-surface-bg);
      border: 1px solid var(--kangoo-border);
      border-radius: var(--radius-full);
      padding: 0.35rem 0.85rem;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--kangoo-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: #FFFFFF;
      }

      &.active {
        background: var(--kangoo-secondary);
        color: #FFFFFF;
        border-color: var(--kangoo-secondary);
      }
    }

    .shipments-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .shipment-card {
      background: #FFFFFF;
      border: 1px solid var(--kangoo-border);
      border-radius: var(--radius-xl);
      padding: 1.25rem 1.5rem;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--kangoo-secondary);
        box-shadow: var(--shadow-sm);
      }

      &.unpaid {
        border-left: 4px solid var(--kangoo-warning);
        background: #FFFDF8;
      }
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .ref-label {
      font-size: 0.72rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--kangoo-neutral-muted);
      display: block;
    }

    .ref-id {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--kangoo-secondary);
      line-height: 1.2;
    }

    .guide-num {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--kangoo-primary);
    }

    .guide-pending {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--kangoo-warning-dark);
    }

    .card-details-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.85rem;
      padding: 0.85rem 0;
      border-top: 1px dashed var(--kangoo-border);
      border-bottom: 1px dashed var(--kangoo-border);
      margin-bottom: 1rem;

      @media (min-width: 640px) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .d-label {
      font-size: 0.72rem;
      color: var(--kangoo-neutral-muted);
      display: block;
      margin-bottom: 0.2rem;
    }

    .d-val {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--kangoo-secondary);

      &.price {
        color: var(--kangoo-primary);
        font-size: 1rem;
      }
    }

    .card-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .track-link {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--kangoo-secondary);

      &:hover {
        color: var(--kangoo-primary);
      }
    }

    .empty-list {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--kangoo-neutral-muted);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipmentListComponent {
  private readonly api = inject(ApiService);
  readonly i18n = inject(I18nService);

  readonly shipments = signal<UserShipmentSummary[]>([]);
  readonly filterStatus = signal<'ALL' | 'ACTIVE' | 'DELIVERED' | 'PENDING'>('ALL');

  constructor() {
    this.api.getUserShipments().subscribe({
      next: list => this.shipments.set(list)
    });
  }

  readonly filteredShipments = computed(() => {
    const list = this.shipments();
    const filter = this.filterStatus();

    if (filter === 'ACTIVE') {
      return list.filter(s => s.status === 'in_transit' || s.status === 'customs' || s.status === 'received');
    }
    if (filter === 'DELIVERED') {
      return list.filter(s => s.status === 'delivered');
    }
    if (filter === 'PENDING') {
      return list.filter(s => !s.is_paid || s.status === 'pending_payment');
    }
    return list;
  });
}
