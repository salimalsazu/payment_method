"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SuccessPageForPaypal = ({ params }: any) => {
  const searchParams = useSearchParams();

  const PayerID = searchParams.get("PayerID");
  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    // Check if PayerID and paymentId are available in the query parameters
    if (PayerID && paymentId) {
      // Call the backend endpoint to execute the payment
      const executePayment = async () => {
        try {
          // Make a request to the backend endpoint with the paymentId and PayerID
          const response = await fetch(
            `http:localhost:7000/success/${paymentId}?PayerID=${PayerID}`,
            {
              method: "GET",
            }
          );

          if (response.ok) {
            console.log("Payment successful");
            // Optionally, redirect or display a success message
          } else {
            console.error("Payment execution failed");
            // Handle failure appropriately, maybe display an error message
          }
        } catch (error) {
          console.error(
            "An error occurred while executing the payment:",
            error
          );
        }
      };

      executePayment();
    }
  }, [PayerID, paymentId]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>
        Payment Successful <span> PayerID: {PayerID}</span>{" "}
      </h1>
      <p>Thank you for your payment.</p>
    </div>
  );
};

export default SuccessPageForPaypal;
