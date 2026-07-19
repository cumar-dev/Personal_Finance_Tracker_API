import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Search } from "lucide-react";
const SearchTransaction = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
  return (
    <div className="p-3">
      <div className="flex items-center bg-[#f0f0f0] rounded-full px-2 py-1.5 mx-3 w-full max-w-md border border-transparent focus-within:border-[#e5e5e5] focus-within:bg-white transition-all">
        <Search size={15} className="text-muted-foreground ml-2 shrink-0" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={query}
          onChange={handleChange}
          className="flex-1 h-7 bg-transparent border-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground px-2"
        />
      </div>
    </div>
  );
};

export default SearchTransaction;
