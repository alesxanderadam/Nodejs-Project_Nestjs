import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ResponseService {
    public successCode(res: Response, data: any, message: string): void {
        res.status(HttpStatus.OK).json({
            message,
            content: data,
        });
    }

    public successCodeNoData(res: Response, message: string): void {
        res.status(HttpStatus.CREATED).json({
            message,
            content: {},
        });
    }

    public sendBadRequestResponse(res: Response, data: any, message: string): void {
        res.status(HttpStatus.BAD_REQUEST).json({
            message,
            content: data,
        });
    }

    public sendUnauthorizedResponse(res: Response, data: any, message: string): void {
        res.status(HttpStatus.UNAUTHORIZED).json({
            message,
            content: data,
        });
    }

    public sendNotFoundResponse(res: Response, data: any, message: string): void {
        res.status(HttpStatus.NOT_FOUND).json({
            message,
            content: data,
        });
    }

    public sendConflict(res: Response, data: any, message: string): void {
        res.status(HttpStatus.CONFLICT).json({
            message,
            content: data,
        });
    }

    public sendInternalServerErrorResponse(res: Response, message: string): void {
        throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}