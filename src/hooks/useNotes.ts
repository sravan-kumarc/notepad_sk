import { useState, useEffect } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'notepad-notes';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedNotes = JSON.parse(stored);
      setNotes(parsedNotes);
      if (parsedNotes.length > 0) {
        setCurrentNoteId(parsedNotes[0].id);
      }
    } else {
      // Create a welcome note
      const welcomeNote: Note = {
        id: crypto.randomUUID(),
        title: 'Welcome to Notepad',
        content: 'Welcome to Notepad\n\nStart typing to create your first note. Your notes are saved automatically to your browser.',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes([welcomeNote]);
      setCurrentNoteId(welcomeNote.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([welcomeNote]));
    }
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setCurrentNoteId(newNote.id);
    return newNote;
  };

  const updateNote = (id: string, content: string) => {
    const updatedNotes = notes.map(note => {
      if (note.id === id) {
        const lines = content.split('\n');
        const title = lines[0]?.trim() || 'Untitled Note';
        return {
          ...note,
          title,
          content,
          updatedAt: Date.now(),
        };
      }
      return note;
    });
    saveNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
    
    if (currentNoteId === id) {
      setCurrentNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
    }
  };

  const currentNote = notes.find(note => note.id === currentNoteId) || null;

  return {
    notes,
    currentNote,
    currentNoteId,
    setCurrentNoteId,
    createNote,
    updateNote,
    deleteNote,
  };
};
