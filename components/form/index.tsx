import React from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';

export type FormSubmit<TFieldValues extends FieldValues> = (
    values: TFieldValues,
) => Promise<boolean | undefined | void>;

function Form<TFieldValues extends FieldValues, TContext = any>({
    children,
    onSubmit,
}: {
    children?: React.ReactNode;
    onSubmit: FormSubmit<TFieldValues>;
}) {
    const methods = useForm<TFieldValues, TContext>();

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
        </FormProvider>
    );
}

export default Form;
