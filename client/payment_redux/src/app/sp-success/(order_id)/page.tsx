"use client";

import axios from "axios";

import { useRouter } from "next/router";
import React, { useEffect } from "react";

const SurjoyPaySuccessPage = ({ searchParams }: any) => {
  console.log("SP", searchParams);

  useEffect(() => {
    const { order_id } = searchParams;
    console.log("order_id", order_id);

    const verifyPayment = async () => {
      try {
        const response = await axios.post(
          `http://localhost:7000/sujo-pay-verify/`,
          {
            order_id,
          }
        );

        console.log("Payment verification successful", response.data);
      } catch (error) {
        console.error("Error verifying payment", error);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div>
      <h1>Surjo Pay Payment Success</h1>
    </div>
  );
};

export default SurjoyPaySuccessPage;
