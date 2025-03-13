
{/*This from cursor*/}
import { useEffect } from 'react';
import { toast } from 'sonner';

const PayPalButton = ({ amount, onSuccess }) => {
  useEffect(() => {
    const script = document.createElement('script');
    // Replace with your PayPal client ID
    script.src = 'https://www.paypal.com/sdk/js?client-id=test';
    
    script.addEventListener('load', () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code: 'USD',
                value: amount.toString()
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(details => {
            toast.success('Payment completed successfully!');
            if (onSuccess) {
              onSuccess(details);
            }
          });
        },
        onError: (err) => {
          toast.error('Payment failed. Please try again.');
          console.error('PayPal Error:', err);
        }
      }).render('#paypal-button-container');
    });

    script.onerror = () => {
      toast.error('Failed to load PayPal. Please refresh the page.');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [amount, onSuccess]);

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;


