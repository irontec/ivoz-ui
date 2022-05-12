import { EntityValues } from '../../services/entity/EntityService';
import {
    foreignKeyResolverProps, foreignKeyResolverType
} from '../EntityInterface';
import autoForeignKeyResolver from './AutoForeignKeyResolver';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const foreignKeyResolver: foreignKeyResolverType = async (
    props: foreignKeyResolverProps
): Promise<EntityValues> => {

    const promises = autoForeignKeyResolver(props);
    await Promise.all(promises);

    return props.data
};

export default foreignKeyResolver;