"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { List, LayoutGrid, Loader2, Trash2, Pencil, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  deleteNoteAction,
  getAllNotesAction,
  noteAddingAction,
  noteUpdatingAction,
} from "@/app/actions";
import NoteCard from "./NoteCard";

type Note = {
  id: string;
  title: string;
  description: string;
  color?: string;
  created_at: string;
};

const colorMap: Record<string, { light: string; dark: string }> = {
  blue: { light: "#BBE0F4", dark: "#1E3A5F" },
  teal: { light: "#B2F2E6", dark: "#1A3E3D" },
  green: { light: "#D9FBE1", dark: "#1B3C2E" },
  yellow: { light: "#FFF8B0", dark: "#4D4300" },
  pink: { light: "#F8D0E1", dark: "#D84D76" },
  purple: { light: "#E0BBFF", dark: "#6A1D99" },
  orange: { light: "#FFD6A5", dark: "#F57C00" },
  red: { light: "#FFBABA", dark: "#C22B2B" },
  gray: { light: "#E1E1E1", dark: "#2F2F2F" },
  indigo: { light: "#C5CAE9", dark: "#3F51B5" },
};

export default function NoteTaker({
  initialNotes,
  userId,
}: {
  initialNotes: Note[];
  userId: string;
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [colorId, setColorId] = useState<string>("gray");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const storedViewMode = localStorage.getItem("viewMode");
    if (storedViewMode === "list" || storedViewMode === "grid") {
      setViewMode(storedViewMode as "grid" | "list");
    }
  }, []);

  useEffect(() => {
    if (viewMode) {
      localStorage.setItem("viewMode", viewMode);
    }
  }, [viewMode]);

  const getColorFromId = useCallback(
    (id: string | undefined) => {
      if (!mounted || !id) return "#fff";
      return colorMap[id]?.[resolvedTheme === "dark" ? "dark" : "light"];
    },
    [mounted, resolvedTheme]
  );

  const refreshNotes = async () => {
    setLoading(true);
    try {
      const data = await getAllNotesAction(userId);
      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        toast.error("Failed to fetch notes.");
      }
    } catch (err) {
      toast.error("Error refreshing notes.");
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdateNote = async () => {
    if (!title.trim()) return toast.warning("Title is required.");
    setLoading(true);

    try {
      if (editingNoteId) {
        const response = await noteUpdatingAction(editingNoteId, title, description, colorId);
        if (response?.id) {
          setNotes((prev) => prev.map((n) => (n.id === editingNoteId ? response : n)));
          toast.success("Note updated.");
        } else {
          toast.error("Failed to update note.");
        }
      } else {
        const response = await noteAddingAction(title, description, colorId, userId);
        if (response?.id) {
          setNotes((prev) => [response, ...prev]);
          toast.success("Note added.");
        } else {
          toast.error("Failed to add note.");
        }
      }
      resetForm();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const result = await deleteNoteAction(id);
      if (result === true) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        toast.success("Note deleted.");
      } else {
        toast.error("Error deleting note.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (note: Note) => {
    setTitle(note.title);
    setDescription(note.description);
    setColorId(note.color || "gray");
    setEditingNoteId(note.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setColorId("gray");
    setEditingNoteId(null);
    setShowForm(false);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 p-4 bg-card rounded-md shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Notes</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refreshNotes}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Close Form" : editingNoteId ? "Edit Note" : "Add New Note"}
            </Button>
            <Toggle
              pressed={viewMode === "list"}
              onPressedChange={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              variant="outline"
            >
              {viewMode === "grid" ? <List size={18} /> : <LayoutGrid size={18} />}
            </Toggle>
          </div>
        </div>

        {showForm && (
          <div className="flex flex-col gap-3 border p-4 rounded-md bg-muted">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-sm">Select Note Color:</span>
              {Object.entries(colorMap).map(([id, color]) => (
                <button
                  key={id}
                  style={{ backgroundColor: getColorFromId(id) }}
                  onClick={() => setColorId(id)}
                  className={cn(
                    "w-6 h-6 rounded-full border",
                    colorId === id && "ring-2 ring-ring"
                  )}
                />
              ))}
            </div>
            <Button onClick={addOrUpdateNote} disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {editingNoteId ? "Update Note" : "Add Note"}
            </Button>
          </div>
        )}
      </div>

      {notes.length === 0 ? (
        <p className="text-muted-foreground text-center">No notes yet.</p>
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              : "flex flex-col gap-4"
          )}
        >
          {notes.map((note) => (
            <NoteCard
              note={note}
              startEdit={startEdit}
              deleteNote={deleteNote}
              color={getColorFromId(note.color)}
            />
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
