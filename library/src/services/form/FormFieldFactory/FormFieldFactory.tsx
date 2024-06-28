import {
  InputAdornment,
  InputBaseProps,
  OutlinedInputProps,
} from '@mui/material';
import React, { RefObject } from 'react';
import { FormOnChangeEvent } from '../../../entities/DefaultEntityBehavior';
import {
  EmbeddableProperty,
  isPropertyEmbeddable,
  isPropertyFk,
  isPropertyScalar,
  PropertySpec,
  ScalarProperty,
} from '../../api/ParsedApiSpecInterface';
import EntityService from '../../entity/EntityService';
import {
  CustomFunctionComponentContext,
  PropertyCustomFunctionComponent,
} from '../../form/Field/CustomComponentWrapper';
import { DropdownChoices } from '../Field/Dropdown/Dropdown';
import { useFormikType } from '../types';
import {
  AutocompleteFactory,
  DateFactory,
  DateTimeFactory,
  DropdownFactory,
  FileUploadFactory,
  InputTextFactory,
  MultilangFactory,
  NumberFactory,
  PasswordFactory,
  SwitchFactory,
  TextareaFactory,
  TimeFactory,
  ColorFactory,
} from './Factory/index';

export type NullableFormFieldFactoryChoices = null | DropdownChoices;

