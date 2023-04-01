import { Expose } from 'class-transformer';

export class CinemaDto {
    @Expose({ name: "ma_he_thong_rap" })
    maHeThongRap: string

    @Expose({ name: "ten_he_thong" })
    tenHeThong: string;

    biDanh: string

    logo: string;
}

export class Rap {
    @Expose({ name: "ma_rap" })
    maRap: number;

    @Expose({ name: "ten_rap" })
    tenRap: string;
}

export class Test {
    @Expose({ name: "ma_cum_rap" })
    maCumRap: string

    @Expose({ name: "ten_cum_rap" })
    tenCumRap: string

    @Expose({ name: "dia_chi" })
    diaChi: string

    @Expose({ name: "danh_sach_rap" })
    danhSachRap: Rap[];
}

export class Cineplex {
    @Expose({ name: "CumRap" })
    CumRap: Test[];
}