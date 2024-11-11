import request from 'supertest';
import app from '../src/index'; // Import your express app
import chai from 'chai';
const { expect } = chai;

let token: string;

describe('Notes API', () => {
  // Use Mocha's before hook to log in and get the token before tests run
  before((done) => {
    const userLogin = {
      email: 'shaitan@email.com',
      password: 'newpassword123',
    };

    request(app)
      .post('/api/v1/users/login')
      .send(userLogin)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.token;
        done();
      });
  });

  // Test Create Note
  it('should create a new note', (done) => {
    const noteData = {
      title: 'Test Note',
      content: 'This is a test note.',
      isArchived:false,
      isTrashed:false
    };

    request(app)
      .post('/api/v1/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(noteData)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Note created successfully');
        done();
      });
  });

  // Test Get All Notes
  it('should fetch all notes', (done) => {
    request(app)
      .get('/api/v1/notes')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // Test Get Note by ID
  it('should fetch a single note by ID', (done) => {
    const noteData = {
      title: 'Note to Fetch',
      content: 'This note will be fetched by its ID.',
    };

    // First, create a note to fetch
    request(app)
      .post('/api/v1/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(noteData)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        const noteId = res.body.data._id; // Get the created note's ID

        // Now fetch the note by ID
        request(app)
          .get(`/api/v1/notes/${noteId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('title');
            expect(res.body._id).to.equal(noteId);
            done();
          });
      });
  });

  // Test Update Note
  it('should update a note', (done) => {
    const noteData = {
      title: 'Note to Update',
      content: 'This note will be updated.',
    };

    // Create a note to update
    request(app)
      .post('/api/v1/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(noteData)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        const noteId = res.body.data._id;

        // Now update the note
        const updatedNote = {
          title: 'Updated Note Title',
          content: 'This content is updated.',
        };

        request(app)
          .put(`/api/v1/notes/${noteId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updatedNote)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.message).to.equal('Note updated successfully');
            done();
          });
      });
  });

  // Test Delete Note
  it('should delete a note', (done) => {
    const noteData = {
      title: 'Note to Delete',
      content: 'This note will be deleted.',
    };

    // Create a note to delete
    request(app)
      .post('/api/v1/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(noteData)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        const noteId = res.body.data._id;

        // Now delete the note
        request(app)
          .delete(`/api/v1/notes/${noteId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.message).to.equal('Note deleted successfully');
            done();
          });
      });
  });
});
