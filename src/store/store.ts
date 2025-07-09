import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counter/counterSlice';
import snackbarReducer from './slices/snackbarSlice'; // Import the snackbar reducer

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        snackbar: snackbarReducer, // Add snackbar reducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
