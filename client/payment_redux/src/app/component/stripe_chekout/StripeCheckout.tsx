import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MyCheckoutForm from "./MyCheckoutForm";
import { useEffect, useState } from "react";
import { Drawer } from "@mantine/core";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const CheckoutPage = ({ opened, closeDrawer, amount }: any) => {
  const [clientSecret, setClientSecret] = useState("");

  console.log("amount: ", amount);

  useEffect(() => {
    // Fetch the clientSecret
    const fetchClientSecret = async () => {
      try {
        const response = await fetch(
          "http://localhost:7000/create-payment-intent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }),
          }
        );
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };

    fetchClientSecret();
  }, [amount]);

  return (
    <Drawer
      offset={8}
      radius="md"
      position="right"
      opened={opened}
      onClose={closeDrawer}
      title="Stripe Payment"
    >
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <MyCheckoutForm amount={amount} clientSecret={clientSecret} />
        </Elements>
      )}
    </Drawer>
  );
};

export default CheckoutPage;
