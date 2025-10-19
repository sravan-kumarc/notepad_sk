import { useNotes } from '@/hooks/useNotes';
import { NotesList } from '@/components/NotesList';
import { NoteEditor } from '@/components/NoteEditor';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const Index = () => {
  const {
    notes,
    currentNote,
    currentNoteId,
    setCurrentNoteId,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const isMobile = useIsMobile();
  const [showEditor, setShowEditor] = useState(false);

  const handleSelectNote = (id: string) => {
    setCurrentNoteId(id);
    if (isMobile) {
      setShowEditor(true);
    }
  };

  const handleCreateNote = () => {
    createNote();
    if (isMobile) {
      setShowEditor(true);
    }
  };

  const handleBackToList = () => {
    setShowEditor(false);
  };

  if (isMobile) {
    return (
      <div className="h-screen overflow-hidden">
        {!showEditor ? (
          <NotesList
            notes={notes}
            currentNoteId={currentNoteId}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
            onDeleteNote={deleteNote}
          />
        ) : (
          <div className="h-full flex flex-col">
            <div className="border-b border-border p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Notes
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <NoteEditor note={currentNote} onUpdateNote={updateNote} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-80 flex-shrink-0">
        <NotesList
          notes={notes}
          currentNoteId={currentNoteId}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onDeleteNote={deleteNote}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <NoteEditor note={currentNote} onUpdateNote={updateNote} />
      </div>
    </div>
  );
};

export default Index;
