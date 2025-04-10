import React from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, Bold, Italic, LinkIcon, ListIcon, ListOrdered, Loader2, Redo, Save, Undo } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Toggle } from '../ui/toggle';
import { EditorContent } from '@tiptap/react';
import { cn } from '@/lib/utils';

type NoteEditorProps = {
    resetEditor: () => void;
    loading: boolean;
    saveNote: () => void;
    title: string;
    setTitle: (title: string) => void;
    editor: any;
    colorId: string;
    setColorId: (colorId: string) => void;
    colorMap: Record<string, { light: string; dark: string; }>;
    getColorFromId: (id: string) => string;
};

const NoteEditor = ({
    resetEditor,
    loading,
    saveNote,
    title,
    setTitle,
    editor,
    colorId,
    setColorId,
    colorMap,
    getColorFromId
}: NoteEditorProps) => {
    return (
        <div className="flex flex-col h-full gap-4 px-2 pb-4">
            <div className="flex flex-row sm:items-center sm:justify-between bg-card p-2 rounded-md shadow-md gap-2">
                <Button variant="ghost" onClick={resetEditor} className="w-full sm:w-auto">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Notes
                </Button>
                <Button
                    variant="outline"
                    disabled={loading}
                    onClick={saveNote}
                    className="w-full sm:w-auto"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Note
                </Button>
            </div>

            <Card className="flex-grow overflow-hidden">
                <CardContent className="p-4 space-y-4">
                    <Input
                        placeholder="Note Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg font-medium"
                    />

                    <div className="p-2 bg-muted rounded-md space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-1 sm:flex-wrap">
                        {/* Toolbar Icons - Always stacked on mobile, inline on desktop */}
                        <div className="flex flex-wrap justify-center gap-0 sm:gap-2 mb-2 sm:mb-0">
                            <Toggle pressed={editor?.isActive('bold')} onPressedChange={() => editor?.chain().focus().toggleBold().run()} aria-label="Bold">
                                <Bold className="h-4 w-4" />
                            </Toggle>
                            <Toggle pressed={editor?.isActive('italic')} onPressedChange={() => editor?.chain().focus().toggleItalic().run()} aria-label="Italic">
                                <Italic className="h-4 w-4" />
                            </Toggle>
                            <Toggle pressed={editor?.isActive('bulletList')} onPressedChange={() => editor?.chain().focus().toggleBulletList().run()} aria-label="Bullet List">
                                <ListIcon className="h-4 w-4" />
                            </Toggle>
                            <Toggle pressed={editor?.isActive('orderedList')} onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()} aria-label="Numbered List">
                                <ListOrdered className="h-4 w-4" />
                            </Toggle>
                            <Toggle
                                pressed={editor?.isActive('link')}
                                onPressedChange={() => {
                                    const url = window.prompt('URL');
                                    if (url) {
                                        editor?.chain().focus().setLink({ href: url }).run();
                                    }
                                }}
                                aria-label="Insert Link"
                            >
                                <LinkIcon className="h-4 w-4" />
                            </Toggle>
                            <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().undo().run()}>
                                <Undo className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().redo().run()}>
                                <Redo className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                            {Object.entries(colorMap).map(([id]) => (
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
                    </div>

                    <div
                        style={{ backgroundColor: getColorFromId(colorId) }}
                        className="rounded-md border border-input min-h-[200px] sm:min-h-[300px] overflow-auto"
                    >
                        <EditorContent editor={editor} className="p-2 sm:p-4" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default NoteEditor;
