"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const googleSignInAction = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://noteninjaapp.netlify.app/notes",
    },
  });

  if (error) {
    return redirect("/sign-in?error=" + encodeURIComponent(error.message));
  }

  return redirect(data.url);
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/notes");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/notes/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/notes/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/notes/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/notes/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/notes/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const noteAddingAction = async (title: string, description: string, color_id: string, userId: string) => {
  if (!title || !description || !userId) {
    return encodedRedirect(
      "error",
      "/notes",
      "Title, description, and user ID are required",
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .insert([{ title, description, user_id: userId, color: color_id }])
    .select()
    .single();

  if (error) {
    return encodedRedirect("error", "/notes", error.message);
  }

  return data;
}

export const noteUpdatingAction = async (noteId: string, title: string, description: string, color_id: string) => {
  if (!noteId || !title || !description) {
    return encodedRedirect(
      "error",
      "/notes",
      "Note ID, title, and description are required",
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .update({ title, description, color: color_id })
    .eq("id", noteId)
    .select()
    .single();

  if (error) {
    return encodedRedirect("error", "/notes", error.message);
  }

  return data;
};

export const getAllNotesAction = async (userId: string) => {
  if (!userId) {
    return encodedRedirect("error", "/notes", "User ID is required");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return encodedRedirect("error", "/notes", error.message);
  }

  return data;
}

export const deleteNoteAction = async (noteId: string) => {
  if (!noteId) {
    return encodedRedirect("error", "/notes", "Note ID is required");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId);

  if (error) {
    return encodedRedirect("error", "/notes", error.message);
  }

  return true;
};

export const updateProfileAction = async (formData: FormData) => {
  const name = formData.get("name")?.toString();
  const avatarUrl = formData.get("avatarUrl")?.toString();
  const userId = formData.get("userId")?.toString();

  if (!name || !avatarUrl || !userId) {
    return encodedRedirect(
      "error",
      "/profile",
      "Name, avatar URL, and user ID are required",
    );
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ name, avatar_url: avatarUrl })
    .eq("id", userId);

  if (error) {
    return encodedRedirect("error", "/profile", error.message);
  }

  return redirect("/profile");
};
