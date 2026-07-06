import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Check, ChevronLeft, ChevronRight, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type AdminInputType = "text" | "number" | "email" | "textarea" | "select";

export interface AdminTableColumn<T extends { id: number | string }> {
  key: keyof T & string;
  header: string;
  editable?: boolean;
  inputType?: AdminInputType;
  options?: Array<{ label: string; value: string | number }>;
  className?: string;
  cellClassName?: string;
  render?: (row: T) => ReactNode;
}

interface AdminEditableTableProps<T extends { id: number | string }> {
  rows: T[];
  columns: Array<AdminTableColumn<T>>;
  emptyLabel: string;
  searchKeys?: Array<keyof T & string>;
  onSave?: (row: T) => void | Promise<void>;
  onDelete?: (row: T) => void | Promise<void>;
  onEditRow?: (row: T) => void;
  confirmDeleteMessage?: (row: T) => string;
  hideEdit?: boolean;
  hideDelete?: boolean;
}

const pageSizes = [25, 50, 100];

const AdminEditableTable = <T extends { id: number | string }>({
  rows,
  columns,
  emptyLabel,
  searchKeys = [],
  onSave,
  onDelete,
  onEditRow,
  confirmDeleteMessage,
  hideEdit = false,
  hideDelete = false,
}: AdminEditableTableProps<T>) => {
  const [tableRows, setTableRows] = useState<T[]>(rows);
  const [editingId, setEditingId] = useState<T["id"] | null>(null);
  const [draft, setDraft] = useState<Partial<T>>({});
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setTableRows(rows);
  }, [rows]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return tableRows;
    const query = search.trim().toLowerCase();
    const keys = searchKeys.length ? searchKeys : columns.map((column) => column.key);

    return tableRows.filter((row) =>
      keys.some((key) => String(row[key] ?? "").toLowerCase().includes(query)),
    );
  }, [columns, search, searchKeys, tableRows]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const visibleRows = filteredRows.slice(start, start + pageSize);

  useEffect(() => {
    setPage(1);
  }, [pageSize, search]);

  const startEdit = (row: T) => {
    setEditingId(row.id);
    setDraft(row);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const updateDraft = (key: keyof T & string, value: string | number) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveEdit = async () => {
    if (editingId === null) return;

    const originalRows = tableRows;
    const updatedRow = { ...(tableRows.find((row) => row.id === editingId) as T), ...draft } as T;
    setTableRows((current) => current.map((row) => (row.id === editingId ? updatedRow : row)));

    try {
      await onSave?.(updatedRow);
      cancelEdit();
    } catch (error) {
      console.error(error);
      setTableRows(originalRows);
    }
  };

  const deleteRow = async (row: T) => {
    if (confirmDeleteMessage && !window.confirm(confirmDeleteMessage(row))) {
      return;
    }

    const originalRows = tableRows;
    setTableRows((current) => current.filter((item) => item.id !== row.id));

    try {
      await onDelete?.(row);
    } catch (error) {
      console.error(error);
      setTableRows(originalRows);
    }
  };

  const renderEditor = (row: T, column: AdminTableColumn<T>) => {
    const value = draft[column.key] ?? row[column.key] ?? "";
    const commonClass =
      "min-w-36 border-border bg-background text-foreground placeholder:text-muted-foreground";

    if (column.inputType === "textarea") {
      return (
        <Textarea
          value={String(value)}
          onChange={(event) => updateDraft(column.key, event.target.value)}
          className={cn("min-h-20 min-w-60 resize-y", commonClass)}
        />
      );
    }

    if (column.inputType === "select") {
      return (
        <select
          value={String(value)}
          onChange={(event) => {
            const rawValue = event.target.value;
            const numericOption = column.options?.find((option) => String(option.value) === rawValue);
            updateDraft(column.key, typeof numericOption?.value === "number" ? Number(rawValue) : rawValue);
          }}
          className={cn(
            "h-10 min-w-36 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
            commonClass,
          )}
        >
          {column.options?.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <Input
        type={column.inputType === "number" ? "number" : column.inputType === "email" ? "email" : "text"}
        value={String(value)}
        onChange={(event) =>
          updateDraft(
            column.key,
            column.inputType === "number" ? Number(event.target.value) : event.target.value,
          )
        }
        className={commonClass}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search table..."
          className="max-w-sm border-border bg-card"
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows</span>
          <select
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
            className="h-10 rounded-md border border-border bg-card px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader className="bg-secondary/70">
            <TableRow className="hover:bg-secondary/70">
              {columns.map((column) => (
                <TableHead key={column.key} className={cn("whitespace-nowrap", column.className)}>
                  {column.header}
                </TableHead>
              ))}
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-28 text-center text-muted-foreground">
                  {emptyLabel}
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((row) => {
                const isEditing = editingId === row.id;

                return (
                  <TableRow key={row.id} className="align-top">
                    {columns.map((column) => (
                      <TableCell key={column.key} className={cn("min-w-32", column.cellClassName)}>
                        {isEditing && column.editable ? renderEditor(row, column) : column.render ? column.render(row) : String(row[column.key] ?? "-")}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <Button type="button" size="icon" onClick={saveEdit} title="Save row">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button type="button" size="icon" variant="outline" onClick={cancelEdit} title="Cancel edit">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                          {!hideEdit &&(
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={() => (onEditRow ? onEditRow(row) : startEdit(row))}
                              title="Edit row"
                            >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          )}
                            {!hideDelete && (
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                onClick={() => deleteRow(row)}
                                title="Delete row"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {filteredRows.length === 0 ? 0 : start + 1}-{Math.min(start + pageSize, filteredRows.length)} of{" "}
          {filteredRows.length}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <span className="min-w-20 text-center">
            {currentPage} / {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === pageCount}
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditableTable;
