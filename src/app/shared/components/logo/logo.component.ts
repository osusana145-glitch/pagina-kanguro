import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a routerLink="/" class="logo-link" aria-label="Kangoo Xpress - Inicio">
      <div class="logo-wrapper" [class.compact]="compact()">
        <!-- Kangaroo Dynamic Icon -->
        <svg class="kangaroo-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <!-- Speed Trajectory Arc -->
          <path d="M4 48C14 54 28 55 42 46" stroke="#0A2540" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 4"/>
          <!-- Kangaroo Silhouette in Brand Red -->
          <path d="M22 46C20 42 22 36 28 32C32 29 35 25 36 21C36.5 19 38 15 41 13C43 11.5 46 11 48 12C49.5 12.8 49 14.5 48 15.5C45.5 17.5 44 20 45 23C46.5 27 50 30 52 33C53 34.5 54 36.5 54 38.5C54 41 51 43 47 42C44 41.2 41 40 37 41C33 42 30 46 28 49C26 52 20 52 18 50C16.5 48.5 18 46 22 46Z" fill="#E31B23"/>
          <!-- Forward Motion Pouch Arc -->
          <path d="M33 34C35 37 39 38 43 38" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Kangaroo Ear & Eye Detail -->
          <circle cx="43" cy="14" r="1.5" fill="#FFFFFF"/>
          <path d="M44 11L48 5C48.5 4.5 49.5 5 49 6L46 12" stroke="#E31B23" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <div class="brand-text">
          <div class="brand-name">
            <span class="name-kangoo">KANGOO</span>
            <span class="name-xpress">XPRESS</span>
          </div>
          @if (!compact()) {
            <span class="brand-slogan">FAST & SAFE • EE. UU. A MÉXICO</span>
          }
        </div>
      </div>
    </a>
  `,
  styles: [`
    .logo-link {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      outline: none;

      &:focus-visible {
        outline: 2px solid var(--kangoo-primary);
        outline-offset: 4px;
        border-radius: 8px;
      }
    }

    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      &.compact {
        gap: 0.5rem;

        .kangaroo-icon {
          width: 36px;
          height: 36px;
        }

        .name-kangoo, .name-xpress {
          font-size: 1.3rem;
        }
      }
    }

    .kangaroo-icon {
      width: 44px;
      height: 44px;
      flex-shrink: 0;
      filter: drop-shadow(0 2px 4px rgba(227, 27, 35, 0.2));
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

      .logo-link:hover & {
        transform: translateY(-2px) scale(1.05);
      }
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }

    .brand-name {
      display: flex;
      align-items: center;
      font-family: var(--font-family-display);
      font-weight: 900;
      letter-spacing: -0.02em;
    }

    .name-kangoo {
      font-size: 1.55rem;
      color: var(--kangoo-secondary);
      letter-spacing: -0.01em;
    }

    .name-xpress {
      font-size: 1.55rem;
      color: var(--kangoo-primary);
      font-style: italic;
      margin-left: 0.15rem;
    }

    .brand-slogan {
      font-family: var(--font-family-body);
      font-size: 0.62rem;
      font-weight: 700;
      color: var(--kangoo-neutral-text);
      letter-spacing: 0.12em;
      margin-top: 0.15rem;
      text-transform: uppercase;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent {
  readonly compact = input<boolean>(false);
}
