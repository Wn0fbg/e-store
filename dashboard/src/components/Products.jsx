import React, { useState, useEffect } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import CreateProductModal from "../modals/CreateProductModal";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";

const Products = () => {
  return (
    <>
      <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
        <div className="flex-1 md:p-6">
          <Header />
          <h1 className="text-2xl font-bold">All products</h1>
          <p className="text-sm text-gray-600 mb-6">
            Manage all your products.
          </p>
        </div>

        <button
          onClick={() => dispatch(toggleCreateProdcutModal())}
          className={`fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 
          rounded-full shadow-lg z-50 transition-all duration-300`}
          title="Create new product"
        >
          <Plus size={20} />
        </button>
      </main>
    </>
  );
};

export default Products;
