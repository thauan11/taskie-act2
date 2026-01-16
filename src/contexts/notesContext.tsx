"use client";
import { createContext, type ReactNode, useCallback, useEffect, useState } from "react";



// tipagem
interface Note {
  id: string;
  user: User;
  status: Status;
  titulo: string;
  texto: string;
  createdAt: string;
}

interface User {
  id: string;
  nome: string;
  senha: string;
}

interface Status {
  id: string;
  nome: string;
}

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

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  return {
    notes,
    addNote,
  };
}

// context
interface NotesContextType {
  notes: Note[];
  addNote: (note: Note) => void;
}

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  addNote: () => {},
});

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const notes = useNotes();

  return(
  <NotesContext.Provider value={notes}>
    {children}
  </NotesContext.Provider>
  );
};