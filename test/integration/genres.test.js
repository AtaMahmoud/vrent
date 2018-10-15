const request = require('supertest');
const {
    Genres
} = require('../../models/genre');
const {
    User
} = require('../../models/user');
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
});