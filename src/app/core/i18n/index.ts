import { FeatureDictionary } from './types';
import { TRACKING_I18N } from './tracking.i18n';
import { CENTERS_I18N } from './centers.i18n';
import { MAP_I18N } from './map.i18n';
import { CONTENT_I18N } from './content.i18n';
import { CHECKOUT_I18N } from './checkout.i18n';
import { ACCOUNT_I18N } from './account.i18n';
import { FORMS_I18N } from './forms.i18n';
import { COMMON_I18N } from './common.i18n';

/** Per-page dictionaries merged into I18nService on top of the shared/home keys. */
export const FEATURE_DICTIONARIES: FeatureDictionary[] = [
  TRACKING_I18N,
  CENTERS_I18N,
  MAP_I18N,
  CONTENT_I18N,
  CHECKOUT_I18N,
  ACCOUNT_I18N,
  FORMS_I18N,
  COMMON_I18N
];
