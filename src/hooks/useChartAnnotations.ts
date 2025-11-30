import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ChartAnnotation {
  id: string;
  date: string;
  label: string;
  description?: string;
  color: string;
  type: "event" | "milestone" | "alert";
  chart_id?: string;
  is_shared: boolean;
  shared_by_name?: string;
  user_id?: string;
  category?: string;
  tags?: string[];
}

export const ANNOTATION_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "security", label: "Security" },
  { value: "compliance", label: "Compliance" },
  { value: "operations", label: "Operations" },
  { value: "incident", label: "Incident" },
  { value: "maintenance", label: "Maintenance" },
] as const;

export type AnnotationCategory = typeof ANNOTATION_CATEGORIES[number]["value"];

export const useChartAnnotations = (chartId?: string) => {
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([]);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch annotations from database (own + shared)
  const fetchAnnotations = useCallback(async () => {
    if (!user) {
      setAnnotations([]);
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase
        .from("chart_annotations")
        .select("*")
        .order("created_at", { ascending: false });

      if (chartId) {
        query = query.eq("chart_id", chartId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching annotations:", error);
        return;
      }

      setAnnotations(
        (data || []).map((item) => ({
          id: item.id,
          date: item.date,
          label: item.label,
          description: item.description || undefined,
          color: item.color,
          type: item.type as "event" | "milestone" | "alert",
          chart_id: item.chart_id || undefined,
          is_shared: item.is_shared,
          shared_by_name: item.shared_by_name || undefined,
          user_id: item.user_id,
          category: item.category || "general",
          tags: item.tags || [],
        }))
      );
    } catch (error) {
      console.error("Error fetching annotations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, chartId]);

  useEffect(() => {
    fetchAnnotations();
  }, [fetchAnnotations]);

  const addAnnotation = useCallback(
    async (annotation: Omit<ChartAnnotation, "id" | "is_shared" | "user_id">) => {
      if (!user) {
        toast.error("You must be logged in to add annotations");
        return;
      }

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .maybeSingle();

        const sharedByName = profile?.full_name || profile?.email || "Unknown";

        const { data, error } = await supabase
          .from("chart_annotations")
          .insert({
            user_id: user.id,
            date: annotation.date,
            label: annotation.label,
            description: annotation.description || null,
            color: annotation.color,
            type: annotation.type,
            chart_id: chartId || null,
            is_shared: false,
            shared_by_name: sharedByName,
            category: annotation.category || "general",
            tags: annotation.tags || [],
          })
          .select()
          .single();

        if (error) {
          console.error("Error adding annotation:", error);
          toast.error("Failed to save annotation");
          return;
        }

        const newAnnotation: ChartAnnotation = {
          id: data.id,
          date: data.date,
          label: data.label,
          description: data.description || undefined,
          color: data.color,
          type: data.type as "event" | "milestone" | "alert",
          chart_id: data.chart_id || undefined,
          is_shared: data.is_shared,
          shared_by_name: data.shared_by_name || undefined,
          user_id: data.user_id,
          category: data.category || "general",
          tags: data.tags || [],
        };

        setAnnotations((prev) => [newAnnotation, ...prev]);
        toast.success("Annotation saved");
      } catch (error) {
        console.error("Error adding annotation:", error);
        toast.error("Failed to save annotation");
      }
    },
    [user, chartId]
  );

  const removeAnnotation = useCallback(
    async (id: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from("chart_annotations")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          console.error("Error removing annotation:", error);
          toast.error("Failed to remove annotation");
          return;
        }

        setAnnotations((prev) => prev.filter((a) => a.id !== id));
        toast.success("Annotation removed");
      } catch (error) {
        console.error("Error removing annotation:", error);
        toast.error("Failed to remove annotation");
      }
    },
    [user]
  );

  const toggleShare = useCallback(
    async (id: string) => {
      if (!user) return;

      const annotation = annotations.find((a) => a.id === id);
      if (!annotation || annotation.user_id !== user.id) {
        toast.error("You can only share your own annotations");
        return;
      }

      try {
        const { error } = await supabase
          .from("chart_annotations")
          .update({ is_shared: !annotation.is_shared })
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          console.error("Error toggling share:", error);
          toast.error("Failed to update sharing");
          return;
        }

        setAnnotations((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, is_shared: !a.is_shared } : a
          )
        );
        toast.success(annotation.is_shared ? "Annotation is now private" : "Annotation shared with team");
      } catch (error) {
        console.error("Error toggling share:", error);
        toast.error("Failed to update sharing");
      }
    },
    [user, annotations]
  );

  const toggleAnnotations = useCallback(() => {
    setShowAnnotations((prev) => !prev);
  }, []);

  return {
    annotations,
    showAnnotations,
    isLoading,
    addAnnotation,
    removeAnnotation,
    toggleShare,
    toggleAnnotations,
    currentUserId: user?.id,
  };
};
