import React from "react";
import { Link } from "react-router-dom";
import Search from "./Search";

const Navbar = () => {
  return (
    <div className="h-16 leading-1.5 flex justify-between px-[5vw] items-center bg-dark text-white border-b border-gray-800">
      <Link to="/" className="flex gap-2 items-center">
        <img src="/icon.png" alt="" className="w-8 h-8" />
        <h1 className="text-xl"> MiniZing</h1>
      </Link>
      <Search />
    </div>
  );
};

export default Navbar;
