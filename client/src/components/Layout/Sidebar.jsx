// import React from "react";
import {
  X,
  Home,
  Package,
  Info,
  HelpCircle,
  ShoppingCart,
  List,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/slices/popupSlice";

const Sidebar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const menuItems = [];
  const { isSidebarOpen } = useSelector((state) => state.popup);
  if (!isSidebarOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => dispatch(toggleSidebar())}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 z-50 glass-panel animate-slide-in-left">
        <div className="flex items-center justify-between p-6 border-b border-[hsla(var(--glass-border))]">
          <h2 className="text-xl font-semibold text-primary">Menu</h2>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
          >
            <X className="size-5 text-primary" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
