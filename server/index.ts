require("dotenv").config();
import express from "express";
import cors from "cors";
import axios from "axios";
//Import Surjo Pay
const shurjopay = require("shurjopay");

// import paypal from "paypal-rest-sdk";
const paypal = require("paypal-rest-sdk");

//Paypal auth File Get
// const paypal = require("./service/paypal");

//SSl Commerz
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; //true for live, false for sandbox

const app = express();

const PORT = process.env.PORT || 7000;
app.use(express.json());
app.use(cors({ origin: "*" }));

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(
  "sk_test_51PtEGQP1foogybyiyRpoTEgY3ZFhH3ELzmHKk942UWe5cj9nV83Z1sez42R2GkUZpbyxr0j2LmtdOXaTfyEo5BRu00a2x5TbE9"
);

app.get("/", (req, res) => {
  res.send("Hello Payment World");
});

// SSL Commerz Start
app.post("/order", async (req, res) => {
  const product = {
    price: 100,
    productName: "Apple",
  };

  const order = req.body;

  const trId = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const tran_id = trId();

  const data = {
    total_amount: product.price,
    currency: order.currency,
    tran_id: "12345", // use unique tran_id for each api call
    success_url: `http://localhost:7000/success-ssl/12345`,
    fail_url: "http://localhost:3000/fail-ssl",
    cancel_url: "http://localhost:3000/cancel-ssl",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: product.productName,
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: order.address,
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: order.postCode,
    cus_country: "Bangladesh",
    cus_phone: order.phone,
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then((apiResponse: any) => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL;
    res.send({ url: GatewayPageURL });
    console.log("Redirecting to: ", GatewayPageURL);
  });
});

app.post("/success-ssl/:id", async (req, res) => {
  const id = req.params;

  try {
    if (id) {
      res.redirect("http://localhost:3000/success-ssl");
      // res.send("Payment SuccessFul");
    }
  } catch (error) {
    console.log(error);
  }
});

// Stripe payment route ---------------------------------------------------------------------
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    // Check if amount is present and a number
    if (!amount || typeof amount !== "number") {
      throw new Error("Invalid amount provided");
    }

    // Check for a reasonable amount range (optional)
    if (amount < 100 || amount > 100000) {
      // Adjust limits as needed
      throw new Error("Amount must be between $1 and $100,000");
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents or the smallest currency unit
      currency: "usd", // Currency of the payment
      payment_method_types: [], // Payment methods accepted if I want to only card then I have to use "card" in array
    });

    // Send client secret to the client
    res.send({
      clientSecret: paymentIntent.client_secret, // Required to complete the payment on the client side
      id: paymentIntent.id, // Unique identifier for the payment intent
      amount: paymentIntent.amount, // Amount intended to be collected
      currency: paymentIntent.currency, // Currency of the payment
      status: paymentIntent.status, // Current status of the payment intent
      created: paymentIntent.created, // Timestamp of when the payment intent was created
      paymentMethodTypes: paymentIntent.payment_method_types, // Payment methods supported
      description: paymentIntent.description || "N/A", // Description if any, or fallback
      customer: paymentIntent.customer || null,
    });
  } catch (error) {
    // Handle errors
    console.log(error);
  }
});

//Paypal configure
paypal.configure({
  mode: "sandbox",
  client_id:
    "AQKRyS5-yXyQJSnljgnG4IVPRfgKUOeYzSGVOsSCLMTuO7Rm8NLgYFc2s8r8IYIFvcK6WDpsc2VQQk3G",
  client_secret:
    "EFE-NEJArrnjoeG3IrrE9OqlWP3F3NmEMI2dHIfodyEeKfXZrZlAUOpPCW7UJntSB1VyFa8UsZyFtJeT",
});

//Paypal Route --------------------------------------------------------------------------------

app.post("/payment", async (req, res) => {
  try {
    let create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/failed",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Red Sox Hat",
                sku: "001",
                price: "25.00",
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: "25.00",
          },
          description: "This is payment description",
        },
      ],
    };

    await paypal.payment.create(
      create_payment_json,
      function (error: any, payment: any) {
        if (error) {
          throw error;
        } else {
          let data = payment;
          res.json(data);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/success/:paymentId", async (req, res) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: "25.00",
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error: any, payment: any) {
        if (error) {
          res.redirect("");
        } else {
          const response = JSON.stringify(payment);
          const ParseResponse = JSON.parse(response);
          return res.redirect("http://localhost:3000/success");
        }
      }
    );
  } catch (error) {}
});

app.get("/failed", async (req, res) => {
  return res.redirect("http://localhost:3000/failed");
});

//Surjo Pay Route --------------------------------------------------------------------------------

async function getToken() {
  try {
    const response = await axios.post(
      "https://sandbox.shurjopayment.com/api/get_token",
      {
        username: "sp_sandbox",
        password: "pyyk97hu&6u6",
      }
    );

    return response.data.token;
  } catch (error) {
    console.error("Error fetching token:");
    throw new Error("Failed to obtain token");
  }
}

app.post("/surjo-pay", async (req, res) => {
  try {
    // Step 1: Generate a token
    const token = await getToken();

    // Step 2: Initiate payment
    const paymentResponse = await axios.post(
      "https://www.sandbox.shurjopayment.com/api/secret-pay",
      {
        prefix: "sp",
        token: token,
        return_url: "http://localhost:3000/sp-success",
        cancel_url: "http://localhost:3000",
        store_id: "1",
        amount: "1000",
        order_id: "sp315689",
        currency: "BDT",
        customer_name: "ATM Fahim",
        customer_address: "Dhaka",
        customer_phone: "01717302935",
        customer_city: "Dhaka",
        customer_post_code: "1212",
        client_ip: req.ip,
      }
    );

    res.json(paymentResponse.data);
  } catch (error) {
    console.error("Error payment");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/sujo-pay-verify", async (req, res) => {
  const { order_id } = req.body;
  const token = await getToken();

  try {
    const verifyResponse = await axios.post(
      "https://www.sandbox.shurjopayment.com/api/verification",
      { order_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(verifyResponse.data);
  } catch (error) {
    console.error("Error verifying payment");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Amar Pay Route

app.post("/amar-pay", async (req, res) => {
  try {
    const amarPayment = await axios.post(
      "https://​sandbox​.aamarpay.com/jsonpost.php",
      {
        store_id: "aamarpaytest",
        tran_id: "asdasdasdasdasd123",
        success_url: "http://www.merchantdomain.com/suc esspage.html",
        fail_url: "http://www.merchantdomain.com/faile dpage.html",
        cancel_url: "http://www.merchantdomain.com/can cellpage.html",
        amount: "10.0",
        currency: "BDT",
        signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
        desc: "Merchant Registration Payment",
        cus_name: "Name",
        cus_email: "payer@merchantcusomter.com",
        cus_add1: "House B-158 Road 22",
        cus_add2: "Mohakhali DOHS",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1206",
        cus_country: "Bangladesh",
        cus_phone: "+8801704",
        type: "json",
      }
    );

    res.json(amarPayment.data);
  } catch (error) {
    console.error("Failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
