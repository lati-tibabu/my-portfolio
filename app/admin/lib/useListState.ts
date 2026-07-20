"use client";

import { useEffect, useMemo, useState } from "react";

export type UseListStateOptions<T> = {
  records: T[];
  match: (record: T, query: string) => boolean;
  getId: (record: T) => string;
  pageSize?: number;
};

export type UseListStateResult<T> = {
  query: string;
  setQuery: (value: string) => void;
  filtered: T[];
  paged: T[];
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
  selected: Set<string>;
  selectedCount: number;
  allSelected: boolean;
  toggleSelected: (id: string) => void;
  setSelected: (id: string, selected: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectedIds: string[];
};

export function useListState<T>({
  records,
  match,
  getId,
  pageSize = 8,
}: UseListStateOptions<T>): UseListStateResult<T> {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) {
      return records;
    }
    return records.filter((record) => match(record, normalizedQuery));
  }, [records, normalizedQuery, match]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Reset to page 1 whenever the filter or record set changes the page count.
  useEffect(() => {
    setPage(1);
  }, [normalizedQuery, records]);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const paged = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  );

  const filteredIds = useMemo(
    () => filtered.map((record) => getId(record)),
    [filtered, getId],
  );

  const allSelected =
    filtered.length > 0 && filteredIds.every((id) => selected.has(id));

  const toggleSelected = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const setOne = (id: string, isSelected: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      if (isSelected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelected((current) => {
      const next = new Set(current);
      for (const id of filteredIds) {
        next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  // Drop ids that no longer exist in the record set.
  useEffect(() => {
    const validIds = new Set(records.map((record) => getId(record)));
    setSelected((current) => {
      let changed = false;
      const next = new Set<string>();
      for (const id of current) {
        if (validIds.has(id)) {
          next.add(id);
        } else {
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [records, getId]);

  return {
    query,
    setQuery,
    filtered,
    paged,
    page,
    pageCount,
    setPage,
    selected,
    selectedCount: selected.size,
    allSelected,
    toggleSelected,
    setSelected: setOne,
    selectAll,
    clearSelection,
    selectedIds: [...selected],
  };
}