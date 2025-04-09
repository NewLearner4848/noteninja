import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
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

const NoteCard = ({ note, startEdit, deleteNote, color }: NoteCardProps) => {
  return (
    <Card
      key={note.id}
      className="relative overflow-hidden transition-shadow duration-300 hover:shadow-lg rounded-2xl"
      style={{ backgroundColor: color }}
    >
      {/* Floating buttons */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-muted"
          onClick={() => startEdit(note)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-destructive/10 text-destructive"
          onClick={() => deleteNote(note.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <CardContent className="p-4 pt-10 space-y-2">
        <h3 className="text-base font-semibold leading-tight line-clamp-1">
          {note.title}
        </h3>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-5">
          {note.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
