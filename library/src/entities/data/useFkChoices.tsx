import { useEffect, useState } from 'react';
import { PathMatch } from 'react-router-dom';
import axios from 'axios';
import { FkChoices } from '../DefaultEntityBehavior';
import { ForeignKeyGetterType } from '../EntityInterface';
import EntityService, {
  EntityValues,
} from '../../services/entity/EntityService';

export interface useFkChoicesArgs {
  foreignKeyGetter: ForeignKeyGetterType;
  entityService: EntityService;
  row?: EntityValues;
  match: PathMatch;
  skip?: Array<string>;
  disabled?: boolean;
}

const useFkChoices = (props: useFkChoicesArgs): FkChoices => {
  const { foreignKeyGetter, entityService, row, match, skip, disabled } = props;
  const [fkChoices, setFkChoices] = useState<FkChoices>({});

  useEffect(() => {
    if (disabled) {
      return;
    }

    let mounted = true;

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    foreignKeyGetter({
      cancelToken: source.token,
      entityService,
      row,
      match,
      skip,
    }).then((options) => {
      if (!mounted) {
        return;
      }

      setFkChoices((fkChoices: any) => {
        return {
          ...fkChoices,
          ...options,
        };
      });
    });

    return () => {
      mounted = false;
      source.cancel();
    };
  }, [foreignKeyGetter, entityService, row, match, disabled]);

  return fkChoices;
};

export default useFkChoices;
