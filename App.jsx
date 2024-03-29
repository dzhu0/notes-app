import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore"
import { db, notesApp } from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState("")

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]

    React.useEffect(() => {
        // onSnapshot returns a clean up function
        return onSnapshot(notesApp, snapshot => {
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            notesArr.sort((a, b) => b.updatedAt - a.updatedAt)
            setNotes(notesArr)
        })
    }, [])

    React.useEffect(() => {
        if (currentNote) {
            setCurrentNoteId(currentNote.id)
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentNote && currentNote.body !== tempNoteText) {
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newDoc = await addDoc(notesApp, newNote)
        setCurrentNoteId(newDoc.id)
    }

    async function updateNote(text) {
        const docRef = doc(db, "notes-app", currentNote.id)
        await setDoc(
            docRef,
            { body: text, updatedAt: Date.now() },
            { merge: true }
        )
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
                        <Editor
                            tempNoteText={tempNoteText}
                            setTempNoteText={setTempNoteText}
                        />
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
