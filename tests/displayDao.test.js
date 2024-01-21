// const PostDao = require('../app/backend/dao/displayDAO');

const dbFunctions = require('../app/backend/dao/displayDAO');
const db = require('../app/backend/db/db');

jest.mock('../app/backend/db/db', () => ({
  query: jest.fn()
}));

describe('getUsernameAndPostDate', () => {
  it('should retrieve post titles and dates for a given user ID', async () => {
    const userId = 123;
    const expectedResult = [{ post_title: 'Test Post', post_date: '2024-01-20' }];
    db.query.mockImplementation((query, params, callback) => {
      callback(null, expectedResult);
    });
    const callback = jest.fn();
    await dbFunctions.getUsernameAndPostDate(userId, callback);
    expect(callback).toHaveBeenCalledWith(null, expectedResult);
  });

  it('should handle errors during query execution', async () => {
    const userId = 123;
    const expectedError = new Error('Test Error');

    db.query.mockImplementation((query, params, callback) => {
      callback(expectedError, null);
    });

    const callback = jest.fn();
    await dbFunctions.getUsernameAndPostDate(userId, callback);

    expect(callback).toHaveBeenCalledWith(expectedError, null);
  });
});

describe('addPost', () => {
  it('should add a new post to the database', async () => {
    const postData = {
      user_group_id: 1,
      s3_content_key: 'test-key',
      post_text: 'Test post text',
      userid: 123,
      post_title: 'Test Post'
    };

    db.query.mockImplementation((query, params, callback) => {
      callback(null, { insertId: 1 }); // Simulating a successful insertion with an insertId
    });

    const callback = jest.fn();
    await dbFunctions.addPost(postData, callback);

    expect(callback).toHaveBeenCalledWith(null, { insertId: 1 });
  });

  it('should handle errors during insertion', async () => {
    const postData = {
      user_group_id: 1,
      s3_content_key: 'test-key',
      post_text: 'Test post text',
      userid: 123,
      post_title: 'Test Post'
    };

    const expectedError = new Error('Test Error');

    db.query.mockImplementation((query, params, callback) => {
      callback(expectedError, null);
    });

    const callback = jest.fn();
    await dbFunctions.addPost(postData, callback);

    expect(callback).toHaveBeenCalledWith(expectedError, null);
  });
});
