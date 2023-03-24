export interface ListRole {
    maLoaiNguoiDung: string;
    tenLoai: string;
}

export interface UserTokenPayload {
    user: {
        ma_tai_khoan: number;
        iat: number;
        exp: number;
    }
}
