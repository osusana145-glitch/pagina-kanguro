import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { I18nService } from '../../../core/services/i18n.service';

/**
 * "Download on the App Store" / "Get it on Google Play" badges.
 * Each badge is a link when its store URL is known (from GET /site-content →
 * mobile_app); otherwise it renders as a plain badge, so nothing points to a dead link.
 * Swap in the official artwork from Apple/Google marketing resources before launch
 * if pixel-exact badges are required.
 */
@Component({
  selector: 'kx-store-badges',
  standalone: true,
  template: `
    <div class="badges" [class.on-dark]="onDark()">
      @if (iosUrl()) {
        <a class="store-badge" [href]="iosUrl()" target="_blank" rel="noopener noreferrer" [attr.aria-label]="i18n.t('store.iosAria')">
          <svg class="logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" [attr.d]="applePath"/></svg>
          <span class="text"><small>{{ i18n.t('store.iosLine1') }}</small><strong>App Store</strong></span>
        </a>
      } @else {
        <span class="store-badge static" role="img" [attr.aria-label]="i18n.t('store.iosAria')">
          <svg class="logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" [attr.d]="applePath"/></svg>
          <span class="text"><small>{{ i18n.t('store.iosLine1') }}</small><strong>App Store</strong></span>
        </span>
      }

      @if (androidUrl()) {
        <a class="store-badge" [href]="androidUrl()" target="_blank" rel="noopener noreferrer" [attr.aria-label]="i18n.t('store.androidAria')">
          <svg class="logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="#00A0FF" d="M3.61 1.81 13.39 11.6 3.61 21.38A1.5 1.5 0 0 1 3 20.2V3c0-.48.22-.92.61-1.19z"/>
            <path fill="#00F076" d="M16.81 8.18 13.39 11.6 3.61 1.81c.33-.23.77-.29 1.2-.08z"/>
            <path fill="#FF3A44" d="M16.81 15.02 4.81 21.47c-.43.21-.87.15-1.2-.09l9.78-9.78z"/>
            <path fill="#FFD500" d="M16.81 8.18 20.6 10.22q1.3 1.38 0 2.76L16.81 15.02 13.39 11.6z"/>
          </svg>
          <span class="text"><small>{{ i18n.t('store.androidLine1') }}</small><strong>Google Play</strong></span>
        </a>
      } @else {
        <span class="store-badge static" role="img" [attr.aria-label]="i18n.t('store.androidAria')">
          <svg class="logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="#00A0FF" d="M3.61 1.81 13.39 11.6 3.61 21.38A1.5 1.5 0 0 1 3 20.2V3c0-.48.22-.92.61-1.19z"/>
            <path fill="#00F076" d="M16.81 8.18 13.39 11.6 3.61 1.81c.33-.23.77-.29 1.2-.08z"/>
            <path fill="#FF3A44" d="M16.81 15.02 4.81 21.47c-.43.21-.87.15-1.2-.09l9.78-9.78z"/>
            <path fill="#FFD500" d="M16.81 8.18 20.6 10.22q1.3 1.38 0 2.76L16.81 15.02 13.39 11.6z"/>
          </svg>
          <span class="text"><small>{{ i18n.t('store.androidLine1') }}</small><strong>Google Play</strong></span>
        </span>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .badges { display: flex; flex-wrap: wrap; gap: .75rem; }
    .store-badge {
      display: inline-flex; align-items: center; gap: .625rem;
      min-height: 48px; min-width: 156px; padding: .375rem 1rem .375rem .75rem;
      background: #000; color: #fff; text-decoration: none;
      border: 1px solid #a6a6a6; border-radius: var(--kx-radius);
      transition: background-color var(--transition-fast);
    }
    a.store-badge:hover { background: #1e1f23; }
    a.store-badge:focus-visible { outline: 2px solid var(--kx-blue-600); outline-offset: 2px; }
    .on-dark a.store-badge:focus-visible { outline-color: #fff; }
    .logo { width: 26px; height: 26px; flex-shrink: 0; }
    .text { display: flex; flex-direction: column; line-height: 1.1; text-align: left; }
    .text small { font-size: .6875rem; font-weight: 500; letter-spacing: .01em; }
    .text strong { font-size: 1.1875rem; font-weight: 600; letter-spacing: -.01em; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreBadgesComponent {
  readonly i18n = inject(I18nService);
  readonly iosUrl = input<string | undefined>(undefined);
  readonly androidUrl = input<string | undefined>(undefined);
  /** Lighter focus ring for dark backgrounds (footer). */
  readonly onDark = input<boolean>(false);

  readonly applePath =
    'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701';
}
