import { Link } from 'react-router-dom';
import EntityService from '../../../services/entity/EntityService';
import _ from '../../../services/translations/translate';
import { SolidButton } from '../../shared/Button/Button.styles';
import { useTranslation } from 'react-i18next';
import { Box, Fade } from '@mui/material';
import { useStoreState } from '../../../store';
import { GlobalFunctionComponent, MultiSelectFunctionComponent } from 'router';
import { MultiselectMoreChildEntityLinks } from './Shared/MultiselectMoreChildEntityLinks';

export interface EmptyProps {
  entityService: EntityService;
  className?: string;
}

export const Empty = (props: EmptyProps): JSX.Element => {
  const { entityService, className } = props;
  const { t } = useTranslation();

  const entity = entityService.getEntity();
  const parentRow = useStoreState((state) => state.list.parentRow);
  const acls = entityService.getAcls(parentRow);
  const { create = false } = acls;

  let singularTitle, pluralTitle;
  const title = entity.title;
  if (typeof title === 'string') {
    singularTitle = pluralTitle = title.toLowerCase();
  } else {
    const translationKey = title.props.defaults;
    singularTitle = t(translationKey, { count: 1 }).toLowerCase();
    pluralTitle = t(translationKey, { count: 2 }).toLowerCase();
  }
  const globalActions = Object.values(entity.customActions).filter(
    (action) => action.global
  );

  return (
    <Fade
      in={true}
      style={{
        transitionDelay: '750ms',
      }}
      unmountOnExit
    >
      <section className={className}>
        <img src='assets/img/empty.svg' alt='' />
        <h3>{_('No {{entity}} yet', { entity: pluralTitle })}</h3>
        <p>
          {_('You haven’t created any {{entity}} yet.', {
            entity: singularTitle,
          })}
        </p>
        {create && (
          <Box className='empty-actions'>
            {globalActions &&
              globalActions.length < 2 &&
              globalActions
                .map(
                  (item) =>
                    item.action as
                      | MultiSelectFunctionComponent
                      | GlobalFunctionComponent
                )
                .map((Action, key) => {
                  return (
                    <Action
                      key={key}
                      rows={[]}
                      selectedValues={[]}
                      entityService={entityService}
                    />
                  );
                })}
            {globalActions && globalActions.length > 1 && (
              <MultiselectMoreChildEntityLinks
                childActions={globalActions}
                selectedValues={[]}
                rows={[]}
                entityService={entityService}
              />
            )}

            <Link to={location.pathname + '/create'}>
              <SolidButton>
                {_('New {{entity}}', { entity: singularTitle })}
              </SolidButton>
            </Link>
          </Box>
        )}
      </section>
    </Fade>
  );
};

export default Empty;
