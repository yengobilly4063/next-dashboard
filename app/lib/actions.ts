'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';
import { State } from './constants';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

type PrevState = State | undefined;

export async function createInvoice(prevState: PrevState, formData: FormData) {
    try {
        const rawFormData = getFormDataObject(formData);
        const validatedFields = CreateInvoice.safeParse(rawFormData);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Missing fields. Failed to Create Invoice',
            };
        }

        const { amount, customerId, status } = validatedFields.data;

        const amountInCents = amount * 100;
        const date = new Date().toISOString().split('T')[0];

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

export async function updateInvoice(id: string, prevState: PrevState, formData: FormData) {
    const rawFormData = getFormDataObject(formData);
    const validatedFields = UpdateInvoice.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to Create Invoice',
        };
    }

    const { amount, customerId, status } = validatedFields.data;

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
    customerId: z.string({
        invalid_type_error: 'Please select a customer',
        required_error: 'Please select a customer',
    }),
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status',
        required_error: 'Please select an invoice status',
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
