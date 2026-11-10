import { useRef, useState, type ChangeEvent, type SubmitEvent } from "react";
import { Button } from "../../ui/Button";
import { SearchInput } from "./SearchInput";

export type Filter = { from: string; to: string };

type SearchFormProps = {
  onSearch: (filter: Filter) => void;
  onClear: () => void;
};

export function SearchForm({ onSearch, onClear }: SearchFormProps) {
  const [filter, setFilter] = useState<Filter>({ from: "Lisbon", to: "Porto" });
  const fromRef = useRef<HTMLInputElement>(null);

   const canSearch = filter.from !== '' && filter.to !== '';

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSearch(filter)
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFilter((f) => ({ ...f, [name]: value }));
  }

  function clear(): void {
    setFilter({ from: "", to: "" });
    onClear();
    fromRef.current?.focus();
  }

  return (
    <>
      {/* Hoisting (elevar) para a Head do DOM */}
      <title>{`Skyline • ${filter.from || "…"} ➜ ${filter.to || "…"}`}</title>

      <form className="search" onSubmit={handleSubmit}>
        <SearchInput
          ref={fromRef}
          label="From"
          name="from"
          value={filter.from}
          onChange={handleChange}
        />
        <SearchInput
          label="To"
          name="to"
          value={filter.to}
          onChange={handleChange}
        />
        <Button type="submit" disabled={!canSearch}>
          Search
        </Button>
        <Button variant="ghost" onClick={clear}>
          Clear
        </Button>
      </form>
    </>
  );
}
