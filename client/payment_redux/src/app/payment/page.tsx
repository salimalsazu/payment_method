"use client";

import { Badge, Button, Card, Group, Loader, Text } from "@mantine/core";
import StripeCheckout from "../component/stripe_chekout/StripeCheckout";
import { useDisclosure } from "@mantine/hooks";
import { use, useEffect, useState } from "react";
import { Form } from "@mantine/form";
import axios from "axios";

const PaymentCardPage = () => {
  //stripe Button
  const [opened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const amount = 1000;

  //Loading State for Paypal
  const [paypalLoading, setPapalLoading] = useState(false);

  //Paypal Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setPapalLoading(true);

      let res = await axios.post("http://localhost:7000/payment");

      console.log("res", res);

      if (res && res.data) {
        // Find the payment gateway URL
        const paymentGatewayUrl: any = res.data.links.find(
          (link: any) => link.rel === "approval_url"
        )?.href;

        // Check if paymentGatewayUrl is found before redirecting
        if (paymentGatewayUrl) {
          window.location.href = paymentGatewayUrl;
          setPapalLoading(false);
        } else {
          console.error("Approval URL not found in the response.");
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  //SSL Commerz Start
  const handleSSLSubmit = async () => {
    try {
      // Customer details to be sent in the request body
      const customerDetails = {
        address: "Uttara",
        currency: "BDT",
        name: "Salim Al Sazu",
        phone: "01714486218",
        postCode: "1230",
      };

      fetch("http://localhost:7000/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(customerDetails),
      })
        .then((res) => res.json())
        .then((result) => {
          window.location.replace(result.url);
        });
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  //Surjo Pay Start

  const [loadingSurjoPay, setLoadingSurjoPay] = useState(false);

  const handlePaymentSurjoPay = async () => {
    setLoadingSurjoPay(true);
    try {
      // Call the API route to initiate payment
      const response = await axios.post("http://localhost:7000/surjo-pay");
      const { checkout_url } = response.data;

      if (checkout_url) {
        // Redirect to the SurjoPay checkout page
        window.location.href = checkout_url;
      } else {
        alert("Failed to get the checkout URL.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("An error occurred during payment initiation.");
    } finally {
      setLoadingSurjoPay(false);
    }
  };

  const [amarPayloading, setAmarPayLoading] = useState(false);

  const handlePaymentAmarPay = async () => {
    setAmarPayLoading(true);
    try {
      // Call the API route to initiate payment
      const response = await axios.post("http://localhost:7000/amar-pay");
      const { payment_url } = response.data;

      if (payment_url) {
        // Redirect to the SurjoPay checkout page
        window.location.href = payment_url;
      } else {
        alert("Failed to get the checkout URL.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("An error occurred during payment initiation.");
    } finally {
      setAmarPayLoading(false);
    }
  };

  return (
    <div className=" grid justify-center items-center h-screen  ">
      <Card className="w-60" shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>Norway Fjord Adventures</Text>
          <Badge color="pink">On Sale</Badge>
        </Group>

        <p className="mx-auto">Tk {amount}</p>

        <Button onClick={openDrawer} color="blue" fullWidth mt="md" radius="md">
          Book with stripe
        </Button>

        <Button
          onClick={handleSubmit}
          color="blue"
          fullWidth
          mt="md"
          radius="md"
        >
          {!paypalLoading ? (
            " Book with paypal"
          ) : (
            <div>
              <Loader color="lime" type="dots" />
            </div>
          )}
        </Button>
        <Button
          onClick={handleSSLSubmit}
          color="blue"
          fullWidth
          mt="md"
          radius="md"
        >
          Book with SSL
        </Button>

        <Button
          onClick={handlePaymentSurjoPay}
          color="blue"
          fullWidth
          mt="md"
          radius="md"
        >
          {!loadingSurjoPay ? "Book with SurjoPay" : <div>Processing...</div>}
        </Button>

        <Button
          onClick={handlePaymentAmarPay}
          color="blue"
          fullWidth
          mt="md"
          radius="md"
        >
          {!amarPayloading ? "Book with Amar Pay" : <div>Processing...</div>}
        </Button>
      </Card>

      <div>
        <StripeCheckout
          opened={opened}
          closeDrawer={closeDrawer}
          amount={amount}
        />
      </div>
    </div>
  );
};

export default PaymentCardPage;
