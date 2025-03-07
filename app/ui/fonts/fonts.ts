import localFont from 'next/font/local';

export const inter = localFont({
    src: [
        {
            path: './inter-latin-400-normal.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './inter-latin-700-normal.woff2',
            weight: '700',
            style: 'normal',
        },
    ],

    display: 'swap',
    variable: '--font-inter',
});

export const lusitana = localFont({
    src: [
        {
            path: './lusitana-latin-400-normal.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './lusitana-latin-700-normal.woff2',
            weight: '700',
            style: 'normal',
        },
    ],

    display: 'swap',
    variable: '--font-lusitana',
});
