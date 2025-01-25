import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { SearchResultsList } from "./SearchResultsList";

export const SearchR = () => {
  const [results, setResults] = useState([]);

  return (
    <div className="bg-gray-200 w-screen h-screen">
      <div className="pt-[20vh] w-2/5 mx-auto flex flex-col items-center min-w-[200px]">
        <SearchBar setResults={setResults} />
        {results && results.length > 0 && <SearchResultsList results={results} />}
      </div>
    </div>
  );
};

