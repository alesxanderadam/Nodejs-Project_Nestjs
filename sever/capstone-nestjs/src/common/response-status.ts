import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ResponseService {
    public successCode(res: Response, data: any, message: string): void {
        res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            message,
            content: data,
        });
    }

    public successCodeNoData(res: Response, message: string): void {
        res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            message,
            content: {},
        });
    }

    public sendBadRequestResponse(res: Response, data: any, message: string): void {
        res.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            message,
            content: data,
        });
    }

    public sendUnauthorizedResponse(res: Response, data: any, message: string): void {
        res.status(HttpStatus.UNAUTHORIZED).json({
            statusCode: HttpStatus.UNAUTHORIZED,
            message,
            content: data,
        });
    }

    public sendFobidden(res: Response, data: any, message: string): void {
        res.status(HttpStatus.FORBIDDEN).json({
            statusCode: HttpStatus.FORBIDDEN,
            message,
            content: data,
        });
    }

    public sendNotFoundResponse(res: Response, data: any, message: string): void {
        res.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            message,
            content: data,
        });
    }

    public sendConflict(res: Response, data: any, message: string): void {
        res.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            message,
            content: data,
        });
    }

    public sendInternalServerErrorResponse(res: Response, message: string): void {
        throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}