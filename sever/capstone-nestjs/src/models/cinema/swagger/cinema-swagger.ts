import { ApiProperty } from '@nestjs/swagger/dist/decorators';


export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    files: any;
}