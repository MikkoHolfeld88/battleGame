import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { RootState } from '../../store/store'; // Adjust path if your store.ts is elsewhere
import { hideSnackbar, SnackbarState } from '../../store/slices/snackbarSlice'; // Adjust path

const GlobalSnackbar: React.FC = () => {
  const dispatch = useDispatch();
  const {
    open,
    message,
    severity,
    duration,
    title,
  } = useSelector((state: RootState) => state.snackbar as SnackbarState); // Type assertion if needed

  // @ts-ignore
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideSnackbar());
  };

  // Ensure duration is either null (for indefinite) or a number
  const effectiveDuration = typeof duration === 'number' ? duration : null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={effectiveDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Or your preferred position
      // TransitionComponent={Slide} // Optional: Add a transition
    >
      {/*
        The Alert component must be a direct child of Snackbar for autoHideDuration to work correctly,
        or Snackbar needs an onExited prop to trigger hideSnackbar if Alert has its own onClose.
        Wrapping Alert with a div or Fragment might interfere if not handled carefully.
        For Mui, Alert inside Snackbar is standard.
      */}
      <Alert
        onClose={handleClose} // Mui Alert's onClose can also trigger our hide action
        severity={severity}
        variant="filled" // Or "standard", "outlined"
        sx={{ width: '100%' }} // Ensure Alert fills Snackbar for better appearance
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
