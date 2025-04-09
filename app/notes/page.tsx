import NoteTaker from "@/components/note/NoteTaker";
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
        <div className="w-full min-h-screen bg-background text-foreground p-4 md:p-6">
            <div className="w-full max-w-6xl mx-auto">
                <NoteTaker initialNotes={data || []} userId={user.id} />
            </div>
        </div>
    );
}
