"use client";
import { useState, useContext, useRef } from "react";
import { Alert, Box, Button, Checkbox, Collapse, Container, FormControl, FormLabel, Grid, TextField } from "@mui/material";
import type { Note, Status } from "@/types";
import { NotesContext } from "@/contexts/notesContext";
import BasicDatePicker from "@/components/DatePicker";
import type { Dayjs } from 'dayjs';
import { CheckCircleOutline, CheckOutlined, CloseOutlined } from "@mui/icons-material";



export default function Home() {
  const { notes, addNote, updateNote } = useContext(NotesContext);
  const [newNote, setNewNote] = useState("");
  const [finishAt, setFinishAt] = useState<Dayjs | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");
  const noteInputRef = useRef<HTMLInputElement>(null);

  const status = useState<Status[]>([
    { id: '1', nome: 'Ativo' },
    { id: '2', nome: 'Completado' },
  ]);

  // handlers
  const handleAlert = (severity: 'success' | 'error', message: string) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 3000);
  }

  const handleAdd = (noteText: string) => {
    if (!noteText) return handleAlert('error', 'Digite uma nota');
    if (!finishAt) return handleAlert('error', 'Defina uma data de conclusão');
    if (noteText.trim() === "") return;

    const newNoteObj = {
      id: Date.now().toString(),
      status: status[0][0],
      texto: noteText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      finishAt: finishAt.toISOString(),
    };

    addNote(newNoteObj);
    setNewNote("");
    setFinishAt(null);
    handleAlert('success', 'Nota adicionada com sucesso!');
    noteInputRef.current?.focus();
  }

  const handleToggleStatus = (noteId: string) => {
    const foundNote = notes.find((note) => note.id === noteId);
    if (!foundNote) return console.log("Nota não encontrada");
    const updatedNoteObj = {
      ...foundNote,
      status: foundNote.status.id === '1' ? status[0][1] : status[0][0],
      updatedAt: new Date().toISOString(),
    };
    updateNote(updatedNoteObj);
  }

  // helpers
  const getSplitDate = (dateString: string) => {
    const date = new Date(dateString);
    const formatedMonth = date.toLocaleString('pt-BR', { month: 'long' }).slice(0, 3);
    const formatedDay = date.getDate();
    const formatedYear = date.getFullYear().toString().slice(-2);
    const currentYear = new Date().getFullYear();
    if (date.getFullYear() === currentYear) return `${formatedDay}/${formatedMonth}`;
    return `${formatedDay}/${formatedMonth}/${formatedYear}`;
  }

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()) {
      return true;
    }
    return false;
  }

  const isTomorrow = (dateString: string) => {
    const date = new Date(dateString);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.getDate() === tomorrow.getDate() &&
        date.getMonth() === tomorrow.getMonth() &&
        date.getFullYear() === tomorrow.getFullYear()) {
      return true;
    }
    return false;
  }

  const isNextWeek = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setDate(today.getDate() + 7);
    today.setHours(0, 0, 0, 0);

    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());

    const lastDayOfWeek = new Date(today);
    lastDayOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    lastDayOfWeek.setHours(23, 59, 59, 999);

    date.setHours(0, 0, 0, 0);

    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  }

  const isThisWeek = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());

    const lastDayOfWeek = new Date(today);
    lastDayOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    lastDayOfWeek.setHours(23, 59, 59, 999);

    date.setHours(0, 0, 0, 0);

    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  };

  const isOverdue = (dateString: string) => {
    const date = new Date(dateString);
    const onlyDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = new Date();
    const onlyToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (onlyDate < onlyToday) return true;
    return false;
  }

  // renders
  const renderActiveNotes = () => {
    const overdueNotes = notes.filter((note) => isOverdue(note.finishAt));
    const todayNotes = notes.filter((note) => isToday(note.finishAt));
    const tomorrowNotes = notes.filter((note) => isTomorrow(note.finishAt));
    const thisWeekNotes = notes.filter((note) => {
      return !isOverdue(note.finishAt) && !isToday(note.finishAt) && !isTomorrow(note.finishAt) && isThisWeek(note.finishAt);
    });
    const nextWeekNotes = notes.filter((note) => isNextWeek(note.finishAt));
    const otherNotes = notes.filter((note) => {
      return !isOverdue(note.finishAt) && !isToday(note.finishAt) && !isTomorrow(note.finishAt) && !isNextWeek(note.finishAt) && !isThisWeek(note.finishAt);
    });

    overdueNotes.sort((a, b) => new Date(a.finishAt).getTime() - new Date(b.finishAt).getTime());
    todayNotes.sort((a, b) => new Date(a.finishAt).getTime() - new Date(b.finishAt).getTime());
    tomorrowNotes.sort((a, b) => new Date(a.finishAt).getTime() - new Date(b.finishAt).getTime());
    thisWeekNotes.sort((a, b) => new Date(a.finishAt).getTime() - new Date(b.finishAt).getTime());
    nextWeekNotes.sort((a, b) => new Date(a.finishAt).getTime() - new Date(b.finishAt).getTime());
    otherNotes.sort((a, b) => new Date(a.finishAt).getTime() - new Date(b.finishAt).getTime());

    const renderNote = (note: Note, color?: string) => (
      note.status.id === '1' && (
        <Grid
          key={note.id}
          container
          alignItems="center"
          display="grid"
          gridTemplateColumns="10% 85%"
          sx={{ mt: 1 }}
        >
          <Grid>
            <Checkbox
              color="success"
              onChange={() => handleToggleStatus(note.id)}
            />
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Box>
              <p>{note.texto}</p>
            </Box>

            <Box
              sx={{
                fontSize: '0.7rem', 
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
              }}
            >
              {/* <Box sx={{ display: 'grid', placeItems: 'center' }}>
                <p>Created</p>
                <p style={{ fontSize: '0.65rem' }}>{getSplitDate(note.createdAt)}</p>
              </Box> */}

              <Box sx={{ display: 'grid', placeItems: 'center' }}>
                {/* <p>End</p> */}
                <p style={{ fontSize: '0.65rem', color: color }}>{getSplitDate(note.finishAt)}</p>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )
    );

    if (notes.filter(note => note.status.id === '1').length === 0) return null;
    
    return (
      <>
        {overdueNotes.length >= 1 && (
          <Box mb={2}>
            <strong>Expired</strong>
            {overdueNotes.map(note => renderNote(note, 'red'))}
          </Box>
        )}
        {todayNotes.length >= 1 && (
          <Box mb={2}>
            <strong>Today</strong>
            {todayNotes.map(note => renderNote(note, 'orange'))}
          </Box>
        )}
        {tomorrowNotes.length >= 1 && (
          <Box mb={2}>
            <strong>Tomorrow</strong>
            {tomorrowNotes.map(note => renderNote(note, 'orange'))}
          </Box>
        )}
        {thisWeekNotes.length >= 1 && (
          <Box mb={2}>
            <strong>This Week</strong>
            {thisWeekNotes.map(note => renderNote(note, 'green'))}
          </Box>
        )}
        {nextWeekNotes.length >= 1 && (
          <Box mb={2}>
            <strong>Next Week</strong>
            {nextWeekNotes.map(note => renderNote(note, 'green'))}
          </Box>
        )}
        {otherNotes.length >= 1 && (
          <Box mb={2}>
            <strong>Other</strong>
            {otherNotes.map(note => renderNote(note, 'gray'))}
          </Box>
        )}
      </>
    );
  }

  const renderCompletedNotes = () => {
    const renderNote = (note: Note) => (
      note.status.id === '2' && (
        <Grid
          key={note.id}
          container
          alignItems="center"
          display="grid"
          gridTemplateColumns="10% 85%"
          sx={{ mt: 1 }}
        >
          <Grid>
            <Checkbox
              color="success"
              checked
              onChange={() => handleToggleStatus(note.id)}
            />
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid size={10}>
              <FormLabel
                sx={{ 
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: '-0.5rem',
                    top: '50%',
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'gray',
                    transform: 'translateY(-50%)',
                    padding: '0 0.5rem',
                    animation: 'line-through .5s forwards',
                  },
                }}
              >
                {note.texto}
              </FormLabel>
            </Grid>
            
            <Grid>
              <p style={{ fontSize: '0.8rem', color: 'gray' }}>{getSplitDate(note.updatedAt)}</p>
            </Grid>
          </Grid>
        </Grid>
      )
    );

    if (notes.filter(note => note.status.id === '2').length === 0) return null;

    return (
      <Box>
        <strong>Completed</strong>
        {notes.filter(note => note.status.id === '2').map(note => renderNote(note))}
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ maxHeight: "100dvh", overflowY: "hidden" }}>
      <Box my={4} sx={{ height: "100%", width: "100%", display: 'grid', placeItems: 'center' }}>
        <Collapse
          in={alertOpen}
          sx={{
            width: '100%',
            position: 'absolute',
            left: 0,
            top: -50,
            zIndex: 1,
            borderRadius: '4px',
          }}
        >
          <Alert
            icon={
              alertSeverity === "success" ? (
                <CheckCircleOutline fontSize="inherit" />
              ) : (
                <CloseOutlined fontSize="inherit" />
              )
            }
            severity={alertSeverity}
          >
            {alertMessage}
          </Alert>
        </Collapse>

        <Grid
          container
          sx={{ 
            height: "100dvh",
            width: "100%",
            display: 'grid',
            gridTemplateRows: 'calc(80% - 16px) 20%',
            gap: "16px",
          }}
        >
          <Grid size={12} sx={{ overflowY: "auto"}}>
            {renderActiveNotes()}
          </Grid>

          <Grid size={12} sx={{ position: "relative" }}>
            <Grid container>
              <Grid size={12}>
                <FormControl
                  required
                  fullWidth
                  onSubmit={() => handleAdd(newNote)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd(newNote)}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "calc(100% - 200px) 200px",
                    // gap: "1rem",
                    justifyContent: "space-between",
                    alignItems: "center",
                    
                  }}
                >
                  <TextField
                    fullWidth
                    label="Nova nota"
                    variant="outlined"
                    color="success"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    sx={{
                      paddingTop: '8px',
                      'label': {
                        color: 'var(--foreground)',
                      },
                      'fieldset': {
                        borderColor: 'var(--foreground)',
                      },
                      '.MuiInputBase-formControl:hover .MuiOutlinedInput-notchedOutline:hover': {
                        borderColor: 'var(--foreground-transparent)',
                      },
                      'label[data-shrink="false"]': {
                        transform: 'translate(14px, 24px) scale(1)',
                      },
                      'label[data-shrink="true"]': {
                        transform: 'translate(14px, -1px) scale(0.75)',
                      },
                      paddingRight: '16px',
                      minWidth: '350px',
                    }}
                    inputRef={noteInputRef}
                  />

                  <BasicDatePicker
                    label="Data de finalização"
                    color="success"
                    value={finishAt}
                    onChange={setFinishAt}
                  />
                </FormControl>

                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleAdd(newNote)}
                  sx={{ mt: 1, width: '100%' }}
                >
                  <CheckOutlined />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
