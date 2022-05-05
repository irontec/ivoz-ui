import { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useFormikType } from '../../services/form/types';

type Values = Record<string, string | number>;

interface StoredValuesInterface {
  url: string,
  values: Record<string, string | number>
}

const useRememberedValues = function (formik: useFormikType): Record<string, string | number> {

  const SESSION_STORAGE_KEY = 'form-values';

  const match = useRouteMatch();
  const [response, setResponse] = useState({});

  const storedValues: StoredValuesInterface|null = JSON.parse(
    sessionStorage.getItem(SESSION_STORAGE_KEY) as string
  );

  const applyStoresValues =
    storedValues
    && storedValues.url === match.url
    && JSON.stringify(storedValues.values) !== JSON.stringify(response);

  if (applyStoresValues) {
    setResponse(storedValues.values);
  }

  useEffect(
    () => {

      const onUnload = () => {

        const reloadingPage = window
          ?.performance
          ?.getEntriesByType('navigation')
          .filter((nav) => nav.name === window?.location.href)
          .map((nav) => (nav as PerformanceNavigationTiming).type)
          .includes('reload')

        if (!reloadingPage) {
          return;
        }

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
            url: match.url,
            values: changedValues
          })
        )
      };

      window.onbeforeunload = onUnload;
      return () => {
        window.onbeforeunload = null;
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    },
    [formik]
  );

  return response;
}

export default useRememberedValues;