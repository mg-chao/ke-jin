import Head from "next/head";
import { PageBar } from "../components/pageContainer";
import { generatePageInfo } from "../utils/pageUtils";
import {
    Box,
    Checkbox,
    IconButton,
    Paper,
    Stack,
    styled,
    Typography,
    useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DialogForm, { DialogAction } from "../components/dialogForm";
import React, {
    MutableRefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import FormText from "../components/formText";
import { FormResponsive } from "../utils/gridResponsive";
import FormDate from "../components/formTimePicker";
import Grid from "@mui/material/Unstable_Grid2";
import AppEvents, { AppEvent, compareEvent, PAppEvent } from "../utils/events";
import {
    getSuccessMessage,
    useAppSnackbar,
} from "../components/snackbarNotistack";
import styles from "../styles/index.module.scss";
import TextUtil from "../utils/textUtil";
import { EditOutlined, Grade, GradeOutlined } from "@mui/icons-material";
import useForceUpdateKey from "../hooks/useForceUpdateKey";

export const pageInfo = generatePageInfo({ title: "事件", href: "/" });

export type EventFormValues = Omit<Omit<AppEvent, "id">, "complete">;

const UpdateOrCreateEvent: React.FC<{
    event: AppEvent | undefined;
    actionRef: MutableRefObject<DialogAction | undefined>;
    onSuccess?: () => void;
}> = ({ event, actionRef, onSuccess }) => {
    const appEvents = AppEvents.getInstance();
    const { handleFileError, handleSuccess } = useAppSnackbar();
    return (
        <DialogForm<EventFormValues>
            formProps={{ defaultValues: event }}
            title="新增事件"
            actionRef={actionRef}
            onSuccess={async (values) => {
                let res = false;
                try {
                    res = await appEvents.updateOrCreate(event?.id, values);
                } catch (e: unknown) {
                    if (e instanceof Error) {
                        handleFileError(e);
                    }
                    return false;
                }
                handleSuccess(getSuccessMessage("新增事件"));
                onSuccess?.();
                return res;
            }}
        >
            <Grid container spacing={2}>
                <Grid {...FormResponsive.one}>
                    <FormText
                        name="title"
                        type="text"
                        label="标题"
                        color="primary"
                        required
                        size={"medium"}
                    />
                </Grid>
                <Grid {...FormResponsive.one}>
                    <FormText
                        name="desc"
                        type="text"
                        label="描述"
                        color="info"
                    />
                </Grid>
                <Grid {...FormResponsive.two}>
                    <FormDate name="deadline" label="截至时间" />
                </Grid>
                <Grid {...FormResponsive.two}>
                    <FormDate name="reminderTime" label="提醒时间" />
                </Grid>
            </Grid>
        </DialogForm>
    );
};

const TopBar: React.FC<{ onCreate: () => void }> = ({ onCreate }) => {
    const createEventRef = useRef<DialogAction>();

    return (
        <>
            <UpdateOrCreateEvent
                actionRef={createEventRef}
                event={undefined}
                onSuccess={onCreate}
            />
            <PageBar
                title={pageInfo.title}
                extra={
                    <IconButton
                        color="inherit"
                        onClick={() => {
                            createEventRef.current?.show();
                        }}
                        aria-label="create event"
                    >
                        <AddIcon />
                    </IconButton>
                }
            />
        </>
    );
};

const EventListItemGrid = styled(Grid)(({ theme }) => ({
    "& .MuiPaper-root:hover": {
        backgroundColor:
            theme.palette.mode === "dark"
                ? theme.palette.grey[900]
                : theme.palette.grey[100],
    },
}));

const EventListItem: React.FC<{ event: AppEvent; onUpdate?: () => void }> = ({
    event,
    onUpdate: propOnUpdate,
}) => {
    const theme = useTheme();
    const [key, forceUpdate] = useForceUpdateKey();
    const onUpdate = useCallback(() => {
        propOnUpdate?.();
        forceUpdate();
    }, [forceUpdate, propOnUpdate]);
    const appEvents = AppEvents.getInstance();
    const { handleFileError } = useAppSnackbar();
    const updateEvent = async (values: Partial<PAppEvent>) => {
        try {
            await appEvents.updateOrCreate(event.id, {
                ...event,
                ...values,
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                handleFileError(e);
            }
        }
        onUpdate?.();
    };
    const updateEventRef = useRef<DialogAction>();
    return (
        <>
            <UpdateOrCreateEvent
                actionRef={updateEventRef}
                event={event}
                key={key}
                onSuccess={onUpdate}
            />
            <EventListItemGrid {...FormResponsive.one}>
                <Paper
                    className={styles.event}
                    sx={{
                        px: theme.spacing(1.5),
                        py: theme.spacing(1),
                    }}
                >
                    <Box component="div" className={styles.checkbox}>
                        <Checkbox
                            size="small"
                            checked={event.complete}
                            onChange={({ target: { checked } }) => {
                                updateEvent({ complete: checked });
                            }}
                        />
                    </Box>
                    <Box component="div" className={styles.basicInfo}>
                        <Typography
                            component="div"
                            variant="body2"
                            className={styles.title}
                        >
                            {event.title}
                        </Typography>
                        {!TextUtil.isNull(event.desc) && (
                            <Typography
                                component="div"
                                variant="caption"
                                className={styles.desc}
                                color={theme.palette.text.secondary}
                            >
                                {event.desc}
                            </Typography>
                        )}
                    </Box>
                    <Stack direction="row">
                        <IconButton
                            aria-label="important"
                            size="small"
                            onClick={() => {
                                updateEvent({ important: !event.important });
                            }}
                        >
                            {event.important ? (
                                <Grade fontSize="inherit" />
                            ) : (
                                <GradeOutlined fontSize="inherit" />
                            )}
                        </IconButton>
                        <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={() => {
                                updateEventRef.current?.show();
                            }}
                        >
                            <EditOutlined fontSize="inherit" />
                        </IconButton>
                    </Stack>
                </Paper>
            </EventListItemGrid>
        </>
    );
};

const EventList: React.FC<{
    events: AppEvent[] | undefined;
    onUpdate?: () => void;
}> = ({ events, onUpdate }) => {
    const theme = useTheme();
    return (
        <Grid container rowSpacing={theme.spacing(1.25)}>
            {events?.map((e) => {
                return (
                    <EventListItem key={e.id} event={e} onUpdate={onUpdate} />
                );
            })}
        </Grid>
    );
};

export default function Home() {
    const theme = useTheme();
    const appEvents = AppEvents.getInstance();
    const [events, setEvents] = useState<AppEvent[]>();
    const update = useCallback(async () => {
        setEvents(
            (await appEvents.get())
                .toArray()
                .map(({ value }) => {
                    return value;
                })
                .sort(compareEvent),
        );
    }, [appEvents]);
    useEffect(() => {
        update();
    }, [update]);
    return (
        <div>
            <Head>
                <title>{pageInfo.title}</title>
                <meta name="description" content={pageInfo.title} />
            </Head>
            <TopBar onCreate={update} />
            <Box padding={theme.spacing(2)}>
                <EventList events={events} onUpdate={update} />
            </Box>
        </div>
    );
}
