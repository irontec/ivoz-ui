import React from 'react';
import {
  FormControlLabel,
  Switch,
  FormHelperText,
  LinearProgress,
  InputAdornment,
} from '@mui/material';
import {
  ScalarProperty,
  FkProperty,
  PropertySpec,
  isPropertyScalar,
  isPropertyFk,
} from '../api/ParsedApiSpecInterface';
import {
  CustomFunctionComponentContext,
  PropertyCustomFunctionComponent,
} from '../form/Field/CustomComponentWrapper';
import EntityService from '../entity/EntityService';
import { useFormikType } from './types';
import StyledDropdown from '../form/Field/Dropdown.styles';
import StyledAutocomplete from './Field/Autocomplete.styles';
import FileUploader from './Field/FileUploader';
import {
  StyledSwitchFormControl,
  StyledTextField,
  StyledLinearProgressContainer,
} from './FormFieldFactory.styles';
import {
  FormOnChangeEvent,
  PropertyFkChoices,
} from '../../entities/DefaultEntityBehavior';
import { DropdownChoices } from './Field';
import Multilang from './Field/Multilang';

export type NullableFormFieldFactoryChoices = null | DropdownChoices;

export default class FormFieldFactory {
  constructor(
    private entityService: EntityService,
    public formik: useFormikType,
    private changeHandler: (event: FormOnChangeEvent) => void,
    private handleBlur: (event: React.FocusEvent) => void
  ) {}

  public getFormField(
    fld: string,
    choices: NullableFormFieldFactoryChoices,
    readOnly = false
  ): JSX.Element | null {
    const property = this.getProperty(fld);
    if (!property) {
      console.error(`Property ${fld} was not found`);
      return null;
    }

    return this.createByPropertySpec(fld, property, choices, readOnly);
  }

  public createByPropertySpec(
    fld: string,
    property: PropertySpec,
    choices: NullableFormFieldFactoryChoices,
    readOnly = false
  ): JSX.Element | null {
    return (
      <React.Fragment>
        {this.getInputField(fld, property, choices, readOnly)}
        {property.helpText && (
          <FormHelperText variant={'outlined'}>
            {property.helpText}
          </FormHelperText>
        )}
      </React.Fragment>
    );
  }

  public getProperty(fld: string): PropertySpec {
    const properties = this.entityService.getProperties();

    return properties[fld] as PropertySpec;
  }

