import { useEffect, useState } from 'react';
import { match } from 'react-router-dom';
import axios from 'axios';
import { FkChoices } from '../DefaultEntityBehavior';
import { ForeignKeyGetterType } from '../EntityInterface';
import EntityService, { EntityValues } from '../../services/entity/EntityService';


interface useFkChoicesArgs {
    foreignKeyGetter: ForeignKeyGetterType,
    entityService: EntityService,
    row?: EntityValues,
    match: match,
    skip?: Array<string>,
}

const useFkChoices = (props: useFkChoicesArgs): FkChoices => {

    const { foreignKeyGetter, entityService, row, match, skip } = props;
    const [fkChoices, setFkChoices] = useState<FkChoices>({});

    useEffect(
        () => {

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
                        ...options
                    }
                });
            });

            return () => {
                mounted = false;
                source.cancel();
            }
        },
        [foreignKeyGetter, entityService, row, match]
    );

    return fkChoices;
}

export default useFkChoices;