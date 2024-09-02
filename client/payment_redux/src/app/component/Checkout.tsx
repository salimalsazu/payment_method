"use client";

// PayPalCheckout.js

import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalCheckout = ({ amount, currency, onSuccess, onError }: any) => {
  return (
    <PayPalScriptProvider
      options={
        {
          "client-id":
            "AQKRyS5-yXyQJSnljgnG4IVPRfgKUOeYzSGVOsSCLMTuO7Rm8NLgYFc2s8r8IYIFvcK6WDpsc2VQQk3G", // Replace with your PayPal client ID
        } as any
      }
    >
      <div>
        <h1>PayPal Checkout</h1>
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={(data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                    currency_code: currency,
                  },
                },
              ],
            });
          }}
          onApprove={(data: any, actions: any) => {
            return actions.order.capture().then(function (details: any) {
              onSuccess(details);
            });
          }}
          onError={onError}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalCheckout;
