import { useRef } from 'react';
import { Language } from 'store/i18n';
import { useFormikType } from 'services';
import { FormOnChangeEvent } from 'entities';

type Params = {
  formik?: useFormikType;
  languages: Array<Language>;
  changeHandler: (e: FormOnChangeEvent) => void;
};

interface LatestTyping {
  lang: string;
  value: string;
}

export const useMultilangSync = ({
  formik,
  languages,
  changeHandler,
}: Params) => {
  const propagateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const latestTypingRef = useRef<LatestTyping | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    changeHandler(e);

    const [fieldKey, currentLang] = e.target.name.split('.');
    const currentValue = e.target.value;

    latestTypingRef.current = { lang: currentLang, value: currentValue };

    if (propagateTimeoutRef.current) {
      clearTimeout(propagateTimeoutRef.current);
    }

    propagateTimeoutRef.current = setTimeout(() => {
      if (!latestTypingRef.current) {
        return;
      }

      const { lang: typingLang, value: typingValue } = latestTypingRef.current;

      const updatedValues: Record<string, string> = {};

      languages.forEach((lng) => {
        const locale = lng.locale?.split('-')[0] ?? 'en';

        const existingVal = formik?.values[fieldKey]?.[locale];

        updatedValues[locale] =
          locale === typingLang || !existingVal?.trim()
            ? typingValue
            : existingVal;
      });

      formik?.setFieldValue(fieldKey, updatedValues);
    }, 1800);
  };

  return { handleChange };
};
