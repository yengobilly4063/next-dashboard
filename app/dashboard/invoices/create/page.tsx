import { fetchCustomers } from '@lib/data';
import Breadcrumbs, { createInvoiceBreadcrumbs } from '@ui/invoices/breadcrumbs';
import Form from '@ui/invoices/create-form';

async function Page() {
    const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs breadcrumbs={createInvoiceBreadcrumbs} />
            <h1>Create new invoice</h1>
            <Form customers={customers} />
        </main>
    );
}

export default Page;
