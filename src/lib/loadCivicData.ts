import { supabase } from "./supabase";

export type ProjectRow = {
  id: string;
  name: string;
  code: string;
  ward: string;
  category: string;
  original_cost: number;
  revised_cost: number;
  original_scope_km: number;
  revised_scope_km: number;
  original_duration_months: number;
  revised_duration_months: number;
};

export type EvidenceRow = {
  id: string;
  project_id: string;
  label: string;
  status: "Found" | "Missing" | "Needs review";
  detail: string;
};

export async function loadCivicData() {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("code", "WD07-SD-2023-114")
    .single();

  if (projectError) {
    throw projectError;
  }

  const { data: projectDocuments, error: documentsError } =
    await supabase
      .from("project_documents")
      .select(`
        sequence_number,
        documents (
          id,
          title,
          document_type,
          publication_date,
          page_reference,
          is_synthetic
        )
      `)
      .eq("project_id", project.id)
      .order("sequence_number", { ascending: true });

  if (documentsError) {
    throw documentsError;
  }

  const { data: evidence, error: evidenceError } =
    await supabase
      .from("evidence_gaps")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: true });

  if (evidenceError) {
    throw evidenceError;
  }

  return {
    project: project as ProjectRow,
    projectDocuments,
    evidence: evidence as EvidenceRow[],
  };
}
export async function saveCivicReport(
  projectId: string,
  content: {
    title: string;
    summary: string;
    changes: string[];
    verified: string[];
    missingEvidence: string[];
    questions: string[];
  },
) {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase
    .from("reports")
    .insert({
      project_id: projectId,
      content,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}