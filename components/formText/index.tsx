import React, { ComponentProps, useCallback } from "react";
import {
    FieldError,
    FieldPath,
    FieldValues,
    RegisterOptions,
} from "react-hook-form";
import { useMemo } from "react";
import { TextFieldElement } from "../muiForm";

export interface FormTextProps<TFieldValues extends FieldValues = FieldValues>
    extends ComponentProps<typeof TextFieldElement<TFieldValues>> {
    label?: string;
}

function FormText<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    label,
    required,
    validation: propValidation,
    ...props
}: FormTextProps<TFieldValues>) {
    const validation: Omit<
        RegisterOptions<TFieldValues, TName>,
        "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
    > = useMemo(() => {
        if (propValidation) {
            return propValidation;
        }
        if (required) {
            return {
                required: true,
                pattern: /^\S+(\s+\S+)*$/,
            };
        }
        return {};
    }, [propValidation, required]);

    const parseError = useCallback(
        (error: FieldError) => {
            if (error?.type === "required") {
                return `请输入${label}`;
            }
            if (error?.type === "pattern") {
                return `两端不允许存在空格`;
            }
            if (error?.message) {
                return error.message;
            }

            return `值非法`;
        },
        [label],
    );

    return (
        <TextFieldElement
            validation={validation}
            parseError={parseError}
            label={label}
            size="small"
            fullWidth
            {...props}
        />
    );
}

export default FormText;
