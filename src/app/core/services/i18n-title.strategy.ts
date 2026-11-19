import { Injectable, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { I18nService } from './i18n.service';

/**
 * Route `title` values are i18n keys (e.g. 'title.home'). This strategy
 * translates them and re-applies the document title when the language changes.
 */
@Injectable({ providedIn: 'root' })
export class I18nTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18n = inject(I18nService);
  private readonly currentKey = signal<string>('title.home');

  constructor() {
    super();
    effect(() => {
      this.title.setTitle(this.i18n.t(this.currentKey()));
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.currentKey.set(this.buildTitle(snapshot) ?? 'title.home');
    this.title.setTitle(this.i18n.t(this.currentKey()));
  }
}
