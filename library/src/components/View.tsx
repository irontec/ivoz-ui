import { FunctionComponent, useEffect, useState } from 'react';
import { FormProps } from '../entities/DefaultEntityBehavior/Form/Form';
import EntityInterface, { ViewType } from '../entities/EntityInterface';
import EntityService from '../services/entity/EntityService';
import withRowData from './withRowData';

type ViewComponentProps = {
  entityService: EntityService;
  row: any;
  View: () => Promise<ViewType>;
} & Pick<EntityInterface, 'foreignKeyResolver'> &
  Pick<FormProps, 'groups'>;

type ViewComponentType = FunctionComponent<ViewComponentProps>;

const View: ViewComponentType = (props) => {
  const {
    View: EntityViewLoader,
    row,
    entityService,
    foreignKeyResolver: foreignKeyResolverLoader,
  } = props;
  const [parsedData, setParsedData] = useState<any>({});
  const [foreignKeysResolved, setForeignKeysResolved] =
    useState<boolean>(false);

  const [EntityView, setEntityView] = useState<ViewType | null>(null);

  useEffect(() => {
    EntityViewLoader().then((View) => {
      setEntityView(() => View);
    });
  }, []);

  // flat detailed model
  foreignKeyResolverLoader().then((foreignKeyResolver) =>
    foreignKeyResolver({ data: row, allowLinks: true, entityService }).then(
      (data) => {
        setParsedData(data);
        setForeignKeysResolved(true);
      }
    )
  );

  if (!foreignKeysResolved) {
    return null;
  }

  if (!EntityView) {
    return null;
  }

  return <EntityView {...props} row={parsedData} />;
};

export default withRowData(View as FunctionComponent);
