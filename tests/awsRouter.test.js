jest.mock('fs', () => ({
    createReadStream: jest.fn(),
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    unlinkSync: jest.fn()
}));

jest.mock('@aws-sdk/client-s3', () => {
    const originalModule = jest.requireActual('@aws-sdk/client-s3');
    return {
        ...originalModule,
        S3Client: jest.fn(() => ({
            send: jest.fn()
        })),
        getSignedUrl: jest.fn()
    };
});

jest.mock('@aws-sdk/client-kinesis-video', () => ({
    KinesisVideo: jest.fn()
}));

jest.mock('fluent-ffmpeg', () => {
    return jest.fn(() => ({
        output: jest.fn().mockReturnThis(),
        on: jest.fn((event, callback) => {
            if (event === 'end') {
                callback();
            }
            return this;
        }),
        toFormat: jest.fn().mockReturnThis(),
        run: jest.fn()
    }));
});

jest.mock('../app/backend/dao/PostDao', () => {
    return jest.fn().mockImplementation(() => ({
        getVideoByKey: jest.fn(),
    }));
});

jest.mock('multer', () => {
    return {
        single: () => (req, res, next) => {
            req.file = {
                path: 'path/to/temp/file',
            };
            next();
        }
    };
});
const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const { S3Client, getSignedUrl } = require('@aws-sdk/client-s3');
const createUserRouter = require('../app/backend/router/awsRouter');
const PostDao = require('../app/backend/dao/PostDao');
const mockPostDao = new PostDao();

const app = express();
app.use(bodyParser.json());
app.use('/api', createUserRouter(mockPostDao));

describe('User Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /upload-video', () => {
        it('handles video upload', async () => {
            const mockPutObjectCommand = jest.fn();
            S3Client.mockImplementation(() => ({
                send: mockPutObjectCommand.mockResolvedValue({ /* mock response from S3 */ }),
            }));

            const response = await request(app)
                .post('/api/upload-video')
                .attach('video', 'path/to/test/video.file');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                message: 'Video uploaded successfully',
            });
            expect(mockPutObjectCommand).toHaveBeenCalled();
        });
    });


    describe('GET /get-video-url/:videoId', () => {
        it('handles fetching video URL', async () => {
            const videoId = '123';
            mockPostDao.getVideoByKey.mockImplementation((key, callback) => {
                callback(null, 'path/to/video/in/s3');
            });

            const mockSignedUrl = 'https://mock-signed-url.com/video';
            getSignedUrl.mockResolvedValue(mockSignedUrl);

            const response = await request(app)
                .get(`/api/get-video-url/${videoId}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                signedUrl: mockSignedUrl
            });
            expect(mockPostDao.getVideoByKey).toHaveBeenCalledWith(videoId, expect.any(Function));
        });
    });
});

