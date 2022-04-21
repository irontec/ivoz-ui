import { FormikComputedProps, FormikHandlers, FormikHelpers, FormikState } from 'formik';
import { FormOnChangeEvent } from '../../../entities/DefaultEntityBehavior';
import { PropertySpec } from '../../api/ParsedApiSpecInterface';
import FormFieldFactory, { NullableFormFieldFactoryChoices } from '../FormFieldFactory';
import { StyledFieldsetRoot, StyledFieldset } from './CustomComponentWrapper.styles';

export enum CustomFunctionComponentContext {
    write = "write",
    read = "read",
}

export type CustomFunctionDefaultValues = Record<string, boolean | string | number | Record<string, unknown> | Array<string>>;

export interface PropertyCustomFunctionComponentProps<FormikValues, CustomComponentValues = CustomFunctionDefaultValues> {
    className?: string,
    _context?: CustomFunctionComponentContext,
    _columnName: string,
    readOnly: boolean,
    formik?: FormikState<FormikValues> & FormikComputedProps<FormikValues> & FormikHelpers<FormikValues> & FormikHandlers,
    values: CustomComponentValues,
    choices: NullableFormFieldFactoryChoices,
    changeHandler: (event: FormOnChangeEvent) => void,
    onBlur: (event: React.FocusEvent) => void,
    property: PropertySpec,
    disabled: boolean,
    hasChanged: boolean,
    formFieldFactory?: FormFieldFactory
}

export type PropertyCustomFunctionComponent<T extends PropertyCustomFunctionComponentProps<any>> = React.FunctionComponent<T>;

interface CustomComponentWrapperProps {
    property: PropertySpec,
    hasChanged: boolean,
    children: JSX.Element,
    disabled?: boolean
}

export const CustomComponentWrapper: React.FunctionComponent<CustomComponentWrapperProps> =
    (props): JSX.Element => {
        const { property, hasChanged, disabled } = props;

        return (
            <StyledFieldsetRoot label={property.label} hasChanged={hasChanged} disabled={disabled}>
                <StyledFieldset label={property.label}>
                    {props.children}
                </StyledFieldset>
            </StyledFieldsetRoot>
        );
    }

const withCustomComponentWrapper =
    function <V, T extends PropertyCustomFunctionComponentProps<any> = PropertyCustomFunctionComponentProps<V>>(
        InnerComponent: React.FunctionComponent<any>
    ): PropertyCustomFunctionComponent<T> {

        const displayName = `withCustomComponentWrapper(${InnerComponent.displayName || InnerComponent.name})`;
        const WrappedComponent: React.FunctionComponent<any> = (props: PropertyCustomFunctionComponentProps<unknown>): JSX.Element => {

            const { property, hasChanged, _context, formik, disabled } = props;

            const isListValue = !formik && _context === CustomFunctionComponentContext.read;
            if (isListValue) {
                return (
                    <InnerComponent {...props} />
                );
            }

            return (
                <CustomComponentWrapper property={property} hasChanged={hasChanged} disabled={disabled}>
                    <InnerComponent {...props} />
                </CustomComponentWrapper>
            );

        };
        WrappedComponent.displayName = displayName;

        return WrappedComponent;
    }

export default withCustomComponentWrapper;