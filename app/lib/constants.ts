export type State = {
    message?: string | null;
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
};

export const initialState: State = { message: null, errors: {} };
