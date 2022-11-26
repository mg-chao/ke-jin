import React, { useCallback, useContext } from "react";
import {
    OptionsObject,
    SnackbarKey,
    SnackbarMessage,
    SnackbarOrigin,
    SnackbarProvider,
    useSnackbar,
} from "notistack";
import { CommonError, FileError } from "../../utils/errors";

const MAX_SNACK = 3;
const AUTO_HIDE_DURATION = 3000;
const POSITION: SnackbarOrigin = {
    vertical: "top",
    horizontal: "right",
};

export const getSuccessMessage = (desc: string | undefined) => {
    return `${desc ?? ""}成功`;
};

export interface SnackbarNotistackContextValue {
    enqueueSnackbar: (
        message: SnackbarMessage,
        options?: OptionsObject | undefined,
    ) => SnackbarKey;
    handleError: (
        error: CommonError | Error,
        options?: OptionsObject,
    ) => SnackbarKey;
    handleFileError: (
        error: FileError | CommonError | Error,
        options?: OptionsObject,
    ) => SnackbarKey;
    handleSuccess: (
        message: SnackbarMessage,
        options?: OptionsObject | undefined,
    ) => SnackbarKey;
}

export const SnackbarNotistackContext =
    React.createContext<SnackbarNotistackContextValue>({
        enqueueSnackbar: () => -1,
        handleError: () => -1,
        handleFileError: () => -1,
        handleSuccess: () => -1,
    });

export const useAppSnackbar = () => useContext(SnackbarNotistackContext);

const SnackbarNotistackChildrenContainer: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { enqueueSnackbar } = useSnackbar();
    const handleError = useCallback(
        (error: CommonError | Error, options?: OptionsObject) => {
            if (error instanceof CommonError) {
                return enqueueSnackbar(
                    `${error.code}: ${error.message}`,
                    options ?? { variant: "error" },
                );
            }
            return enqueueSnackbar(
                error.message,
                options ?? { variant: "error" },
            );
        },
        [enqueueSnackbar],
    );
    const handleFileError = useCallback(
        (error: FileError | CommonError | Error, options?: OptionsObject) => {
            if (error instanceof FileError) {
                return enqueueSnackbar(
                    `${error}: ${
                        error.message
                    }（${FileError.convertTypeToString(error.type)}: ${
                        error.path
                    }）`,
                    options ?? { variant: "error" },
                );
            }
            return handleError(error, options);
        },
        [enqueueSnackbar, handleError],
    );
    const handleSuccess = useCallback(
        (message: SnackbarMessage, options?: OptionsObject | undefined) => {
            return enqueueSnackbar(message, options ?? { variant: "success" });
        },
        [enqueueSnackbar],
    );
    return (
        <SnackbarNotistackContext.Provider
            value={{
                handleError,
                handleFileError,
                enqueueSnackbar,
                handleSuccess,
            }}
        >
            {children}
        </SnackbarNotistackContext.Provider>
    );
};

const SnackbarNotistack: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    return (
        <SnackbarProvider
            maxSnack={MAX_SNACK}
            autoHideDuration={AUTO_HIDE_DURATION}
            anchorOrigin={POSITION}
        >
            <SnackbarNotistackChildrenContainer>
                {children}
            </SnackbarNotistackChildrenContainer>
        </SnackbarProvider>
    );
};

export default SnackbarNotistack;
