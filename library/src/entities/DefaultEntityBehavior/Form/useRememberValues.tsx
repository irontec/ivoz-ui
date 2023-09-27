import useCurrentPathMatch from '../../../hooks/useCurrentPathMatch';
import { useEffect, useState } from 'react';
import { useFormikType } from '../../../services/form/types';

type Values = Record<string, string | number>;

interface StoredValuesInterface {
  url: string;
  values: Values;
}

const SESSION_STORAGE_KEY = 'ivoz-ui-stored-form-values';

const useStoredValues = function (): Values {
  const match = useCurrentPathMatch();
  const [response, setResponse] = useState({});

  const storedValues: StoredValuesInterface | null = JSON.parse(
    sessionStorage.getItem(SESSION_STORAGE_KEY) as string
  );

  const reloadedPage = window?.performance
    ?.getEntriesByType('navigation')
    .filter((nav) => nav.name === window?.location.href)
    .map((nav) => (nav as PerformanceNavigationTiming).type)
    .includes('reload');

  const applyStoredValues =
    reloadedPage &&
    storedValues &&
    storedValues.url === match.pathname &&
    JSON.stringify(storedValues.values) !== JSON.stringify(response);

  if (applyStoredValues) {
    setResponse(storedValues.values);
  }

  return response;
};

const useRememberValues = function (formik: useFormikType): void {
  const match = useCurrentPathMatch();

  useEffect(() => {
    const onUnload = () => {
      const changedValues: Record<string, string | number> = {};
      for (const idx in formik.values) {
        if (formik.values[idx] === formik.initialValues[idx]) {
          continue;
        }

        changedValues[idx] = formik.values[idx];
      }

      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          url: match.pathname,
          values: changedValues,
        })
      );
    };

    window.onbeforeunload = onUnload;
    return () => {
      window.onbeforeunload = null;
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    };
  }, [formik]);
};

export { useRememberValues, useStoredValues };
