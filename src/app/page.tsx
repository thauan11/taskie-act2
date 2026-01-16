"use client";
import { useContext, useState } from "react";
import { NotesContext } from "@/contexts/notesContext";
import { Box, Button, Container, Grid, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/AddRounded';

export default function Home() {
  const { notes, addNote } = useContext(NotesContext);
  const [newNote, setNewNote] = useState("");

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Grid container spacing={4}>
          {notes.map((note) => (
            <Grid size={2} key={note.id}>
              <Box border={1} borderRadius={2} padding={2}>
                <h2>{note.titulo}</h2>
                <p>{note.texto}</p>
                <small>Criado em: {new Date(note.createdAt).toLocaleDateString()}</small>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box mt={4}>
          <Grid container spacing={4}>
            <Grid size={10}>
              <TextField
                fullWidth
                label="Insira aqui uma nova nota"
                variant="outlined"
                sx={{
                  border: '1px solid var(--foreground) !important',
                  borderRadius: '4px',
                  'fieldset': { border: 'none !important' },
                  'label[data-shrink="true"]': {
                    background: 'var(--background)',
                    px: 1,
                    color: 'var(--foreground) !important',
                  },
                  input: { color: 'var(--foreground) !important' },
                }}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </Grid>

            <Grid size={2}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Button
                  variant="contained"
                  sx={{ width: '100%', height: '100%' }}
                  onClick={() => addNote(newNote)}
                >
                  <AddIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
