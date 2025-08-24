import { forwardRef } from "react";
import searchIcon from "../assets/search.png";

const SearchBar = forwardRef(function SearchBar({ onSearch }, ref) {
  return (
    <section
      className="absolute top-3 left-3 right-3 z-10 
                  flex items-center gap-2
                bg-white rounded-2xl px-3 pl-3 py-2 shadow-2xl"
    >
      <input
        ref={ref}
        className="flex-1 h-10 px-3 rounded-lg  
                    placeholder:text-gray-400
                    focus:outline-none "
        placeholder="장소를 검색하세요."
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />

      <button
        type="button"
        onClick={onSearch}
        className="h-[40px] px-3 rounded-lg font-medium 
                    hover:bg-gray-100 active:bg-gray-200  ]"
        aria-label="search"
      >
        <img src={searchIcon} alt="search" className="h-[30px] w-[30px]" />
      </button>
    </section>
  );
});

export default SearchBar;
