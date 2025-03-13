import { useSearchParams } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const sortOptions = [
  { id: "", name: "Default" },
  { id: "priceAsc", name: "Price: Low to High" },
  { id: "priceDesc", name: "Price: High to Low" },
  { id: "popularity", name: "Popularity" },
];

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSort = searchParams.get("sortBy") || "";

  const handleSortChange = (option) => {
    searchParams.set("sortBy", option.id);
    setSearchParams(searchParams);
  };

  return (
    <div className="flex justify-end w-full">
      <div className="relative w-64">
        <Listbox value={sortOptions.find((o) => o.id === selectedSort)} onChange={handleSortChange}>
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 px-4 pr-10 text-left border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {sortOptions.find((o) => o.id === selectedSort)?.name || "Default"}
            <ChevronDownIcon className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
          </Listbox.Button>

          <Listbox.Options className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg focus:outline-none overflow-hidden">
            {sortOptions.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option}
                className={({ active }) =>
                  `cursor-pointer select-none w-full px-4 py-2 flex items-center transition ${
                    active ? "bg-blue-500 text-white" : "text-gray-900"
                  }`
                }
              >
                {option.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
    </div>
  );
};

export default SortOptions;

 {/* if I have Error use this  */}
// import { useSearchParams } from "react-router-dom";

// const SortOptions = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const handleSortChange = (e) => {
//     const sortBy = e.target.value;
//     searchParams.set("sortBy", sortBy);
//     setSearchParams(searchParams);
//   };

//   return (
//     <div className="mb-4 flex items-center justify-end">
//       <select
//         id="sort"
//         onChange={handleSortChange}
//         value={searchParams.get("sortBy") || ""}
//         className="border p-2 rounded-md focus:outline-none"
//       >
//         <option value="">Default</option>
//         <option value="priceAsc">Price: Low to High</option>
//         <option value="priceDesc">Price: High to Low</option>
//         <option value="popularity">Popularity</option>
//       </select>
//     </div>
//   );
// };

// export default SortOptions;