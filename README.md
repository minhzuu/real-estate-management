# Real Estate Management

Monorepo gồm 2 phần: `backend/` (Spring Boot + Maven) và `frontend/` (Vite + React).

## Yêu cầu

- Java 21
- Node.js 20+ và npm 10+
- MySQL (nếu dùng DB thật) hoặc H2 cho test

## Cấu trúc

- `backend/`: dịch vụ Spring Boot
- `frontend/`: ứng dụng React (Vite)

## Backend

- Cấu hình DB trong `backend/src/main/resources/application.yaml`.
- Chạy dev (Windows PowerShell):
  - Từ thư mục `backend/`:
    - `./mvnw.cmd spring-boot:run`
- (Tuỳ chọn) Chạy trên macOS/Linux:
  - `./mvnw spring-boot:run`
- Build jar:
  - Windows: `./mvnw.cmd clean package`
  - macOS/Linux: `./mvnw clean package`
- Mặc định chạy tại `http://localhost:8080`.

## Frontend

- Cài đặt phụ thuộc (từ thư mục `frontend/`):
  - `npm install`
- Chạy dev:
  - `npm run dev`
- Build:
  - `npm run build`
- Dev server mặc định tại `http://localhost:5173`.

## Proxy API (tuỳ chọn)

- Nếu cần gọi API `http://localhost:8080` từ frontend, cấu hình proxy trong `frontend/vite.config.js`.

## Ghi chú

- Đã thêm `.gitignore` ở root để bỏ qua `backend/target/`, `frontend/node_modules/`, file IDE, v.v.
