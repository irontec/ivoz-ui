import { FunctionComponent, useEffect, useState } from 'react';
import { FormProps } from '../entities/DefaultEntityBehavior/Form/Form';
import EntityInterface, { ViewType } from '../entities/EntityInterface';
import EntityService from '../services/entity/EntityService';
import withRowData from './withRowData';
import { Box } from '@mui/material';

type DetailComponentProps = {
  entityService: EntityService;
  row: any;
  View: () => Promise<ViewType>;
} & Pick<EntityInterface, 'foreignKeyResolver'> &
  Pick<FormProps, 'groups'>;

type DetailComponentType = FunctionComponent<DetailComponentProps>;

const Detail: DetailComponentType = (props) => {
  const { View: EntityViewLoader, row } = props;

  const [EntityView, setEntityView] = useState<ViewType | null>(null);

  useEffect(() => {
    EntityViewLoader().then((View) => {
      setEntityView(() => View);
    });
  }, []);

  if (!EntityView) {
    return null;
  }

  return (
    <Box className='card'>
      <EntityView {...props} row={row} />
    </Box>
  );
};

export default withRowData(Detail as FunctionComponent);
