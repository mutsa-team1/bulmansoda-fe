import { forwardRef } from "react";
import searchIcon from "../assets/search.png";

const SearchBar = forwardRef(function SearchBar({ onSearch }, ref) {
  return (
    <section
      className="absolute top-3 left-3 right-3 z-10 
                  flex items-center gap-2
                bg-white rounded-[20px] px-1 pl-3 py-0.5 shadow-2xl"
    >
      <input
        ref={ref}
        className="flex-1 h-4 px-3 rounded-lg  
                    placeholder:text-gray-400 text-[12px]
                    focus:outline-none "
        placeholder="장소를 검색하세요."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
            e.currentTarget.blur(); // ✅ 입력창 포커스 해제
          }
        }}
      />

      <button
        type="button"
        onClick={onSearch}
        className="h-[30px] px-3 rounded-lg font-medium 
                    hover:bg-gray-100"
        aria-label="search"
      >
        <img src={searchIcon} alt="search" className="h-[18px] w-[18px]" />
      </button>
    </section>
  );
});

export default SearchBar;
