import ca from './ca';
import IvozUiCa from '@irontec/ivoz-ui/translations/ca';
import en from './en';
import IvozUiEn from '@irontec/ivoz-ui/translations/en';
import es from './es';
import IvozUiEs from '@irontec/ivoz-ui/translations/es';
import it from './it';
import IvozUiIt from '@irontec/ivoz-ui/translations/it';

const translations = {
  es: {
    translation: {
      ...IvozUiEs,
      ...es
    },
  },
  en: {
    translation: {
      ...IvozUiEn,
      ...en
    },
  },
  ca: {
    translation: {
      ...IvozUiCa,
      ...ca
    },
  },
  it: {
    translation: {
      ...IvozUiIt,
      ...it
    },
  },
};

export default translations;
