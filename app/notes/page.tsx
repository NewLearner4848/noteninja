import NoteTaker from "@/components/note/note-take";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getAllNotesAction } from "../actions";

export default async function NotesPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const data = await getAllNotesAction(user.id);

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <div className="w-full max-w-5xl">
                <NoteTaker initialNotes={data || []} userId={user.id} />
            </div>
        </div>
    );
}
