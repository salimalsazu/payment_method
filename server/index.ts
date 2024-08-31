require("dotenv").config();
import express from "express";
import cors from "cors";
// import paypal from "paypal-rest-sdk";

//Paypal auth File Get
// const paypal = require("./service/paypal");
const paypal = require("paypal-rest-sdk");

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
