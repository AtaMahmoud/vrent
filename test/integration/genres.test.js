const request = require('supertest');
const {
    Genres
} = require('../../models/genre');
const {
    User
} = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        server.close();
        await Genres.remove({});
    });

    describe('GET', () => {
        it('should return all geners', async () => {
            await Genres.collection.insertMany([{
                    name: 'genre1'
                },
                {
                    name: 'genre2'
                }
            ]);
            const response = await request(server).get('/api/genres');

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(response.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genres({
                name: 'genre1'
            });
            await genre.save();

            const response = await request(server).get(`/api/genres/${genre._id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if passed id is invalid', async () => {
            const response = await request(server).get('/api/genres/1');

            expect(response.status).toBe(404);
        });

        it('should return 404 if genre with passed id not exist', async () => {
            const id = mongoose.Types.ObjectId();
            const response = await request(server).get(`/api/genres/${id}`);

            expect(response.status).toBe(404);
        });
    });

    describe('POST', () => {
        let token;
        let name;
        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({
                    name
                });

        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });
        it('should return 401 error if the clinet not logged in', async () => {
            token = '';
            const response = await exec();
            expect(response.status).toBe(401);
        });

        it('should return 400 if the genre less than 5 characters', async () => {
            name = '1234';
            const response = await exec();
            expect(response.status).toBe(400);
        });

        it('should return 400 if the genre more than 50 characters', async () => {
            name = new Array(52).join('a');
            const response = await exec();
            expect(response.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await exec();
            const genre = await Genres.find({
                name: 'genre1'
            });

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is vaild', async () => {
            const response = await exec();
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('DELETE', () => {
        let token;
        let gnre;
        let id;

        const exec = async () => {
            return await request(server)
                .delete(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send();
        }
        beforeEach(async () => {
            genre = new Genres({
                name: 'genre5'
            });
            await genre.save();

            id = genre._id;
            token = new User({
                isAdmin: true
            }).generateAuthToken();
        });
        it('should return 401 if the client not logged in', async () => {
            token = '';
            const response = await exec();

            expect(response.status).toBe(401);
        });

        it('should return 403 if the user is not admin', async () => {
            token = new User({
                isAdmin: false
            }).generateAuthToken();

            const response = await exec();
            expect(response.status).toBe(403);
        });

        it('should return 404 if id is invalid', async () => {
            id = 1;
            const response = await exec();

            expect(response.status).toBe(404);
        });

        it('should return 404 if no genre with the given id was found', async () => {
            id = mongoose.Types.ObjectId();
            const response = await exec();

            expect(response.status).toBe(404);
        });

        it('should return 200 if the genre id is valid', async () => {
            await exec();

            const genreDb = await Genres.findById(id);

            expect(genreDb).toBeNull();
        });

        it('should return remove genre', async () => {
            const response = await exec();
            expect(response.body).toHaveProperty('_id', genre._id.toHexString());
            expect(response.body).toHaveProperty('name', genre.name);
        });
    });

    describe('PUT', () => {
        let id;
        let token;
        let genre;
        let updatedName;

        const exec = async () => {
            return await request(server)
                .put(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send({
                    name: updatedName
                });
        }

        beforeEach(async () => {
            genre = new Genres({
                name: 'genre6'
            });
            await genre.save();

            token = new User().generateAuthToken();
            id = genre._id;
            updatedName = 'updatedName';
        });

        it('should return 401 if the client not logged in', async () => {
            token = '';
            const response = await exec();

            expect(response.status).toBe(401);
        });

        it('should return 400 if the updated name less than 5 characters', async () => {
            updatedName = '1234';
            const response = await exec();

            expect(response.status).toBe(400);
        });
        it('should return 400 if genre is more than 50 characters', async () => {
            updatedName = new Array(52).join('a');
            const response = await exec();

            expect(response.status).toBe(400);
        });

        it('should return 404 if id is invalid', async () => {
            id = 1;
            const response = await exec();

            expect(response.status).toBe(404);
        });

        it('should return 404 if genre with the given id was not found', async () => {
            id = mongoose.Types.ObjectId();
            const response = await exec();

            expect(response.status).toBe(404);
        });

        it('should update the genre if input is valid', async () => {
            await exec();
            const updatedGenre = await Genres.findById(genre._id);

            expect(updatedGenre.name).toBe(updatedName);
        });

        it('should return the updated genre if it is valid', async () => {
            const response = await exec();
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('name', updatedName);
        });

    });
});