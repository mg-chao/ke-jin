import React, { useCallback, useEffect, useState } from "react";
import AppConfig, {
    createConfig,
    getConfig,
    updateConfig,
} from "../../utils/config";
import { CommonError, FileError } from "../../utils/errors";
import { useAppSnackbar } from "../snackbarNotistack";
export interface AppConfigContextValue {
    config: AppConfig;
    updateConfig: (config: AppConfig) => void;
}

export const AppConfigContext = React.createContext<AppConfigContextValue>({
    config: createConfig(),
    updateConfig: () => {
        return;
    },
});

/**
 * 是否已读取过配置
 */
let gotConfig = false;
export const ConfigWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { handleFileError, enqueueSnackbar } = useAppSnackbar();
    const [appConfig, setAppConfig] = useState(createConfig());
    const updateAppConfig = useCallback(
        async (cfg: AppConfig) => {
            try {
                const cur = createConfig(cfg);
                setAppConfig(cur);
                await updateConfig(cur);
            } catch (e) {
                if (e instanceof FileError) {
                    handleFileError(e);
                }
            }
        },
        [handleFileError],
    );

    useEffect(() => {
        if (!gotConfig) {
            gotConfig = true;
            getConfig()
                .then((c) => {
                    setAppConfig(c);
                })
                .catch((e) => {
                    if (e instanceof CommonError) {
                        handleFileError(e);
                    }
                });
        }
    }, [enqueueSnackbar, handleFileError]);

    return (
        <AppConfigContext.Provider
            value={{ updateConfig: updateAppConfig, config: appConfig }}
        >
            {children}
        </AppConfigContext.Provider>
    );
};
