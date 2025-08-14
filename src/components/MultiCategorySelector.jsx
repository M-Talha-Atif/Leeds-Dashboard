import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";

export default function MultiCategorySelector({ categories, selected, onChange }) {
  const allSelected = categories.every((cat) => selected.includes(cat));

  const toggleCategory = (cat) => {
    if (selected.includes(cat)) {
      onChange(selected.filter((c) => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  };

  const toggleAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange([...categories]);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full md:w-64">
      <Listbox value={selected} onChange={onChange} multiple>
        <div className="relative">
          <Listbox.Button className="w-full border border-gray-300 rounded-lg px-3 py-3 text-left shadow-sm flex justify-between items-center hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150">
            <span className="truncate">
              {selected.length === 0
                ? "Select categories"
                : allSelected
                ? "All selected"
                : selected.length > 2
                ? `${selected.length} selected`
                : selected.join(", ")}
            </span>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <li
                onClick={toggleAll}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 rounded-md mx-1 my-0.5 transition-colors border-b border-gray-200 hover:bg-blue-50 hover:text-blue-900`}
              >
                <span className="block font-semibold">
                  {allSelected ? "Unselect All" : "Select All"}
                </span>
                {allSelected && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                    <Check className="h-5 w-5 animate-scale-up" />
                  </span>
                )}
              </li>

              {categories.map((cat, idx) => (
                <Listbox.Option key={idx} value={cat}>
                  {({ selected: isSelected }) => (
                    <li
                      className={`cursor-pointer select-none relative py-2 pl-3 pr-9 rounded-md mx-1 my-0.5 transition-all duration-150 ${
                        isSelected ? "bg-blue-50 text-blue-900 font-semibold" : "text-gray-900"
                      } hover:border hover:border-blue-200`}
                    >
                      <span className="block truncate">{cat}</span>
                      {isSelected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 animate-scale-up">
                          <Check className="h-5 w-5" />
                        </span>
                      )}
                    </li>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
