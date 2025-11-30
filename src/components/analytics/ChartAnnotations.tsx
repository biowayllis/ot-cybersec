import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flag, Eye, EyeOff, Plus, X, Share2, Lock, Users, Filter, Tag, Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ChartAnnotation } from "@/hooks/useChartAnnotations";
import { ANNOTATION_CATEGORIES } from "@/hooks/useChartAnnotations";
import { exportAnnotationsToCSV, exportAnnotationsToJSON } from "@/utils/exportAnnotations";

interface ChartAnnotationsProps {
  annotations: ChartAnnotation[];
  showAnnotations: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onToggleShare?: (id: string) => void;
  currentUserId?: string;
}

export const ChartAnnotationsControl = ({
  annotations,
  showAnnotations,
  onToggle,
  onAdd,
}: ChartAnnotationsProps) => {
  const sharedCount = annotations.filter((a) => a.is_shared).length;

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className={showAnnotations ? "bg-primary/10" : ""}
            >
              {showAnnotations ? (
                <Eye className="h-4 w-4 mr-1" />
              ) : (
                <EyeOff className="h-4 w-4 mr-1" />
              )}
              <Flag className="h-4 w-4" />
              {sharedCount > 0 && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({sharedCount} shared)
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {showAnnotations ? "Hide annotations" : "Show annotations"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button variant="outline" size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4 mr-1" />
        Annotate
      </Button>
      {annotations.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportAnnotationsToCSV(annotations)}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportAnnotationsToJSON(annotations)}>
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

interface AnnotationListProps {
  annotations: ChartAnnotation[];
  onRemove: (id: string) => void;
  onToggleShare?: (id: string) => void;
  currentUserId?: string;
}

export const AnnotationList = ({
  annotations,
  onRemove,
  onToggleShare,
  currentUserId,
}: AnnotationListProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique tags from all annotations
  const allTags = Array.from(
    new Set(annotations.flatMap((a) => a.tags || []))
  ).sort();

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
  };

  // Filter annotations based on selected categories and tags
  const filteredAnnotations = annotations.filter((annotation) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(annotation.category || "general");
    const tagMatch =
      selectedTags.length === 0 ||
      (annotation.tags || []).some((tag) => selectedTags.includes(tag));
    return categoryMatch && tagMatch;
  });

  const hasActiveFilters = selectedCategories.length > 0 || selectedTags.length > 0;

  if (annotations.length === 0) return null;

  return (
    <div className="space-y-2 mt-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={hasActiveFilters ? "bg-primary/10" : ""}>
              <Filter className="h-3 w-3 mr-1" />
              Filter
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                  {selectedCategories.length + selectedTags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Categories</h4>
                <div className="space-y-2">
                  {ANNOTATION_CATEGORIES.map((category) => (
                    <div key={category.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category.value}`}
                        checked={selectedCategories.includes(category.value)}
                        onCheckedChange={() => toggleCategory(category.value)}
                      />
                      <Label
                        htmlFor={`cat-${category.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              {allTags.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleTag(tag)}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                  Clear Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <span className="text-xs text-muted-foreground">
            Showing {filteredAnnotations.length} of {annotations.length}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {filteredAnnotations.map((annotation) => {
          const isOwner = annotation.user_id === currentUserId;
          const categoryLabel = ANNOTATION_CATEGORIES.find(
            (c) => c.value === annotation.category
          )?.label;

          return (
            <Badge
              key={annotation.id}
              variant="outline"
              className="flex items-center gap-1 pr-1 py-1"
              style={{ borderColor: annotation.color }}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: annotation.color }}
              />
              <span className="text-xs">{annotation.label}</span>
              {categoryLabel && categoryLabel !== "General" && (
                <span className="text-xs text-muted-foreground">({categoryLabel})</span>
              )}
              {(annotation.tags || []).length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Tag className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Tags: {(annotation.tags || []).join(", ")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {annotation.is_shared && !isOwner && annotation.shared_by_name && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Users className="h-3 w-3 text-muted-foreground ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Shared by {annotation.shared_by_name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {isOwner && onToggleShare && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onToggleShare(annotation.id)}
                        className="ml-1 hover:bg-muted rounded p-0.5"
                      >
                        {annotation.is_shared ? (
                          <Share2 className="h-3 w-3 text-primary" />
                        ) : (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {annotation.is_shared ? "Click to make private" : "Click to share with team"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {isOwner && (
                <button
                  onClick={() => onRemove(annotation.id)}
                  className="ml-1 hover:bg-muted rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
