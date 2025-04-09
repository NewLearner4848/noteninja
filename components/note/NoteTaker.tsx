"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Loader2,
  LayoutGrid,
  List,
  RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import your action functions
import {
  deleteNoteAction,
  getAllNotesAction,
  noteAddingAction,
  noteUpdatingAction,
} from "@/app/actions";
import NoteCard from "./NoteCard";
import NoteEditor from "./NoteEditor";

type Note = {
  id: string;
  title: string;
  description: string;
  color?: string;
  created_at: string;
};

export default function NoteTakerWithTipTap({
  initialNotes,
  userId,
}: {
  initialNotes: Note[];
  userId: string;
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [title, setTitle] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [colorId, setColorId] = useState<string>("gray");
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: 'Write your note here...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[300px] p-4 prose prose-sm max-w-none focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      // You can handle content changes here if needed
    },
  });

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

  useEffect(() => {
    // Update editor content when editing a note
    if (editor && editingNoteId) {
      editor.commands.setContent(notes.find(note => note.id === editingNoteId)?.description || '');
    }
  }, [editingNoteId, editor]);

  const getColorFromId = (id: string | undefined) => {
    if (!mounted || !id) return "#fff";
    return colorMap[id]?.[resolvedTheme === "dark" ? "dark" : "light"] || colorMap.gray[resolvedTheme === "dark" ? "dark" : "light"];
  };

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

  const colorMap: Record<string, { light: string; dark: string }> = {
    blue: { light: "#BBE0F4", dark: "#05101E" },
    teal: { light: "#B2F2E6", dark: "#040F0F" },
    green: { light: "#D9FBE1", dark: "#040F0B" },
    purple: { light: "#E0BBFF", dark: "#0D031A" },
    pink: { light: "#F8D0E1", dark: "#150811" },
    yellow: { light: "#FFF8B0", dark: "#0D0A00" },
    orange: { light: "#FFD6A5", dark: "#180D00" },
    red: { light: "#FFBABA", dark: "#130505" },
    gray: { light: "#E1E1E1", dark: "#0A0A0A" },
    indigo: { light: "#C5CAE9", dark: "#060A1E" }
  };

  const saveNote = async () => {
    if (!title.trim()) return toast.warning("Title is required.");
    if (!editor) return toast.warning("Editor not available.");

    setLoading(true);
    try {
      const contentToSave = editor.getHTML();

      if (editingNoteId) {
        const response = await noteUpdatingAction(editingNoteId, title, contentToSave, colorId);
        if (response?.id) {
          setNotes((prev) => prev.map((n) => (n.id === editingNoteId ? response : n)));
          toast.success("Note updated.");
        } else {
          toast.error("Failed to update note.");
        }
      } else {
        const response = await noteAddingAction(title, contentToSave, colorId, userId);
        if (response?.id) {
          setNotes((prev) => [response, ...prev]);
          toast.success("Note added.");
        } else {
          toast.error("Failed to add note.");
        }
      }
      resetEditor();
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
    setColorId(note.color || "gray");
    setEditingNoteId(note.id);
    setEditorOpen(true);
  };

  const resetEditor = () => {
    setTitle("");
    setColorId("gray");
    setEditingNoteId(null);
    setEditorOpen(false);
    if (editor) {
      editor.commands.clearContent();
    }
  };

  const filteredNotes = notes.filter(note => {
    const searchLower = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.description.toLowerCase().includes(searchLower)
    );
  });

  if (!mounted) return null;

  if (editorOpen) {
    return (
      <NoteEditor resetEditor={resetEditor} loading={loading} saveNote={saveNote} title={title} setTitle={setTitle} editor={editor} colorId={colorId} setColorId={setColorId} colorMap={colorMap} getColorFromId={getColorFromId} />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 p-4 bg-card rounded-md shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Notes</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refreshNotes} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            </Button>
            <Button onClick={() => setEditorOpen(true)}>
              Create Note
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

        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {notes.length === 0 ? "No notes yet. Create your first note!" : "No notes match your search."}
          </p>
        </div>
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-auto"
              : "flex flex-col gap-4"
          )}
        >
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              startEdit={startEdit}
              deleteNote={deleteNote}
              color={getColorFromId(note.color)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
