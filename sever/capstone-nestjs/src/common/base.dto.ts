import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
export abstract class BaseDto {
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;

    static plainToInstance<T>(this: new (...args: any[]) => T, obj: T): T {
        return plainToInstance(this, obj, { excludeExtraneousValues: true })
    }
}

export class IdSwaggerType {
    @ApiProperty({ type: Number, description: 'User id' })
    id: number;
}