export default class FormFieldFactory {
  constructor(
    private entityService: EntityService,
    public formik: useFormikType,
    private changeHandler: (event: FormOnChangeEvent) => void,
    private handleBlur: (event: React.FocusEvent) => void,
    private divRef?: RefObject<HTMLDivElement>
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
      </React.Fragment>
    );
  }

  public getProperty(fld: string): PropertySpec | null {
    const properties = this.entityService.getProperties();

    return properties[fld] as PropertySpec;
  }

  public getInputField(
    fld: string,
    property: PropertySpec,
    choices: NullableFormFieldFactoryChoices,
    readOnly: boolean
  ) {
    const {
      disabled,
      multiSelect,
      fileUpload,
      value,
      hasChanged,
      error,
      touched,
    } = this.parseInputFieldProperties(fld, property, readOnly);

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

    if (isPropertyFk(property) || multiSelect) {
      return (
        <AutocompleteFactory
          fld={fld}
          property={property}
          disabled={disabled}
          multiSelect={multiSelect}
          value={value}
          hasChanged={hasChanged}
          error={error}
          touched={touched}
          choices={choices}
          changeHandler={this.changeHandler}
          handleBlur={this.handleBlur}
        />
      );
    }

    if (isPropertyScalar(property) && property.enum) {
      return (
        <DropdownFactory
          fld={fld}
          property={property}
          disabled={disabled}
          value={value}
          hasChanged={hasChanged}
          error={error}
          touched={touched}
          choices={choices}
          changeHandler={this.changeHandler}
          handleBlur={this.handleBlur}
        />
      );
    }

    if (isPropertyScalar(property) && property.type === 'boolean') {
      return (
        <SwitchFactory
          fld={fld}
          property={property}
          disabled={disabled}
          value={value}
          hasChanged={hasChanged}
          choices={choices}
          changeHandler={this.changeHandler}
          handleBlur={this.handleBlur}
        />
      );
    }

    if (fileUpload) {
      return (
        <FileUploadFactory
          fld={fld}
          property={property as EmbeddableProperty}
          disabled={disabled}
          entityService={this.entityService}
          formik={this.formik}
          hasChanged={hasChanged}
          changeHandler={this.changeHandler}
          handleBlur={this.handleBlur}
        />
      );
    }

    const inputProps: InputBaseProps['inputProps'] = {};
    const InputProps: Partial<OutlinedInputProps> = {};

    if (property.prefix) {
      InputProps.startAdornment = (
        <InputAdornment position='start'>{property.prefix}</InputAdornment>
      );
    }

    if (property.suffix) {
      InputProps.endAdornment = (
        <InputAdornment position='end'>{property.suffix}</InputAdornment>
      );
    }

    if (
      isPropertyScalar(property) &&
      ['integer', 'number'].includes(property.type || '')
    ) {
      return (
        <NumberFactory
          fld={fld}
          property={property}
          disabled={disabled}
          value={value}
          hasChanged={hasChanged}
          error={error}
          touched={touched}
          inputProps={inputProps}
          InputProps={InputProps}
          changeHandler={this.changeHandler}
          handleBlur={this.handleBlur}
        />
      );
    }

    if (isPropertyScalar(property) && property.type === 'string') {
      if (property.format === 'date-time') {
        return (
          <DateTimeFactory
            fld={fld}
            property={property}
            disabled={disabled}
            value={value}
            hasChanged={hasChanged}
            error={error}
            touched={touched}
            InputProps={InputProps}
            changeHandler={this.changeHandler}
            handleBlur={this.handleBlur}
          />
        );
      }

      if (property.format === 'date') {
        return (
          <DateFactory
            fld={fld}
            property={property}
            disabled={disabled}
            value={value}
            hasChanged={hasChanged}
            error={error}
            touched={touched}
            InputProps={InputProps}
            changeHandler={this.changeHandler}
            handleBlur={this.handleBlur}
          />
        );
      }

      if (property.format === 'time') {
        return (
          <TimeFactory
            fld={fld}
            property={property}
            disabled={disabled}
            value={value}
            hasChanged={hasChanged}
            error={error}
            touched={touched}
            InputProps={InputProps}
            changeHandler={this.changeHandler}
            handleBlur={this.handleBlur}
          />
        );
      }

      if (property.maxLength) {
        inputProps.maxLength = property.maxLength;
      }

      if (property.format === 'textarea') {
        return (
          <TextareaFactory
            fld={fld}
            property={property}
            disabled={disabled}
            value={value}
            hasChanged={hasChanged}
            error={error}
            touched={touched}
            inputProps={inputProps}
            InputProps={InputProps}
            changeHandler={this.changeHandler}
            handleBlur={this.handleBlur}
          />
        );
      }

      if (property.format === 'password') {
        return (
          <PasswordFactory
            fld={fld}
            property={property}
            disabled={disabled}
            value={value}
            hasChanged={hasChanged}
            error={error}
            touched={touched}
            inputProps={inputProps}
            InputProps={InputProps}
            changeHandler={this.changeHandler}
            handleBlur={this.handleBlur}
          />
        );
      }

      if (property.format === 'color') {
        return (
          <ColorFactory
            fld={fld}
            parentRef={this.divRef}
            property={property}
            disabled={disabled}
            value={value}
            hasChanged={hasChanged}
            error={error}
            touched={touched}
            inputProps={inputProps}
            InputProps={InputProps}
            changeHandler={this.changeHandler}
            handleBlur={this.handleBlur}
          />
        );
      }

      return (
        <InputTextFactory
          fld={fld}
          property={property}
          disabled={disabled}
          value={value}
          hasChanged={hasChanged}
          error={error}
          touched={touched}
          inputProps={inputProps}
          InputProps={InputProps}
          changeHandler={this.changeHandler}
          handleBlur={this.handleBlur}
        />
      );
    }

    if (isPropertyEmbeddable(property) && property.multilang === true) {
      const properties = this.entityService.getAllProperties();

      return (
        <MultilangFactory
          fld={fld}
          properties={properties}
          property={property}
          disabled={disabled}
          formik={this.formik}
          hasChanged={hasChanged}
          inputProps={inputProps}
          InputProps={InputProps}
          changeHandler={this.changeHandler}
          handleBlur={this.handleBlur}
        />
      );
    }

    console.log('UNKNOWN FIELD TYPE', property);
    return <span>UNKNOWN FIELD TYPE {(property as ScalarProperty).type}</span>;
  }

  private parseInputFieldProperties(
    fld: string,
    property: PropertySpec,
    readOnly: boolean
  ) {
    const disabled = property.readOnly || readOnly;
    const multiSelect = (property as ScalarProperty).type === 'array';
    const fileUpload =
      isPropertyEmbeddable(property) && property.type === 'file';
    const valuePath = fld.split('.');
    const value =
      valuePath.length > 1
        ? this.formik.values[valuePath[0]][valuePath[1]]
        : this.formik.values[fld];

    const initialValue =
      valuePath.length > 1
        ? this.formik.values[valuePath[0]][valuePath[1]]
        : this.formik.initialValues[fld];
    const hasChanged = initialValue != value;

    const formikError = this.formik.errors;
    const error =
      valuePath.length > 1 && formikError[valuePath[0]]
        ? (formikError[valuePath[0]] as Record<string, React.ReactNode>)[
            valuePath[1]
          ]
        : (formikError[fld] as React.ReactNode);

    const formikTouched = this.formik.touched;
    const touched =
      valuePath.length > 1 && formikTouched[valuePath[0]]
        ? (formikTouched[valuePath[0]] as Record<string, boolean>)[valuePath[1]]
        : (formikTouched[fld] as undefined | boolean);

    return {
      disabled,
      multiSelect,
      fileUpload,
      value,
      hasChanged,
      error,
      touched,
    };
  }
}
