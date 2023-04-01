import { ApiProperty } from '@nestjs/swagger';

export class TicketDto {
    @ApiProperty({ description: 'Mã lịch chiếu', example: 0 })
    maLichChieu: number;

    @ApiProperty({
        type: () => [VeDto],
        description: 'Danh sách các ghế được đặt',
        example: [{ maGhe: 0, giaVe: 0 }],
    })
    danhSachVe: VeDto[];
}

export class VeDto {
    @ApiProperty({ description: 'Mã ghế', example: 0 })
    maGhe: number;

    @ApiProperty({ description: 'Giá vé', example: 0 })
    giaVe: number;
}

export class CreateMovieShowTimes {
    @ApiProperty({ description: "Mã phim", example: 0 })
    maPhim: number

    @ApiProperty({ description: "Ngày giờ chiếu", example: "2022-04-01 12:30:00" })
    ngayGioChieu: string

    @ApiProperty({ description: 'Mã rạp', example: 0 })
    maRap: number;

    @ApiProperty({ description: 'Giá vé', example: 0 })
    giaVe: number;

}