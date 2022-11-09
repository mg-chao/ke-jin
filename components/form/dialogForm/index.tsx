import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
    useState,
    useMemo,
    useEffect,
    useImperativeHandle,
    ForwardedRef,
    useCallback,
    ComponentProps,
} from 'react';
import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Breakpoint } from '@mui/material';
import Form from '..';
import { FieldValues } from 'react-hook-form';

export interface DialogFormRef {
    show: () => void;
}

export interface DialogFormProps extends ComponentProps<typeof Form> {
    trigger?: JSX.Element;
    open?: boolean;
    title?: string;
    width?: false | Breakpoint | undefined;
}

function DialogForm<Values extends FieldValues>(
    {
        trigger: propTrigger,
        open: propOpen,
        onSubmit: propOnSubmit,
        title,
        children,
        width,
    }: DialogFormProps,
    ref: ForwardedRef<DialogFormRef>,
) {
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
        ref,
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
    const onSubmit = useCallback(
        async (values: Values) => {
            let res;
            setSubmitting(true);
            try {
                res = await propOnSubmit(values);
            } catch (e) {
                res = false;
            }
            setSubmitting(false);
            if (res) {
                close();
            }
        },
        [close, propOnSubmit],
    );

    return (
        <div>
            {trigger}
            <Dialog open={open} onClose={close} fullWidth maxWidth={width}>
                {title && <DialogTitle>{title}</DialogTitle>}
                <Form onSubmit={onSubmit}>
                    <DialogContent>{children}</DialogContent>
                    <DialogActions>
                        <LoadingButton loading={submitting} type="submit">
                            确定
                        </LoadingButton>
                        <Button onClick={close}>取消</Button>
                    </DialogActions>
                </Form>
            </Dialog>
        </div>
    );
}

export default React.forwardRef<DialogFormRef, DialogFormProps>(DialogForm);
