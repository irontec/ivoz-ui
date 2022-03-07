import { FkChoices } from 'entities/DefaultEntityBehavior';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ForeignKeyGetterType } from 'entities/EntityInterface';
import EntityService from 'services/entity/EntityService';

const useFkChoices = (foreignKeyGetter: ForeignKeyGetterType, entityService: EntityService): FkChoices => {

    const [fkChoices, setFkChoices] = useState<FkChoices>({});

    useEffect(
        () => {

            let mounted = true;

            const CancelToken = axios.CancelToken;
            const source = CancelToken.source();

            foreignKeyGetter({
                cancelToken: source.token,
                entityService
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
        [foreignKeyGetter, entityService]
    );

    return fkChoices;
}

export default useFkChoices;