import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CreditCard, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { toggleOrderStep } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";

const PaymentForm = () => {
  const clientSecret = useState((state) => state.paymentIntent);
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState("");

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    // const cardElement = elements.getElement(cardElement);
    // const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
    //   payment_method: {
    //     card: cardElement
    //   }
    // })

    // if (error) {
    //   setErrorMessage(error)
    // } else if (paymentIntent && paymentIntent.status === "succeeded") {
    //   toast.success("Payment successfuly.")
    //   navigateTo("/")
    // }

    setIsProcessing(false);
    dispatch(toggleOrderStep());
    dispatch(clearCart());
  };

  return <></>;
};

export default PaymentForm;
