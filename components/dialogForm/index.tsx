import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
    useState,
    useMemo,
    useEffect,
    useImperativeHandle,
    useCallback,
    ComponentProps,
    ReactNode,
} from "react";
import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { Breakpoint } from "@mui/material";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { FormContainer } from "../muiForm";

export type DialogAction = {
    show: () => void;
};

export interface DialogFormProps<Values extends FieldValues> {
    trigger?: JSX.Element;
    open?: boolean;
    title?: string;
    width?: false | Breakpoint | undefined;
    formProps?: ComponentProps<typeof FormContainer<Values>>;
    children?: ReactNode;
    onSuccess: SubmitHandler<Values>;
    actionRef?: React.MutableRefObject<DialogAction | undefined>;
}

function DialogForm<Values extends FieldValues>({
    trigger: propTrigger,
    open: propOpen,
    onSuccess: propOnSuccess,
    title,
    children,
    width,
    formProps,
    actionRef,
}: DialogFormProps<Values>) {
    const [open, setOpen] = useState<boolean>(propOpen ?? false);
    useEffect(() => {
        setOpen(propOpen ?? false);
    }, [propOpen]);

    const show = useCallback(() => {
        setOpen(true);
    }, []);

    const close = useCallback(() => {
        setOpen(false);
    }, []);

    useImperativeHandle(
        actionRef,
        () => ({
            show,
        }),
        [show],
    );

    const trigger = useMemo(() => {
        if (propTrigger) {
            return React.cloneElement(propTrigger, {
                ...propTrigger.props,
                onClick: (e: any) => {
                    show();
                    propTrigger.props?.onClick?.(e);
                },
            });
        }

        return <></>;
    }, [propTrigger, show]);

    const [submitting, setSubmitting] = useState(false);
    const onSuccess: SubmitHandler<Values> = useCallback(
        async (values: Values) => {
            let res;
            setSubmitting(true);
            try {
                res = await propOnSuccess(values);
            } catch (e) {
                res = false;
            }
            setSubmitting(false);
            if (res) {
                close();
            }
        },
        [close, propOnSuccess],
    );

    return (
        <>
            {trigger}
            <Dialog open={open} onClose={close} fullWidth maxWidth={width}>
                {title && <DialogTitle variant="body1">{title}</DialogTitle>}
                <FormContainer<Values> onSuccess={onSuccess} {...formProps}>
                    <DialogContent>{children}</DialogContent>
                    <DialogActions>
                        <LoadingButton loading={submitting} type="submit">
                            确定
                        </LoadingButton>
                        <Button onClick={close}>取消</Button>
                    </DialogActions>
                </FormContainer>
            </Dialog>
        </>
    );
}

export default DialogForm;
