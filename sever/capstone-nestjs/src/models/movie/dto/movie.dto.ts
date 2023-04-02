import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import * as moment from 'moment';
export class BannerResponseDto {
    maBanner: number;

    maPhim: number;

    hinhAnh: string;
}

export class ListMovieResponseDto {
    @Expose({ name: "ma_phim" })
    maPhim: number;

    @Expose({ name: "ten_phim" })
    tenPhim: string;

    biDanh: string

    trailer: string;

    @Expose({ name: "hinh_anh" })
    hinhAnh: string;

    @Expose({ name: "mo_ta" })
    moTa: string;

    @Transform(({ value }) => moment(value).format('YYYY-MM-DD'))
    @Expose({ name: "ngay_khoi_chieu" })
    ngayKhoiChieu: Date;

    @Expose({ name: "danh_gia" })
    danhGia: number;

    hot: boolean;

    @Expose({ name: "dang_chieu" })
    dangChieu: boolean;

    @Expose({ name: "sap_chieu" })
    sapChieu: boolean;

}

