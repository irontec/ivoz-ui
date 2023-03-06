import {
  DropdownChoices,
  ListDecorator,
  NullableFormFieldFactoryChoices,
  ScalarProperty,
} from '@irontec/ivoz-ui';
import {
  PropertyCustomFunctionComponent,
  PropertyCustomFunctionComponentProps,
} from '@irontec/ivoz-ui/services/form/Field/CustomComponentWrapper';
import { useEffect, useState } from 'react';
import { FormikHelpers } from 'formik';
import { ClientPropertiesList, ClientPropertyList } from '../ClientProperties';
import { RemoteIdSelectOptions } from '../SelectOptions';

type RouteTypeValues = ClientPropertyList<string>;
type RouteTypeProps = PropertyCustomFunctionComponent<
  PropertyCustomFunctionComponentProps<RouteTypeValues>
>;

const RemoteId: RouteTypeProps = (props): JSX.Element | null => {
  const { _context, _columnName, property, values, formFieldFactory, formik } =
    props;
  const platformId = values?.platform as string | undefined;
  const remoteId = values?.remoteId as number | undefined;
  const setFieldValue = (formik as FormikHelpers<unknown>).setFieldValue;

  const [localChoices, setLocalChoices] =
    useState<NullableFormFieldFactoryChoices>(null);
  const [remotePbxs, setRemotePbxs] = useState<ClientPropertiesList>([]);

  useEffect(() => {
    if (!platformId) {
      return;
    }

    RemoteIdSelectOptions(
      {
        callback: (
          options: DropdownChoices,
          rows: undefined | ClientPropertiesList
        ) => {
          setFieldValue(_columnName, '');
          setLocalChoices(options);
          setRemotePbxs(rows || []);
        },
      },
      {
        platformId: platformId,
      }
    ).catch(() => {
      setFieldValue(_columnName, '');
      setLocalChoices(null);
      setRemotePbxs([]);
    });
  }, [_columnName, platformId, setFieldValue]);

  useEffect(() => {
    if (!remoteId) {
      setFieldValue('domain', '');
    }

    if (!remotePbxs.length) {
      return;
    }

    const targetPbx = remotePbxs.find((row) => row.id == remoteId);
    if (!targetPbx) {
      setFieldValue('domain', '');
      return;
    }

    setFieldValue('domain', targetPbx.domain);
  }, [remoteId, remotePbxs, setFieldValue]);

  if (_context === 'read' || !formFieldFactory) {
    return (
      <ListDecorator
        field={_columnName}
        row={values}
        property={property}
        ignoreCustomComponent={true}
      />
    );
  }

  const { readOnly } = props;

  const modifiedProperty = { ...property } as ScalarProperty;
  delete modifiedProperty.component;

  if (!localChoices) {
    return formFieldFactory.getInputField(
      _columnName,
      modifiedProperty,
      null,
      readOnly
    );
  }

  modifiedProperty.enum = localChoices;
  return formFieldFactory.getInputField(
    _columnName,
    modifiedProperty,
    localChoices,
    readOnly
  );
};

export default RemoteId;
