import { Note } from '@/hooks/useNotes';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (id: string, content: string) => void;
}

export const NoteEditor = ({ note, onUpdateNote }: NoteEditorProps) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (note) {
      setContent(note.content);
      // Focus the textarea when a note is selected
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [note?.id]);

  const handleChange = (value: string) => {
    setContent(value);
    
    // Debounce the save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (note) {
      timeoutRef.current = setTimeout(() => {
        onUpdateNote(note.id, value);
      }, 500);
    }
  };

  if (!note) {
    return (
      <div className="flex h-full items-center justify-center bg-[hsl(var(--editor-bg))]">
        <div className="text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Note Selected</h2>
          <p className="text-muted-foreground">
            Select a note from the list or create a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[hsl(var(--editor-bg))]">
      <div className="border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">
          {note.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Last edited {new Date(note.updatedAt).toLocaleString()}
        </p>
      </div>

      <div className="flex-1 p-6">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Start typing..."
          className="h-full min-h-full resize-none border-0 bg-transparent p-0 text-base leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
};
