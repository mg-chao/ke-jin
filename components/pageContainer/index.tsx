import {
    Box,
    Button,
    createTheme,
    CSSObject,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    styled,
    Switch,
    Theme,
    ThemeProvider,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import React, { useCallback, useContext, useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { AppConfigContext } from "../configWrapper";
import Image from "next/image";
import { pageInfo as homePageInfo } from "../../pages/index";
import { FormatListNumberedRtl } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import styles from "../../styles/globals.module.scss";

import kejinIMG from "../../public/images/kejin.png";
import { useRouter } from "next/router";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.appBar,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

const DrawerListItem: React.FC<{
    text: React.ReactNode;
    icon: React.ReactNode;
    onClick?: () => void;
}> = ({ text, icon, onClick }) => {
    const { open } = useContext(PageContainerDrawerContext);
    return (
        <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                }}
                onClick={onClick}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                    }}
                >
                    {icon}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
        </ListItem>
    );
};

const Logo: React.FC = () => {
    const {
        config: { darkMode },
    } = useContext(AppConfigContext);
    return (
        <div className={styles.logo}>
            <Button className={styles.button} sx={{ padding: 0 }}>
                <Image
                    style={{ opacity: darkMode ? 0.83 : 1 }}
                    src={kejinIMG}
                    alt="kejin"
                    height={32}
                />
            </Button>
        </div>
    );
};

export const PageBar: React.FC<{
    title: React.ReactNode;
    extra?: React.ReactNode;
}> = ({ title, extra }) => {
    const { open, openDrawer } = useContext(PageContainerDrawerContext);
    const theme = useTheme();
    return (
        <AppBar
            position="fixed"
            open={open}
            sx={{
                marginLeft: { xs: 0, sm: open ? drawerWidth : 0 },
                width: {
                    xs: "100%",
                    sm: open ? `calc(100% - ${drawerWidth}px)` : "100%",
                },
                zIndex: {
                    xs: theme.zIndex.appBar,
                    sm: theme.zIndex.drawer + 1,
                },
                top: { xs: "auto", sm: 0 },
                bottom: { xs: 0, sm: "auto" },
            }}
        >
            <Toolbar>
                <IconButton
                    aria-label="open drawer"
                    color="inherit"
                    onClick={openDrawer}
                    sx={{
                        ...(open && { display: "none" }),
                    }}
                    edge="start"
                >
                    <MenuIcon />
                </IconButton>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={0}
                    width={"100%"}
                >
                    <Typography component="div">{title}</Typography>
                    <Typography component="div">{extra}</Typography>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

const DarkModeSwitch = styled(Switch)(({ theme }) => ({
    height: 24,
    padding: 6,
    width: 48,
    "& .MuiSwitch-switchBase": {
        margin: 0,
        padding: 0,
        transform: "translateX(6px)",
        "&.Mui-checked": {
            color: "#fff",
            transform: "translateX(24px)",
            "& .MuiSwitch-thumb:before": {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    "#fff",
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor:
                    theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
            },
        },
    },
    "& .MuiSwitch-thumb": {
        backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
        width: 24,
        height: 24,
        "&:before": {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                "#fff",
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    "& .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        borderRadius: 20 / 2,
    },
}));

const PageContainerDrawer: React.FC = () => {
    const theme = useTheme();
    const router = useRouter();

    const linkItemClick = useCallback(
        (...params: Parameters<typeof router.push>) => {
            return () => {
                router.push(...params);
            };
        },
        [router],
    );

    const {
        config: { darkMode },
        updateConfig,
    } = useContext(AppConfigContext);
    const { open, closeDrawer } = useContext(PageContainerDrawerContext);
    const drawerChildren = (
        <>
            <DrawerHeader>
                <Logo />
                <IconButton onClick={closeDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </DrawerHeader>
            <Divider />
            <Box height={"100%"}>
                <List>
                    <DrawerListItem
                        text={homePageInfo.title}
                        icon={<FormatListNumberedRtl />}
                        onClick={linkItemClick(homePageInfo.href)}
                    />
                </List>
            </Box>
            <Box flexGrow={0}>
                <Divider />
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={0}
                    padding={theme.spacing(0.5)}
                >
                    <DarkModeSwitch
                        sx={{ m: 1 }}
                        onChange={({ target: { checked } }) => {
                            updateConfig({ darkMode: checked });
                        }}
                        checked={darkMode}
                    />
                    {open && (
                        <Typography variant="body2">
                            {darkMode ? "夜间" : "明亮"}
                        </Typography>
                    )}
                </Stack>
            </Box>
        </>
    );

    return (
        <>
            <Drawer
                variant="permanent"
                open={open}
                sx={{ display: { sm: "block", xs: "none" } }}
            >
                {drawerChildren}
            </Drawer>
            <MuiDrawer
                variant="temporary"
                open={open}
                onClose={closeDrawer}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                    },
                }}
            >
                {drawerChildren}
            </MuiDrawer>
        </>
    );
};

export interface PageContainerDrawerContextValue {
    open: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
}

export const PageContainerDrawerContext =
    React.createContext<PageContainerDrawerContextValue>({
        open: false,
        openDrawer: () => {
            return;
        },
        closeDrawer: () => () => {
            return;
        },
    });

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const lightTheme = createTheme();

const PageContainer: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [open, setOpen] = useState(false);

    const openDrawer = () => {
        setOpen(true);
    };

    const closeDrawer = () => {
        setOpen(false);
    };

    const [theme, setTheme] = useState(lightTheme);

    const {
        config: { darkMode },
    } = useContext(AppConfigContext);
    useEffect(() => {
        setTheme(darkMode ? darkTheme : lightTheme);
    }, [darkMode]);

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <ThemeProvider theme={theme}>
                <PageContainerDrawerContext.Provider
                    value={{
                        open,
                        openDrawer,
                        closeDrawer,
                    }}
                >
                    <div className={styles.pageContainer}>
                        <PageContainerDrawer />
                        <Box
                            component="main"
                            sx={{
                                paddingTop: { xs: 0, sm: theme.spacing(8) },
                                paddingBottom: { xs: theme.spacing(7), sm: 0 },
                                height: "100vh",
                                width: "100vw",
                                maxHeight: "100vh",
                                bgcolor: theme.palette.background.paper,
                            }}
                        >
                            {children}
                        </Box>
                    </div>
                </PageContainerDrawerContext.Provider>
            </ThemeProvider>
        </LocalizationProvider>
    );
};

export default PageContainer;
