"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type Note = {
  id: string;
  title: string;
  description: string;
  color?: string;
  created_at: string;
};

type NoteCardProps = {
  note: Note;
  startEdit: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  color: string;
};

const parseLinks = (text: string) => {
  return text.replace(
    /(?<!["'>])(https?:\/\/[^\s<]+)/g,
    '<a href="$1" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );
};

const NoteCard = ({ note, startEdit, deleteNote, color }: NoteCardProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const formattedDate = new Date(note.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card
      className="relative overflow-hidden transition-all duration-300 hover:shadow-md h-full"
      style={{ backgroundColor: color || "#f8fafc" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardContent className="p-4 space-y-2 pb-12">
        <h3 className="text-base font-semibold leading-tight">
          {note.title}
        </h3>
        <div
          className="text-sm prose prose-sm max-w-none text-wrap break-words [word-break:break-word] [overflow-wrap:anywhere]"
          dangerouslySetInnerHTML={{
            __html:
              /<a\s/i.test(note.description) || !/(https?:\/\/|www\.)/i.test(note.description)
                ? note.description
                : parseLinks(note.description)
          }}
        />
        <div className="text-xs text-muted-foreground mt-2">
          {formattedDate}
        </div>
      </CardContent>

      {/* Bottom action panel */}
      <div
        className={`absolute bottom-0 left-0 right-0 backdrop-blur-sm flex justify-end gap-2 p-2 transition-transform duration-300 ${isHovering ? "translate-y-0" : "translate-y-full"
          } bg-black/40`}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-2 rounded-md bg-white/10 hover:bg-white/20"
          onClick={() => startEdit(note)}
        >
          <Pencil className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-2 rounded-md bg-white/10 hover:bg-white/20 text-destructive"
          onClick={() => deleteNote(note.id)}
        >
          <Trash2 className="w-6 h-6" />
        </Button>
      </div>
    </Card>
  );
};

export default NoteCard;
