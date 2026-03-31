import { useState, useEffect } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import {
  forgotPassoword,
  login,
  register,
  resetPassword,
} from "../../store/slices/authSlice";

const LoginModal = () => {
  return <></>;
};

export default LoginModal;
