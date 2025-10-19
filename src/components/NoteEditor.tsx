import { Note } from '@/hooks/useNotes';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Save, Trash2, Edit2, Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export const NoteEditor = ({ note, onUpdateNote, onDeleteNote }: NoteEditorProps) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    if (note) {
      setContent(note.content);
      setTitle(note.title);
      setHasUnsavedChanges(false);
      setIsEditingTitle(false);
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [note?.id]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleContentChange = (value: string) => {
    setContent(value);
    setHasUnsavedChanges(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (note) {
      timeoutRef.current = setTimeout(() => {
        saveNote(value, title);
      }, 1000);
    }
  };

  const saveNote = (noteContent: string, noteTitle: string) => {
    if (note) {
      const updatedContent = noteTitle + '\n' + noteContent.split('\n').slice(1).join('\n');
      onUpdateNote(note.id, updatedContent);
      setHasUnsavedChanges(false);
      toast({
        title: "Note saved",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  const handleManualSave = () => {
    if (note) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      saveNote(content, title);
    }
  };

  const handleTitleSave = () => {
    if (note && title.trim()) {
      const lines = content.split('\n');
      lines[0] = title;
      const updatedContent = lines.join('\n');
      setContent(updatedContent);
      onUpdateNote(note.id, updatedContent);
      setIsEditingTitle(false);
      setHasUnsavedChanges(false);
      toast({
        title: "Title updated",
        description: "Note title has been updated.",
      });
    }
  };

  const handleTitleCancel = () => {
    if (note) {
      setTitle(note.title);
      setIsEditingTitle(false);
    }
  };

  const handleDelete = () => {
    if (note) {
      onDeleteNote(note.id);
      setShowDeleteDialog(false);
      toast({
        title: "Note deleted",
        description: "The note has been permanently deleted.",
        variant: "destructive",
      });
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
    <>
      <div className="flex h-full flex-col bg-[hsl(var(--editor-bg))]">
        <div className="border-b border-border p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            {isEditingTitle ? (
              <div className="flex-1 flex items-center gap-2">
                <Input
                  ref={titleInputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSave();
                    if (e.key === 'Escape') handleTitleCancel();
                  }}
                  className="text-2xl font-bold h-auto border-border"
                />
                <Button
                  size="sm"
                  onClick={handleTitleSave}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleTitleCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {title}
                </h1>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingTitle(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleManualSave}
                disabled={!hasUnsavedChanges}
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Last edited {new Date(note.updatedAt).toLocaleString()}</p>
            {hasUnsavedChanges && (
              <p className="text-accent">Unsaved changes</p>
            )}
          </div>
        </div>

        <div className="flex-1 p-6 overflow-hidden">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start typing..."
            className="h-full min-h-full resize-none border-0 bg-transparent p-0 text-base leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
