import { EntityValues } from '../../services/entity/EntityService';
import { foreignKeyResolverProps } from '../EntityInterface';
import _ from '../../services/translations/translate';
import genericForeignKeyResolver from '../../services/api/genericForeigKeyResolver';

const autoForeignKeyResolver = (
    props: foreignKeyResolverProps
): Array<Promise<EntityValues | EntityValues[]>> => {

    const { data, cancelToken, entityService, entities, skip } = props;
    if (!entities) {
        return [];
    }

    const promises = [];
    const fkProperties = entityService?.getFkProperties();

    for (const idx in fkProperties) {

        if (skip && skip.includes(idx)) {
            continue;
        }

        const ref = fkProperties[idx].$ref.replace('#/definitions/', '');
        const entity = entities[ref];

        if (!entity) {
            if (ref) {
                console.log('foreignKeyResolver', `${ref} not found`);
            }
            continue;
        }

        promises.push(
            genericForeignKeyResolver({
                data,
                fkFld: idx,
                entity: entity,
                cancelToken,
            })
        );
    }

    return promises;
};

export default autoForeignKeyResolver;