import Head from 'next/head';
import { PageBar } from '../components/pageContainer';
import { generatePageInfo } from '../utils/pageUtils';
import { Box, Grid, IconButton, Paper, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DialogForm, { DialogFormRef } from '../components/form/dialogForm';
import { useRef } from 'react';
import FormText from '../components/form/formText';

export const pageInfo = generatePageInfo({ title: '事件', href: '/' });

const TopBar: React.FC = () => {
    const createEventRef = useRef<DialogFormRef>(null);
    return (
        <>
            <DialogForm
                title="新增事件"
                ref={createEventRef}
                onSubmit={async (values) => {
                    console.log(values);
                    return true;
                }}
            >
                <FormText label="标题" required name="title" />
            </DialogForm>
            <PageBar
                title={pageInfo.title}
                extra={
                    <IconButton
                        onClick={() => {
                            createEventRef.current?.show();
                        }}
                        aria-label="fingerprint"
                    >
                        <AddIcon />
                    </IconButton>
                }
            />
        </>
    );
};

export default function Home() {
    const theme = useTheme();
    return (
        <div>
            <Head>
                <title>{pageInfo.title}</title>
                <meta name="description" content={pageInfo.title} />
            </Head>
            <TopBar />
            <Box sx={{ padding: theme.spacing(2) }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper>xs=8</Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>xs=8</Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>xs=8</Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>xs=8</Paper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
