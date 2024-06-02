const util = require('util');
const fs = require('fs');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
    read() {
        return readFileAsync('db/db.json', 'utf8');
    }

    write(note) {
        return writeFileAsync('db/db.json', JSON.stringify(note));
    }

    getNotes() {
        return this.read().then((notes) => {
            let parsedNotes;
            try {
                parsedNotes = [].concat(JSON.parse(notes));
            } catch (err) {
                console.log(err);
                parseNotes = []
            }

            return parsedNotes;
        })
    }

    addNote(note) {
        const { title, text } = note

        if (!title || !text) {
            throw new Error("title and text cannot be blank")
        }

        const newNote = { title, text, id: uuid() }

        return this.getNotes()
            .then(notes => [...notes, newNote])
            .then(updatedNotes => this.write(updatedNotes))
            .then(() => this.newNote)
    }

    removeNote(id) {
        return this.getNotes()
        .then(notes => notes.filter(note => note.id !== id))
        .then(keptNotes => this.write(keptNotes))
    }
}

module.exports = new Store();