import useCurrentPathMatch from '../../../hooks/useCurrentPathMatch';
import { useEffect, useState } from 'react';
import { useFormikType } from '../../../services/form/types';

type Values = Record<string, string | number>;

interface StoredValuesInterface {
  url: string;
  values: Values;
}

const useRememberedValues = function (formik: useFormikType): Values {
  const SESSION_STORAGE_KEY = 'form-values';

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

  const applyStoresValues =
    reloadedPage &&
    storedValues &&
    storedValues.url === match.pathname &&
    JSON.stringify(storedValues.values) !== JSON.stringify(response);

  if (applyStoresValues) {
    setResponse(storedValues.values);
  }

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

  return response;
};

export default useRememberedValues;
