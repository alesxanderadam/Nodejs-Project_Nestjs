import { ApiProperty } from "@nestjs/swagger";

export class MovieDto {
    @ApiProperty({ name: "ten_phim", description: "Enter name movie", example: "The batman" })
    ten_phim: string;

    @ApiProperty({ name: "trailer", description: "Enter link trailer", example: "https://www.youtube.com/watch?v=mqqft2x_Aa4" })
    trailer: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    hinh_anh: string;

    @ApiProperty({ name: "mo_ta", description: "Enter description movie", example: "Phim này nên đi 2 người mới vui, ..." })
    mo_ta: string;

    @ApiProperty({ name: "ngay_khoi_chieu", description: "Enter Relese date movie", example: "04-12-2022" })
    ngay_khoi_chieu: Date;

    @ApiProperty({ name: "danh_gia", description: "Enter rate movie", example: 5 })
    danh_gia: number;

    @ApiProperty({ name: "hot", example: true })
    hot: boolean;

    @ApiProperty({ name: "dang_chieu", example: true })
    dang_chieu: boolean;

    @ApiProperty({ name: "sap_chieu", example: true })
    sap_chieu: boolean;
}