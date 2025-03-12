import { clsx } from 'clsx';
import Link from 'next/link';
import { lusitana } from '@fonts/fonts';

interface Breadcrumb {
    label: string;
    href: string;
    active?: boolean;
}

export const createInvoiceBreadcrumbs: Breadcrumb[] = [
    { label: 'Invoices', href: '/dashboard/invoices' },
    { label: 'Create Invoice', href: '/dashboard/invoices/create', active: true },
];

export const editInvoiceBreadcrumbs = (id: string): Breadcrumb[] => [
    { label: 'Invoices', href: '/dashboard/invoices' },
    {
        label: 'Edit Invoice',
        href: `/dashboard/invoices/${id}/edit`,
        active: true,
    },
];

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6 block">
            <ol className={clsx(lusitana.className, 'flex text-xl md:text-2xl')}>
                {breadcrumbs.map((breadcrumb, index) => (
                    <li
                        key={breadcrumb.href}
                        aria-current={breadcrumb.active}
                        className={clsx(breadcrumb.active ? 'text-gray-900' : 'text-gray-500')}
                    >
                        <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                        {index < breadcrumbs.length - 1 ? (
                            <span className="mx-3 inline-block">/</span>
                        ) : null}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
