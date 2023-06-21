import { Trans } from 'react-i18next';

export default function translate(
  key: string,
  values: any = {},
  components: any = {}
): React.ReactElement {
  const { count } = values;

  return (
    <Trans
      defaults={key}
      count={count}
      values={values}
      components={components}
    />
  );
}
