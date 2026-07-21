import { supabase } from "./supabase";
import type { BusinessSettings } from "@/types/types";

/**
 * Get business settings
 */
export async function getBusinessSettings(): Promise<BusinessSettings | null> {
  const { data, error } = await supabase
    .from("business_settings")
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Error fetching business settings:", error);
    throw error;
  }

  return data;
}

/**
 * Update business settings
 */
export async function updateBusinessSettings(
  settings: Partial<BusinessSettings>
): Promise<BusinessSettings> {
  const existing = await getBusinessSettings();

  if (!existing) {
    throw new Error("Business settings not found");
  }

  const { data, error } = await supabase
    .from("business_settings")
    .update(settings)
    .eq("id", existing.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating business settings:", error);
    throw error;
  }

  return data;
}

/**
 * Upload logo to Supabase Storage
 */
export async function uploadLogo(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `logo-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("business-logos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading logo:", uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("business-logos")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Delete logo from Supabase Storage
 */
export async function deleteLogo(logoUrl: string): Promise<void> {
  const fileName = logoUrl.split("/").pop();
  if (!fileName) return;

  const { error } = await supabase.storage
    .from("business-logos")
    .remove([fileName]);

  if (error) {
    console.error("Error deleting logo:", error);
    throw error;
  }
}