  public getInputField(
    fld: string,
    property: PropertySpec,
    choices: NullableFormFieldFactoryChoices,
    readOnly: boolean
  ) {
    const disabled = property.readOnly || readOnly;
    const multiSelect = (property as ScalarProperty).type === 'array';
    const fileUpload = (property as ScalarProperty).type === 'file';
    const valuePath = fld.split('.');
    const value = valuePath.length > 1
      ? this.formik.values[valuePath[0] as string][valuePath[1] as string]
      : this.formik.values[fld];

    const initialValue = valuePath.length > 1
      ? this.formik.values[valuePath[0] as string][valuePath[1] as string]
      : this.formik.initialValues[fld];
    const hasChanged = initialValue != value;

    if (property.component) {
      const PropertyComponent = (property as ScalarProperty)
        .component as PropertyCustomFunctionComponent<any>;

      return (
        <PropertyComponent
          _context={CustomFunctionComponentContext.write}
          _columnName={fld}
          readOnly={readOnly}
          formik={this.formik}
          values={this.formik.values}
          choices={choices}
          property={property}
          disabled={disabled}
          changeHandler={this.changeHandler}
          onBlur={this.handleBlur}
          formFieldFactory={this}
        />
      );
    }

    if (!fileUpload && (isPropertyFk(property) || multiSelect)) {
      if (!choices) {
        return (
          <StyledLinearProgressContainer>
            <LinearProgress />
          </StyledLinearProgressContainer>
        );
      }

      if (property.null && !multiSelect) {
        if (Array.isArray(choices)) {
          const nullAlreadyAssigned = choices.find(
            (item) => item.id == '__null__'
          );
          if (!nullAlreadyAssigned) {
            choices = [{ label: property.null, id: '__null__' }, ...choices];
          }
        } else {
          choices = {
            __null__: property.null,
            ...choices,
          };
        }
      }

      return (
        <StyledAutocomplete
          name={fld}
          label={property.label}
          value={value}
          multiple={multiSelect}
          required={property.required}
          disabled={disabled}
          onChange={this.changeHandler}
          onBlur={this.handleBlur}
          choices={choices}
          error={this.formik.touched[fld] && Boolean(this.formik.errors[fld])}
          helperText={
            this.formik.touched[fld] ? (this.formik.errors[fld] as string) : ''
          }
          hasChanged={hasChanged}
        />
      );
    }

    if (isPropertyScalar(property) && property.enum) {
      const enumValues = property.enum;
      if (Array.isArray(enumValues)) {
        choices = choices || {};
        for (const enumValue of enumValues) {
          choices[enumValue] = enumValue;
        }
      } else {
        choices = enumValues;
      }

      if (property.null) {
        if (Array.isArray(choices)) {
          choices.unshift({
            id: '__null__',
            label: property.null,
          });
        } else {
          choices = {
            __null__: property.null,
            ...(choices as PropertyFkChoices),
          };
        }
      }

      let booleanValue =
        typeof value === 'boolean'
          ? +value
          : value;

      if (booleanValue === null) {
        booleanValue = '__null__';
      }

      return (
        <StyledDropdown
          name={fld}
          label={property.label}
          value={booleanValue}
          required={property.required}
          disabled={disabled}
          onChange={this.changeHandler}
          onBlur={this.handleBlur}
          choices={choices as DropdownChoices}
          error={this.formik.touched[fld] && Boolean(this.formik.errors[fld])}
          helperText={
            this.formik.touched[fld] ? (this.formik.errors[fld] as string) : ''
          }
          hasChanged={hasChanged}
        />
      );
    }

    if (isPropertyScalar(property) && property.type === 'boolean') {
      const checked = Array.isArray(value)
        ? value.includes('1')
        : Boolean(value);

      return (
        <StyledSwitchFormControl hasChanged={hasChanged}>
          <FormControlLabel
            disabled={disabled}
            control={
              <Switch
                name={fld}
                checked={checked}
                onChange={this.changeHandler}
                onBlur={this.handleBlur}
                value={true}
              />
            }
            label={property.label}
          />
        </StyledSwitchFormControl>
      );
    }

    const inputProps: any = {};
    const InputProps: any = {};

    if (property.prefix) {
      InputProps.startAdornment = (
        <InputAdornment position='start'>{property.prefix}</InputAdornment>
      );
    }

    if (property.subfix) {
      InputProps.endAdornment = (
        <InputAdornment position='end'>{property.subfix}</InputAdornment>
      );
    }

    if (isPropertyFk(property) && fileUpload) {
      const downloadModel = property.$ref.split('/').pop();
      const downloadAction = this.entityService.getItemByModel(
        downloadModel ?? ''
      );
      const paths = downloadAction?.paths || [];
      const downloadPath = paths.length
        ? paths.pop().replace('{id}', this.formik.values.id)
        : null;

      return (
        <FileUploader
          property={property as FkProperty}
          _columnName={fld}
          readOnly={readOnly}
          disabled={disabled}
          formik={this.formik}
          values={this.formik.values}
          changeHandler={this.changeHandler}
          onBlur={this.handleBlur}
          downloadPath={downloadPath}
          hasChanged={hasChanged}
          choices={null}
        />
      );
    }

    if (
      isPropertyScalar(property) &&
      ['integer', 'number'].includes(property.type || '')
    ) {
      if (property.minimum !== undefined) {
        inputProps.min = property.minimum;
      }

      if (property.maximum !== undefined) {
        inputProps.max = property.maximum;
      }

      return (
        <StyledTextField
          name={fld}
          type='number'
          value={value}
          disabled={disabled}
          label={property.label}
          required={property.required}
          onChange={this.changeHandler}
          onBlur={this.handleBlur}
          error={this.formik.touched[fld] && Boolean(this.formik.errors[fld])}
          helperText={
            this.formik.touched[fld] &&
            (this.formik.errors[fld] as React.ReactNode)
          }
          inputProps={inputProps}
          InputProps={InputProps}
          hasChanged={hasChanged}
        />
      );
    }

    if (isPropertyScalar(property) && property.type === 'string') {
      if (property.format === 'date-time') {
        return (
          <StyledTextField
            name={fld}
            type='datetime-local'
            value={value}
            inputProps={{
              step: 1,
            }}
            disabled={disabled}
            label={property.label}
            required={property.required}
            onChange={this.changeHandler}
            onBlur={this.handleBlur}
            error={this.formik.touched[fld] && Boolean(this.formik.errors[fld])}
            helperText={
              this.formik.touched[fld] &&
              (this.formik.errors[fld] as React.ReactNode)
            }
            fullWidth={true}
            InputProps={InputProps}
            hasChanged={hasChanged}
          />
        );
      }

      if (property.format === 'date') {
        return (
          <StyledTextField
            name={fld}
            type='date'
            value={value}
            disabled={disabled}
            label={property.label}
            required={property.required}
            onChange={this.changeHandler}
            onBlur={this.handleBlur}
            error={this.formik.touched[fld] && Boolean(this.formik.errors[fld])}
            helperText={
              this.formik.touched[fld] &&
              (this.formik.errors[fld] as React.ReactNode)
            }
            InputProps={InputProps}
            hasChanged={hasChanged}
          />
        );
      }

      if (property.format === 'time') {
        return (
          <StyledTextField
            name={fld}
            type='time'
            value={value}
            disabled={disabled}
            label={property.label}
            required={property.required}
            onChange={this.changeHandler}
            onBlur={this.handleBlur}
            error={this.formik.touched[fld] && Boolean(this.formik.errors[fld])}
            helperText={
              this.formik.touched[fld] &&
              (this.formik.errors[fld] as React.ReactNode)
            }
            InputProps={InputProps}
            hasChanged={hasChanged}
          />
        );
      }

      if (property.maxLength) {
        inputProps.maxLength = property.maxLength;
      }

      if (property.format === 'textarea') {
        return (
          <StyledTextField
            name={fld}
            type='text'
            multiline={true}
            value={value}
            disabled={disabled}
            label={property.label}
            required={property.required}
            onChange={this.changeHandler}
            onBlur={this.handleBlur}
            error={this.formik.touched[fld] && Boolean(this.formik.errors[fld])}
            helperText={
              this.formik.touched[fld] &&
              (this.formik.errors[fld] as React.ReactNode)
            }
            InputProps={InputProps}
            inputProps={inputProps}
            hasChanged={hasChanged}
          />
        );
      }

      if (property.format === 'password') {
        return (
          <StyledTextField
            name={fld}
            type={'password'}
            value={value}
            disabled={disabled}
            label={property.label}
            required={property.required}
            onChange={this.changeHandler}
            onBlur={this.handleBlur}
            error={this.formik.touched[fld] && Boolean(this.formik.errors[fld])}
            helperText={
              this.formik.touched[fld] &&
              (this.formik.errors[fld] as React.ReactNode)
            }
            InputProps={InputProps}
            inputProps={inputProps}
            hasChanged={hasChanged}
          />
        );
      }

      return (
        <StyledTextField
          name={fld}
          type='text'
          multiline={false}
          value={value}
          disabled={disabled}
          label={property.label}
          required={property.required}
          onChange={this.changeHandler}
          onBlur={this.handleBlur}
          error={this.formik.touched[fld] && Boolean(this.formik.errors[fld])}
          helperText={
            this.formik.touched[fld] &&
            (this.formik.errors[fld] as React.ReactNode)
          }
          InputProps={InputProps}
          inputProps={inputProps}
          hasChanged={hasChanged}
        />
      );
    }

    if (isPropertyScalar(property) && property.multilang === true) {
      return (
        <Multilang
          property={property as FkProperty}
          _columnName={fld}
          readOnly={readOnly}
          disabled={disabled}
          formik={this.formik}
          values={this.formik.values}
          changeHandler={this.changeHandler}
          onBlur={this.handleBlur}
          hasChanged={hasChanged}
          choices={null}
        />
      );
    }

    console.log('TODO FIELD TYPE', property);
    return <span>TODO FIELD TYPE {(property as ScalarProperty).type}</span>;
  }
}
