import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { CarrierError } from './carrier-error';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  let mockHost: ArgumentsHost = {
    switchToHttp: () => ({
      getResponse: () => mockResponse,
      getRequest: () => ({}),
    }),
  } as any;

  beforeEach(async () => {
    filter = new HttpExceptionFilter();
    jest.clearAllMocks();
  });

  it('handles standard HttpException', () => {
    const error = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    filter.catch(error, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad Request',
      })
    );
  });

  it('handles custom CarrierError', () => {
    const error = new CarrierError('UPS', 'RATE_LIMITED', 'Exceeded rate limit', 429);
    filter.catch(error, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.TOO_MANY_REQUESTS);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        code: 'RATE_LIMITED',
        carrier: 'UPS',
      })
    );
  });

  it('handles generic Error', () => {
    const error = new Error('Unexpected error');
    filter.catch(error, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unexpected error',
      })
    );
  });
});
