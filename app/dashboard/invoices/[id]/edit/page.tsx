import { fetchCustomers, fetchInvoiceById } from '@lib/data';
import Breadcrumbs, { editInvoiceBreadcrumbs } from '@ui/invoices/breadcrumbs';
import Form from '@ui/invoices/edit-form';
import { notFound } from 'next/navigation';

async function Page(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const [invoice, customers] = await Promise.all([fetchInvoiceById(id), fetchCustomers()]);

    if (!invoice) {
        notFound();
    }

    return (
        <>
            <main>
                <Breadcrumbs breadcrumbs={editInvoiceBreadcrumbs(id as string)} />
                <Form invoice={invoice} customers={customers} />
            </main>
        </>
    );
}

export default Page;
