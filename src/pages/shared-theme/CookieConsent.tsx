import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Slide, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const location = useLocation();

  // Check if the user has already consented
  const isConsentGiven = localStorage.getItem('cookie-consent');

  if (isConsentGiven || location.pathname.endsWith('/privacy')) {
    return null; // If consent is already given, don't show the banner
  }

  // Hide banner when consent is given
  const handleAccept = () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    localStorage.setItem('cookie-consent', JSON.stringify({ value: 'true', expiry: expiryDate.toISOString() }));
    setIsVisible(false);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="md"
      TransitionComponent={Transition}
      open={isVisible}
    >
      <DialogTitle variant='h3'>Your Privacy</DialogTitle>
      <Divider />
      <DialogContent dividers>
        <Typography gutterBottom>
          Welcome to AI Chat! We're glad you're here and want you to know that we respect your privacy and your right to control how we collect, process, and use your personal data.
          We use cookies to provide you with the best possible experience on our website. By clicking "Ok", you agree to our use of cookies.
          For more information, please see our <Link to="/privacy" target='_black'>privacy policy</Link>.
        </Typography>
      </DialogContent>
      <Divider />
      <Typography variant='h3' gutterBottom>
        <DialogActions>
          <Button onClick={handleAccept}>Ok</Button>
        </DialogActions>
      </Typography>
    </Dialog >
  );
};

export default CookieConsentBanner;
