import {
    BaseDirectory,
    createDir,
    readTextFile,
    writeFile,
} from '@tauri-apps/api/fs';
import path from 'path';
import AppInfo from './appInfo';
import {
    CommonError,
    CommonErrorCode,
    FileError,
    FileErrorCode,
    FileErrorType,
} from './errors';
import { defu } from 'defu';

export const CONFIG_BASE_DIR = BaseDirectory.Config;
export const CONFIG_DIR_PATH = AppInfo.symbol;
export const CONFIG_FILE_PATH = path.join(CONFIG_DIR_PATH, `./appConfig.json`);

/**
 * App 配置
 * 所有值均应可选
 */
export interface AppConfig {
    /**
     * 夜间模式
     */
    darkMode?: boolean;
}

/**
 * 提供全部或部分配置值，得到一份新配置
 * @param config 配置项
 * @returns 新配置
 */
export const createConfig = (config?: AppConfig): AppConfig => {
    return defu(config, {
        darkMode: false,
    });
};

export const updateConfig = async (
    config: AppConfig | string,
    filePath?: string,
) => {
    try {
        await createDir(CONFIG_DIR_PATH, {
            dir: CONFIG_BASE_DIR,
            recursive: true,
        });
    } catch (_) {
        throw new FileError(
            FileErrorCode.NoPermission,
            CONFIG_FILE_PATH,
            FileErrorType.Directory,
            '创建配置目录失败',
        );
    }
    try {
        await writeFile(
            {
                contents:
                    typeof config === 'string'
                        ? config
                        : JSON.stringify(config),
                path: filePath ?? CONFIG_FILE_PATH,
            },
            {
                dir: CONFIG_BASE_DIR,
            },
        );
    } catch (_) {
        throw new FileError(
            FileErrorCode.NoPermission,
            CONFIG_FILE_PATH,
            FileErrorType.File,
            '保存配置失败',
        );
    }
};

export const getConfig = async () => {
    let text: string;
    try {
        text = await readTextFile(CONFIG_FILE_PATH, {
            dir: CONFIG_BASE_DIR,
        });
    } catch (_) {
        // 使用默认配置
        return createConfig();
    }
    try {
        const res = JSON.parse(text);
        return createConfig(res);
    } catch (_) {
        // 保存错误文件以备恢复
        updateConfig(text, `${CONFIG_FILE_PATH}.${new Date().valueOf()}.bak`);
        throw new CommonError(
            CommonErrorCode.ParseError,
            '解析配置错误，配置文件或已损坏',
        );
    }
};

export default AppConfig;
