import { ListDecoratorType } from 'entities/EntityInterface';
import { getI18n } from 'react-i18next';

const ListDecoratorMultilang: ListDecoratorType = (props) => {
  const { field, row } = props;
  const value = row[field];
  const language = getI18n().language.substring(0, 2);

  return value[language];
};

export default ListDecoratorMultilang;
