import type { ChartAnnotation } from "@/hooks/useChartAnnotations";

export const exportAnnotationsToJSON = (annotations: ChartAnnotation[], filename = "annotations") => {
  const data = annotations.map(({ id, date, label, description, color, type, category, tags, is_shared }) => ({
    date,
    label,
    description,
    color,
    type,
    category,
    tags,
    is_shared,
  }));

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  downloadBlob(blob, `${filename}.json`);
};

export const exportAnnotationsToCSV = (annotations: ChartAnnotation[], filename = "annotations") => {
  const headers = ["Date", "Label", "Description", "Type", "Category", "Tags", "Shared"];
  const rows = annotations.map((a) => [
    a.date,
    `"${(a.label || "").replace(/"/g, '""')}"`,
    `"${(a.description || "").replace(/"/g, '""')}"`,
    a.type,
    a.category || "general",
    `"${(a.tags || []).join(", ")}"`,
    a.is_shared ? "Yes" : "No",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
