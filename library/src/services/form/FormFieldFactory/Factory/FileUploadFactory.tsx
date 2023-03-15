import { FormOnChangeEvent } from '../../../../entities/DefaultEntityBehavior/Form/Form';
import { EmbeddableProperty, FkProperty } from '../../../api';
import EntityService from '../../../entity/EntityService';
import FileUploader from '../../../form/Field/FileUploader';
import { useFormikType } from '../../../form/types';
import { NullableFormFieldFactoryChoices } from '../FormFieldFactory';

type FileUploadFactoryPropsType = {
  fld: string;
  property: EmbeddableProperty;
  disabled: boolean;
  hasChanged: boolean;
  choices: NullableFormFieldFactoryChoices;
  entityService: EntityService;
  formik: useFormikType;
  changeHandler: (event: FormOnChangeEvent) => void;
  handleBlur: (event: React.FocusEvent) => void;
};

export const FileUploadFactory = (
  props: FileUploadFactoryPropsType
): JSX.Element => {
  const {
    fld,
    disabled,
    hasChanged,
    property,
    changeHandler,
    handleBlur,
    entityService,
    formik,
  } = props;

  const downloadModel = property.$ref.split('/').pop();
  const downloadAction = entityService.getItemByModel(downloadModel ?? '');
  const paths = downloadAction?.paths || [];
  const downloadPath = paths.length
    ? paths.pop().replace('{id}', formik.values.id)
    : null;

  return (
    <FileUploader
      property={property as FkProperty}
      _columnName={fld}
      readOnly={disabled}
      disabled={disabled}
      formik={formik}
      values={formik.values}
      changeHandler={changeHandler}
      onBlur={handleBlur}
      downloadPath={downloadPath}
      hasChanged={hasChanged}
      choices={null}
    />
  );
};
