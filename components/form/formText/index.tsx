import TextField from '@mui/material/TextField';
import React from 'react';
import {
    FieldPath,
    FieldValues,
    useController,
    RegisterOptions,
} from 'react-hook-form';
import { useMemo } from 'react';

export interface FormTextProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    defaultValue?: any;
    name: TName;
    label: React.ReactNode;
    required?: boolean;
    rules?: Omit<
        RegisterOptions<TFieldValues, TName>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
    >;
}

function FormText<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    defaultValue,
    name,
    label,
    required,
    rules: propRules,
}: FormTextProps<TFieldValues, TName>) {
    const rules: Omit<
        RegisterOptions<TFieldValues, TName>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
    > = useMemo(() => {
        if (propRules) {
            return propRules;
        }
        if (required) {
            return {
                required: true,
                pattern: /^\S+(\s+\S+)*$/,
            };
        }
        return {};
    }, [propRules, required]);
    const {
        field,
        fieldState: { error },
    } = useController<TFieldValues, TName>({
        name,
        rules,
        defaultValue,
    });

    const helperText = (() => {
        if (error?.message) {
            return error.message;
        }
        if (error?.type === 'required') {
            return `请输入${label}`;
        }
        if (error?.type === 'pattern') {
            return `两端不允许存在空格`;
        }
        if (error) {
            return `值非法`;
        }
        return undefined;
    })();

    return (
        <TextField
            {...field}
            required={required}
            error={error ? true : false}
            aria-invalid={error ? 'true' : 'false'}
            helperText={helperText}
            label={label}
            fullWidth
        />
    );
}

export default FormText;
