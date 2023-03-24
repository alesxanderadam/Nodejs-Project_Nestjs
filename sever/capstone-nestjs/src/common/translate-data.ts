export class ConverData {
    public static getTenLoaiNguoiDung(maLoai: string): string {
        switch (maLoai) {
            case "KhachHang":
                return "Khách hàng";
            case "QuanTriVien":
                return "Quản trị viên";
            default:
                return "";
        }
    }
}