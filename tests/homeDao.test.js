const db = require('../app/backend/db/db');
const { getGroups,countPeople } = require('../app/backend/dao/homeDao');

jest.mock('../app/backend/db/db');

describe('getGroups', () => {
    test('should return groups for a given user', (done) => {
        const userId = 1;
        const mockResults = [
            { groupid: 1, groupname: 'Group 1', group_creation_time: '2024-01-27' },
            { groupid: 2, groupname: 'Group 2', group_creation_time: '2024-01-28' },
        ];

        db.query.mockImplementation((query, values, callback) => {
            expect(query).toContain('SELECT g.groupid, g.groupname, g.group_creation_time');
            expect(values).toEqual([userId]);
            callback(null, mockResults);
        });

        getGroups(userId, (err, results) => {
            expect(err).toBeNull();
            expect(results).toEqual(mockResults);
            done();
        });
    });

    test('should handle database query error', (done) => {
        const userId = 1;
        const mockError = new Error('Database error');

        db.query.mockImplementation((query, values, callback) => {
            callback(mockError, null);
        });

        getGroups(userId, (err, results) => {
            expect(err).toEqual(mockError);
            expect(results).toBeNull();
            done();
        });
    });
});

describe('countPeople', () => {
    test('should return the count of members for a given user', (done) => {
        const userId = 1;
        const mockResults = [{ member_count: 5 }];

        db.query.mockImplementation((query, values, callback) => {
            expect(query).toContain('SELECT COUNT(DISTINCT ug.userid) as member_count');
            expect(values).toEqual([userId]);
            callback(null, mockResults);
        });

        countPeople(userId, (err, result) => {
            expect(err).toBeNull();
            expect(result).toEqual(5);
            done();
        });
    });

    test('should handle database query error', (done) => {
        const userId = 1;
        const mockError = new Error('Database error');

        db.query.mockImplementation((query, values, callback) => {
            callback(mockError, null);
        });

        countPeople(userId, (err, result) => {
            expect(err).toEqual(mockError);
            expect(result).toBeNull();
            done();
        });
    });
});
