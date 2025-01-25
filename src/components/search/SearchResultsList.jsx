import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({ results }) => {
  return (
    <div className="w-full bg-white flex flex-col shadow-md rounded-lg mt-4 max-h-[300px] overflow-y-auto">
      {results.map((result, id) => {
        return <SearchResult result={result.name} key={id} />;
      })}
    </div>
  );
};