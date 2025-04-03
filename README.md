# AASC
# BACKEND(folder aasc_test)
1. Setup environment (.env)
- Điền thông tin tương tự trong file .envexample
- Với ID, SECRET lấy ở Ứng dụng (Chế độ nhà phát triển) trên website: bitrix24
  Example setup trên bitrix24: domain_be/auth/install
- Domain sử dụng là đường link website đã đăng ký với hệ thống bitrix24
- Port bất kỳ
2. Tải và chạy BE
- B1: npm install - để cài đặt các thư viện
- B2: npm run start - để chạy source
3. Chức năng - các loại api
- API install app
- API renew token
- API CRUD Contact
- API CRUD Requisite
4. Hoàn tất quá trình
- Sử dụng đường link theo dạng: your_domain/oauth/authorize?response_type=code&client_id=your_client_id&redirect_uri=url_random
- Hoàn tất ứng dụng có thể sử dụng các api
# FRONTEND(folder aasc_test_fe)
1. Tải và chạy FE
- B1: npm install - để cài đặt thư viện
- B2: npm run dev - để chạy source
2. Chức năng website
- Màn quản lí các liên hệ
- Thêm liên hệ
- Xoá liên hệ
- Xem chi tiết - chỉnh sửa liên hệ
- Xem danh sách các thông tin liên quan ở trong trang chi tiết liên hệ: Tên ngân hàng, số tài khoản