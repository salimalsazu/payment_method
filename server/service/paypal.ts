const axios = require("axios");

async function generateAccessToke() {
  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
    method: "POST",
    data: "grant_type=client_credentials",
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_CLIENT_SECRET,
    },
  });

  //   console.log(response.data);

  return response.data.access_token;
}

export const createOrder = async () => {
  const accessToken = await generateAccessToke();

  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + "/v2/checkout/orders",
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          items: [
            {
              name: "T-shirt",
              description: "Green XL",
              quantity: 1,
              unit_amount: {
                currency_code: "USD",
                value: "1000.00",
              },
            },
          ],
          amount: {
            currency_code: "USD",
            value: "1000.00",
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: "1000.00",
              },
            },
          },
        },
      ],
      application_context: {
        return_url: "http://localhost:3000/complete-order",
        cancel_url: "http://localhost:3000/cancel-order",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        // brand_name: "Salim Al Sazu",
      },
    }),
  });
  //   console.log(response.data);
  return response.data.links.find((link: any) => link.rel === "approve").href;
};

// createOrder().then((data) => console.log(data));
