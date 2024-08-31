const PaymentSuccess = ({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>Payment successful </h1>
      <p>Amount: ${amount}</p>
    </div>
  );
};

export default PaymentSuccess;
