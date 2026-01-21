"use client";
import { createContext, type ReactNode, useCallback, useEffect, useState } from "react";
import type { Note } from "@/types";



// hooks
const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const getNotes = useCallback(() => {
    localStorage.getItem("notes");
    setNotes(JSON.parse(localStorage.getItem("notes") || "[]"));
  }, []);

  const addNote = (note: Note) => {
    const updatedNotes = [...notes, note];
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const updateNote = (note: Note) => {
    const updatedNotes = notes.map((n) => (n.id === note.id ? note : n));
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  return {
    notes,
    addNote,
    updateNote,
  };
}

// context
interface NotesContextType {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
}

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  addNote: () => {},
  updateNote: () => {},
});

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const notes = useNotes();

  return(
  <NotesContext.Provider value={notes}>
    {children}
  </NotesContext.Provider>
  );
};