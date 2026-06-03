import React, { useState } from "react";
import { NavigateFunction } from "react-router";
import { toast } from "react-toastify";

const HeaderSearch = ({ navigate }: { navigate: NavigateFunction }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const search = () => {
    if (!searchQuery.trim()) {
      toast.error("검색어를 입력해주세요");
      return;
    }
    void navigate(`/search-results/${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  return (
    <div className="hidden pl-10 mt-1 lg:flex md:w-[30%] lg:w-[40%] justify-center">
      <div className="relative w-full max-w-lg">
        <input
          type="text"
          placeholder="공연 검색"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
            event.key === "Enter" && search()
          }
          className="w-full py-2 pl-5 pr-12 text-sm text-gray-700 rounded-full shadow-lg bg-white outline-none placeholder-gray-400 focus:ring-2 focus:ring-gray-400"
        />
      </div>
    </div>
  );
};

export default HeaderSearch;
