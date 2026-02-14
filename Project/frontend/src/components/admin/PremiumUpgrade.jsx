import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ jobId, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const { data } = await axios.post('http://localhost:5000/api/payment/create-intent', {
        jobId,
        amount
      });

      const { clientSecret } = data;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        // Payment succeeded
        await axios.post('http://localhost:5000/api/payment/confirm', {
          paymentIntentId: result.paymentIntent.id
        });
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Amount: ${amount}
        </Typography>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || loading}
        >
          {loading ? <CircularProgress size={20} /> : `Pay $${amount}`}
        </Button>
      </Box>
    </form>
  );
};

const PremiumUpgrade = ({ open, onClose, jobId, jobTitle }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      onClose();
      window.location.reload(); // Refresh to show premium status
    }, 2000);
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        Upgrade to Premium Job Posting
      </DialogTitle>
      <DialogContent>
        {success ? (
          <Alert severity="success">
            Payment successful! Your job "{jobTitle}" is now premium.
          </Alert>
        ) : (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Make your job posting stand out with premium features:
            </Typography>
            <Box component="ul" sx={{ mb: 3 }}>
              <li>Higher visibility in search results</li>
              <li>Featured placement on the homepage</li>
              <li>Priority in job recommendations</li>
              <li>Premium badge display</li>
            </Box>
            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
              Premium Price: $9.99 for 30 days
            </Typography>

            <Elements stripe={stripePromise}>
              <CheckoutForm
                jobId={jobId}
                amount={9.99}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </Elements>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PremiumUpgrade;
