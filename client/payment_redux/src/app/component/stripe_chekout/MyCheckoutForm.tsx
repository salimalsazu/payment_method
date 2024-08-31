"use client";

import { Button, Loader } from "@mantine/core";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { error } from "console";
import { useEffect, useState } from "react";

const MyCheckoutForm = ({ amount, clientSecret }: any) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessages, setErrorMessages] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessages(submitError.message);
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessages(error.message);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }

    // if (!clientSecret || !stripe || !elements) {
    //   return (
    //     <div>
    //       <Loader size={"lg"} />
    //     </div>
    //   );
    // }
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button
          disabled={!stripe || isLoading}
          className="my-5 px-6 py-2 rounded-md bg-blue-500 text-white "
        >
          {!isLoading ? `Pay $${amount}` : "Processing..."}
        </button>

        {errorMessages && <div>{errorMessages}</div>}
      </form>
    </div>
  );
};

export default MyCheckoutForm;
