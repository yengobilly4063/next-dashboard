'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function createInvoice(formData: FormData) {
    const rawFormData = getFormDataObject(formData);
    const { amount, customerId, status } = CreateInvoice.parse(rawFormData);

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        console.error(error);
        throw new Error(`Unable to create invoice. Error ${error}`, { cause: error });
    }

    revalidateAndRedirectToInvoiceDashboard();
}

export async function updateInvoice(id: string, formData: FormData) {
    const rawFormData = getFormDataObject(formData);
    const { amount, customerId, status } = UpdateInvoice.parse(rawFormData);

    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error(error);
        throw new Error(`Unable to update invoice. Error ${error}`, { cause: error });
    }

    revalidateAndRedirectToInvoiceDashboard();
}

const invoicepath = '/dashboard/invoices';

export async function deleteInvoice(id: string) {
    throw new Error('Failed to delete invoice');
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
    } catch (error) {
        console.error(error);
    }

    revalidatePath(invoicepath);
}

function revalidateAndRedirectToInvoiceDashboard() {
    revalidatePath(invoicepath);
    redirect(invoicepath);
}

function getFormDataObject<T>(formData: FormData): T {
    return Object.fromEntries(formData) as T;
}

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
