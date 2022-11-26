import { FormHTMLAttributes, PropsWithChildren } from "react";
import {
    FormProvider,
    SubmitHandler,
    useForm,
    UseFormProps,
} from "react-hook-form";
import { FieldValues } from "react-hook-form/dist/types/fields";

export type FormContainerProps<T extends FieldValues = FieldValues> =
    PropsWithChildren<
        UseFormProps<T> & {
            onSuccess?: SubmitHandler<T>;
            FormProps?: FormHTMLAttributes<HTMLFormElement>;
        }
    >;

const FormContainer = <TFieldValues extends FieldValues = FieldValues>({
    children,
    FormProps,
    onSuccess,
    ...useFormProps
}: PropsWithChildren<FormContainerProps<TFieldValues>>) => {
    const methods = useForm<TFieldValues>({
        ...useFormProps,
    });
    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(
                    onSuccess
                        ? onSuccess
                        : () =>
                              console.log(
                                  "submit handler 'onSubmit' is missing",
                              ),
                )}
                noValidate
                {...FormProps}
            >
                {children}
            </form>
        </FormProvider>
    );
};

export default FormContainer;
