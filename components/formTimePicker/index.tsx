import React, { ComponentProps, useCallback, useEffect } from "react";
import {
    FieldError,
    FieldPath,
    FieldValues,
    RegisterOptions,
    useFormContext,
} from "react-hook-form";
import { useMemo } from "react";
import TimePicker from "../muiForm/TimePickerElement";
import defu from "defu";
import { TextFieldProps } from "@mui/material";
import moment from "moment";

export interface FormTimeProps<TFieldValues extends FieldValues = FieldValues>
    extends ComponentProps<typeof TimePicker<TFieldValues>> {
    label?: string;
}

const TIME_FORMAT = "HH:mm:ss";
const isMoment = (time: any) => {
    if (!time) {
        return true;
    }
    if (moment.isMoment(time)) {
        return true;
    }
    if (moment(time, TIME_FORMAT).isValid()) {
        return true;
    }
    return false;
};

function FormTime<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    label,
    required,
    validation: propValidation,
    inputProps: propInputProps,
    ...props
}: FormTimeProps<TFieldValues>) {
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
            if (error?.message) {
                return error.message;
            }

            return `值非法`;
        },
        [label],
    );

    const inputProps: TextFieldProps = useMemo(() => {
        const def: TextFieldProps = {
            size: "small",
            fullWidth: true,
        };
        return defu<TextFieldProps, TextFieldProps[]>(
            propInputProps ?? {},
            def,
        );
    }, [propInputProps]);
    const { register } = useFormContext();
    useEffect(() => {
        register(props.name, {
            validate: { isMoment },
            setValueAs: (value) => {
                const res = moment(value, TIME_FORMAT);
                if (res.isValid()) {
                    return res;
                }
                return value;
            },
        });
    });

    return (
        <TimePicker
            validation={validation}
            views={["hours", "minutes", "seconds"]}
            inputFormat="HH:mm:ss"
            ampm={false}
            openTo="hours"
            parseError={parseError}
            label={label}
            inputProps={inputProps}
            {...props}
        />
    );
}

export default FormTime;
