const {
    Rental
} = require('../../models/rental');
const mongoose = require('mongoose');
const request = require('supertest');
const monment = require('moment');
const {
    User
} = require('../../models/user');
const {
    Movie
} = require('../../models/movie');
describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    beforeEach(async () => {

        server = require('../../index');

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailytRentalRate: 2,
            genre: {
                name: '12345'
            },
            numberInStocke: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phoneNumber: '01092101362'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailytRentalRate: 2
            }
        });
        await rental.save();
    });

    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({
                customerId,
                movieId
            });
    };

    it('shoud return 401 if the client not logged in', async () => {
        token = '';
        const response = await exec();
        expect(response.status).toBe(401);
    });

    it('shoud return 400 if customerId is not provide', async () => {
        customerId = '';
        const response = await exec();
        expect(response.status).toBe(400);
    });
    it('shoud return 400 if movieId is not provide', async () => {
        movieId = '';
        const response = await exec();
        expect(response.status).toBe(400);
    });
    it('shoud return 404 if no retnal found for this csutomer/movie', async () => {
        await Rental.remove({});
        const response = await exec();
        expect(response.status).toBe(404);
    });

    it('shoud return 400 if rental alredy processd', async () => {
        rental.dateReturn = new Date();
        await rental.save();
        const response = await exec();

        expect(response.status).toBe(400);
    });

    it('shoud return 200 if it valid request', async () => {
        const response = await exec();
        expect(response.status).toBe(200);
    });

    it('shoud set the return date', async () => {
        await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturn;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('shoud calculate rental fee', async () => {
        rental.dateOut = monment().add(-7, 'days').toDate();
        await rental.save();

        await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.retunFee).toBe(14);
    });

    it('shoud increment number in the stock', async () => {
        await exec();
        const movieInDb = await Movie.findById(movie._id);
        expect(movieInDb.numberInStocke).toBe(movie.numberInStocke + 1);
    });
    it('shoud rentrun the rental if input is valid', async () => {
        const response=await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(Object.keys(response.body)).toEqual(
            expect.arrayContaining(["dateReturn", "retunFee", "customer", "movie", "dateOut"])
        );
    });
});