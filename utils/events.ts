import { Moment } from "moment";
import {
    BaseDirectory,
    createDir,
    readTextFile,
    writeFile,
} from "@tauri-apps/api/fs";
import path from "path";
import AppInfo from "./appInfo";
import {
    CommonError,
    CommonErrorCode,
    FileError,
    FileErrorCode,
    FileErrorType,
} from "./errors";
import { defu } from "defu";
import moment from "moment";
import { List, Item } from "linked-list";

export class AppEventList extends List<AppEventItem> {}

class AppEventItem extends Item {
    value: AppEvent;

    constructor(value: AppEvent) {
        super();
        this.value = value;
    }
}

export const EVENTS_BASE_DIR = BaseDirectory.Config;
export const EVENTS_DIR_PATH = AppInfo.symbol;
export const EVENTS_FILE_PATH = path.join(EVENTS_DIR_PATH, `./events.json`);

export interface AppEvent {
    id: number;
    title: string;
    desc?: string;
    complete: boolean;
    important?: boolean;
    deadline?: Moment;
    reminderTime?: Moment;
}

export type PAppEvent = Partial<AppEvent> & {
    title: string;
};

/**
 * 提供全部或部分事件属性，得到新事件
 */
const createEvent = (event?: PAppEvent): AppEvent => {
    return defu(event ?? {}, {
        id: moment().valueOf(),
        title: "未知",
        complete: false,
        desc: undefined,
        deadline: undefined,
        reminderTime: undefined,
    });
};

export type JsonAppEvent = Omit<Omit<AppEvent, "deadline">, "reminderTime"> & {
    deadline?: number;
    reminderTime?: number;
};

const convertEvenToJson = (event: AppEvent): JsonAppEvent => {
    return {
        ...event,
        deadline: event.deadline?.valueOf(),
        reminderTime: event.reminderTime?.valueOf(),
    };
};

const convertNumToMoment = (
    num?: number | null | undefined,
): moment.Moment | undefined => {
    if (!num) {
        return undefined;
    }
    if (typeof num !== "number") {
        return undefined;
    }
    if (Number.isNaN(num)) {
        return undefined;
    }
    const res = moment(num);
    if (!res.isValid()) {
        return undefined;
    }
    return res;
};

const convertJsonToEvent = (event: JsonAppEvent): AppEvent => {
    return {
        ...event,
        deadline: convertNumToMoment(event.deadline),
        reminderTime: convertNumToMoment(event.reminderTime),
    };
};

const updateEvents = async (
    events: JsonAppEvent[] | string,
    filePath?: string,
) => {
    try {
        await createDir(EVENTS_DIR_PATH, {
            dir: EVENTS_BASE_DIR,
            recursive: true,
        });
    } catch (_) {
        throw new FileError(
            FileErrorCode.NoPermission,
            EVENTS_FILE_PATH,
            FileErrorType.Directory,
            "创建事件目录失败",
        );
    }
    try {
        await writeFile(
            {
                contents:
                    typeof events === "string"
                        ? events
                        : JSON.stringify(events),
                path: filePath ?? EVENTS_FILE_PATH,
            },
            {
                dir: EVENTS_BASE_DIR,
            },
        );
    } catch (_) {
        throw new FileError(
            FileErrorCode.NoPermission,
            EVENTS_FILE_PATH,
            FileErrorType.File,
            "保存事件失败",
        );
    }
};

export const compareEvent = (a: AppEvent, b: AppEvent) => {
    const aTemp = a.id;
    const bTemp = b.id;
    return bTemp - aTemp;
};

const handleParseError = (text?: string) => {
    if (text) {
        updateEvents(text, `${EVENTS_FILE_PATH}.${new Date().valueOf()}.bak`);
    }
    throw new CommonError(
        CommonErrorCode.ParseError,
        "解析错误，事件文件或已损坏",
    );
};

export default class AppEvents {
    private static instance = new AppEvents();
    private events: AppEventList | undefined = undefined;
    private eventsMap: Map<number, AppEventItem> = new Map();

    private constructor() {
        /**empty */
    }

    public static getInstance(): AppEvents {
        return AppEvents.instance;
    }

    public async get(force?: boolean): Promise<AppEventList> {
        if (this.events && force !== true) {
            return this.events;
        }
        let text: string;
        try {
            text = await readTextFile(EVENTS_FILE_PATH, {
                dir: EVENTS_BASE_DIR,
            });
        } catch (_) {
            this.events = new List();
            return this.events;
        }
        let res;
        try {
            res = JSON.parse(text);
        } catch (_) {
            handleParseError(text);
        }
        if (!Array.isArray(res)) {
            handleParseError(text);
        }
        const eventList = new AppEventList();
        (res as any[]).forEach((v) => {
            const item = convertJsonToEvent(v);
            const e = createEvent(item);
            const nodeE = new AppEventItem(e);
            this.eventsMap.set(item.id, eventList.append(nodeE));
        });
        this.events = eventList;
        return this.events;
    }

    public async updateOrCreate(
        id: number | undefined,
        event: PAppEvent,
    ): Promise<boolean> {
        const eventList = await this.get();
        const old = id ? this.eventsMap.get(id) : undefined;
        const newNode = new AppEventItem(createEvent({ ...event, id }));
        if (old) {
            if (old.prev) {
                old.prev.append(newNode);
            }
            if (old.next) {
                old.next.prepend(newNode);
            }
            old.detach();
            this.eventsMap.delete(old.value.id);
            this.eventsMap.set(old.value.id, newNode);
        } else {
            eventList.append(newNode);
            this.eventsMap.set(newNode.value.id, newNode);
        }
        try {
            await this.save();
        } catch {
            // 还原
            await this.get();
            return false;
        }
        return true;
    }

    public async save() {
        await updateEvents(
            (await this.get()).toArray().map((item) => {
                return convertEvenToJson(item.value);
            }),
        );
    }
}
