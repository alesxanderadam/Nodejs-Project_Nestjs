import { Expose, plainToInstance } from 'class-transformer';
export abstract class BaseDto {
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;

    static plainToInstance<T>(this: new (...args: any[]) => T, obj: T): T {
        return plainToInstance(this, obj, { excludeExtraneousValues: true })
    }
}