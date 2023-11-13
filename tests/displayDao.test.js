const PostDao = require('../app/backend/dao/displayDAO');

describe('PostDao with Jest', () => {
    let dao;
    let dbMock;

    beforeEach(() => {
        dbMock = {
            query: jest.fn()
        };
        dao = new PostDao(dbMock);
    });

    it('should fetch username and post date', async () => {
        const expectedData = [{ username: 'JohnDoe', post_date: new Date() }];
        dbMock.query.mockImplementation((sql, callback) => callback(null, expectedData));

        const result = await new Promise((resolve, reject) => {
            dao.getUsernameAndPostDate((err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });

        expect(result).toEqual(expectedData);
    });

    it('should handle errors', async () => {
        const expectedError = new Error('Database error');
        dbMock.query.mockImplementation((sql, callback) => callback(expectedError, null));

        await expect(new Promise((resolve, reject) => {
            dao.getUsernameAndPostDate((err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        })).rejects.toThrow('Database error');
    });
});
