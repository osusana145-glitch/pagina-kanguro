import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { StatusTone } from '../../../core/models/api.models';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="badge" [class]="'badge-' + tone()">
      <span class="badge-dot" [class]="'dot-' + tone()"></span>
      <span class="badge-text">{{ label() }}</span>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      line-height: 1;

      &-success {
        background-color: var(--kangoo-success-light);
        color: var(--kangoo-success-dark);
        border: 1px solid rgba(16, 185, 129, 0.35);
      }

      &-warning {
        background-color: var(--kangoo-warning-light);
        color: var(--kangoo-warning-dark);
        border: 1px solid rgba(245, 158, 11, 0.35);
      }

      &-info {
        background-color: var(--kangoo-info-customs-light);
        color: var(--kangoo-info-customs-dark);
        border: 1px solid rgba(37, 99, 235, 0.35);
      }

      &-danger {
        background-color: var(--kangoo-danger-light);
        color: var(--kangoo-danger);
        border: 1px solid rgba(239, 68, 68, 0.35);
      }

      &-neutral {
        background-color: var(--kangoo-surface-bg);
        color: var(--kangoo-neutral-text);
        border: 1px solid var(--kangoo-border);
      }
    }

    .badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;

      &.dot-success { background-color: var(--kangoo-success); }
      &.dot-warning { background-color: var(--kangoo-warning); }
      &.dot-info { background-color: var(--kangoo-info-customs); }
      &.dot-danger { background-color: var(--kangoo-danger); }
      &.dot-neutral { background-color: var(--kangoo-neutral-muted); }
    }

    .badge-text {
      white-space: nowrap;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBadgeComponent {
  readonly label = input.required<string>();
  readonly tone = input<StatusTone>('neutral');
}
