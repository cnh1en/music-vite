import React, { FC, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [inputSearch, setInputSearch] = useState("");
  const navigate = useNavigate();

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (inputSearch.trim()) {
      setInputSearch("");
      navigate(`/search?q=${encodeURIComponent(inputSearch.trim())}`);
    }
  };

  return (
    <>
      <form
        onSubmit={handleOnSubmit}
        className="border-gray-600 outline-none border rounded-full py-1.5 px-4"
      >
        <input
          type="text"
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
          placeholder="Search..."
          className="bg-dark outline-none focus:outline-none"
          onChange={(e) => setInputSearch(e.target.value)}
          value={inputSearch}
        />
        <i className="ri-search-line"></i>
      </form>
    </>
  );
};

export default Search;
