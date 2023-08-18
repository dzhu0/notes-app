import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore"
import { db, notesApp } from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState(notes[0]?.id || "")

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]

    React.useEffect(() => {
        // onSnapshot returns a clean up function
        return onSnapshot(notesApp, snapshot => {
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
        })
    }, [])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here"
        }
        const newDoc = await addDoc(notesApp, newNote)
        setCurrentNoteId(newDoc.id)
    }

    function updateNote(text) {
        setNotes(oldNotes => {
            const newArray = []
            for (let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i]
                if (oldNote.id === currentNoteId) {
                    newArray.unshift({ ...oldNote, body: text })
                } else {
                    newArray.push(oldNote)
                }
            }
            return newArray
        })
    }

    async function deleteNote(noteId) {
        const docRef = doc(db, "notes-app", noteId)
        await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            currentNoteId &&
                            notes.length > 0 &&
                            <Editor
                                currentNote={currentNote}
                                updateNote={updateNote}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>

            }
        </main>
    )
}
