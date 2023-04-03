import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class MovieDto {
    @ApiProperty({ name: "ten_phim", type: String, description: "Enter name movie", example: "The batman" })
    ten_phim: string;

    @ApiProperty({ name: "trailer", type: String, description: "Enter link trailer", example: "https://www.youtube.com/watch?v=mqqft2x_Aa4" })
    trailer: string;

    @ApiProperty({ name: 'hinh_anh', type: String, format: 'binary' })
    hinh_anh: string;

    @ApiProperty({ name: "mo_ta", type: String, description: "Enter description movie", example: "Phim này nên đi 2 người mới vui, ..." })
    mo_ta: string;

    @ApiProperty({ name: "ngay_khoi_chieu", type: String, description: "Enter Relese date movie", example: "04-12-2022" })
    ngay_khoi_chieu: string;

    @ApiProperty({ name: "danh_gia", type: Number, description: "Enter rate movie", example: 5 })
    @Transform(({ value }) => parseInt(value))
    danh_gia: any;

    @ApiProperty({ name: "hot", type: Boolean, example: true })
    hot: boolean;

    @ApiProperty({ name: "dang_chieu", type: Boolean, example: true })
    dang_chieu: boolean;

    @ApiProperty({ name: "sap_chieu", type: Boolean, example: true })
    sap_chieu: boolean;
}