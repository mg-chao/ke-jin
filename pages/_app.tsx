import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ScopedCssBaseline } from '@mui/material';
import React from 'react';
import SnackbarNotistack from '../components/snackbarNotistack';
import { ConfigWrapper } from '../components/configWrapper';
import PageContainer from '../components/pageContainer';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            <SnackbarNotistack>
                <ConfigWrapper>
                    <ScopedCssBaseline>
                        <PageContainer>
                            <Component {...pageProps} />
                        </PageContainer>
                    </ScopedCssBaseline>
                </ConfigWrapper>
            </SnackbarNotistack>
        </>
    );
}
