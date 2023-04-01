import { Expose } from "class-transformer";

export class DanhSachGhe {
    @Expose({ name: 'ma_ghe' })
    maGhe: number;

    @Expose({ name: 'ten_ghe' })
    tenGhe: string;

    @Expose({ name: 'ma_rap' })
    maRap: number;

    @Expose({ name: 'loai_ghe' })
    loaiGhe: string;

    @Expose({ name: 'gia_ve' })
    giaVe: number;


    daDat: boolean;

    taiKhoanNguoiDat: string;
}

export class ThongTinPhim {
    @Expose({ name: 'ma_lich_chieu' })
    maLichChieu: number;

    @Expose({ name: 'ten_cum_rap' })
    tenCumRap: string;

    @Expose({ name: 'ten_rap' })
    tenRap: string;

    @Expose({ name: 'dia_chi' })
    diaChi: string;

    @Expose({ name: 'ten_phim' })
    tenPhim: string;

    @Expose({ name: 'hinh_anh' })
    hinhAnh: string;

    @Expose({ name: 'ngay_gio_chieu' })
    ngayGioChieu: String

}
