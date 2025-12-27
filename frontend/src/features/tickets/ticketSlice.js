import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
    tickets: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

export const fetchTickets = createAsyncThunk('tickets/getAll', async (_, thunkAPI) => {
    try {
        const response = await axiosInstance.get('/tickets');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const createTicket = createAsyncThunk('tickets/create', async (ticketData, thunkAPI) => {
    try {
        const response = await axiosInstance.post('/tickets', ticketData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const updateStep = createAsyncThunk('tickets/updateStep', async ({id, stepData}, thunkAPI) => {
    try {
        const response = await axiosInstance.put(`/tickets/${id}/step`, stepData);
        thunkAPI.dispatch(fetchTickets()); // Refresh the list after update
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: { resetTickets: (state) => initialState },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => { state.isLoading = true; })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tickets = action.payload;
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.tickets.unshift(action.payload);
            });
    }
});

export const { resetTickets } = ticketSlice.actions;
export default ticketSlice.reducer;