import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertColor } from '@mui/material/Alert';

export interface SnackbarState {
  open: boolean;
  title?: string; // Optional title for the Alert
  message: string;
  severity: AlertColor; // 'success' | 'info' | 'warning' | 'error'
  duration: number | null; // null for indefinite, otherwise ms
}

const initialState: SnackbarState = {
  open: false,
  title: '',
  message: '',
  severity: 'info', // Default severity
  duration: 5000, // Default duration 5 seconds
};

export interface ShowSnackbarPayload {
  message: string;
  severity?: AlertColor;
  title?: string;
  duration?: number | null;
}

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<ShowSnackbarPayload>) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || initialState.severity;
      state.title = action.payload.title || initialState.title;
      state.duration = action.payload.duration === undefined ? initialState.duration : action.payload.duration;
    },
    hideSnackbar: (state) => {
      state.open = false;
      // Optionally reset message/severity here if desired, or let them persist until next showSnackbar
      // state.message = '';
      // state.title = '';
      // state.severity = 'info';
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
