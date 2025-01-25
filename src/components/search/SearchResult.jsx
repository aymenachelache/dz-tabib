export const SearchResult = ({ result }) => {
    return (
      <div
        className="p-2.5 hover:bg-gray-100 cursor-pointer"
        onClick={(e) => alert(`You selected ${result}!`)}
      >
        {result}
      </div>
    );
  };