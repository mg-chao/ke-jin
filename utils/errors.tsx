/* eslint-disable no-unused-vars */

/**
 * 100-199
 */
export enum CommonErrorCode {
    /*
     * 解析错误
     */
    ParseError = 101,
}

/**
 * 200-299
 */
export enum FileErrorCode {
    /**
     * 文件/目录无权限
     */
    NoPermission = 200,
}

export class CommonError extends Error {
    /**
     * 错误 code，从 100 至 999
     */
    code: FileErrorCode | CommonErrorCode;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}

export enum FileErrorType {
    File = 0,
    Directory = 1,
}

/**
 * 文件操作错误
 */
export class FileError extends CommonError {
    path: string;
    type?: FileErrorType;

    static convertTypeToString(type?: FileErrorType): string {
        switch (type) {
            case FileErrorType.File:
                return '文件';
            case FileErrorType.Directory:
                return '目录';
            default:
                return '文件/目录';
        }
    }

    constructor(
        code: FileErrorCode,
        path: string,
        type?: FileErrorType,
        message?: string,
    ) {
        super(code, message ?? `操作失败`);
        this.path = path;
        this.type = type;
    }
}
