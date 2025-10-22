-- ==========================================
-- DATABASE: real_estate_db
-- ==========================================
DROP DATABASE IF EXISTS real_estate_db;
CREATE DATABASE real_estate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE real_estate_db;

-- ==========================================
-- 1. Bảng district
-- ==========================================
CREATE TABLE district (
                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          name VARCHAR(255) NOT NULL
);

-- ==========================================
-- 2. Bảng building
-- ==========================================
CREATE TABLE building (
                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          name VARCHAR(255) NOT NULL,
                          street VARCHAR(255),
                          ward VARCHAR(255),
                          structure VARCHAR(255),
                          numberOfBasement INT,
                          floorArea INT,
                          rentPrice DOUBLE,
                          rentPriceDescription TEXT,
                          serviceFee VARCHAR(255),
                          carFee VARCHAR(255),
                          motorbikeFee VARCHAR(255),
                          overtimeFee VARCHAR(255),
                          waterFee VARCHAR(255),
                          electricityFee VARCHAR(255),
                          deposit VARCHAR(255),
                          payment VARCHAR(255),
                          rentTime VARCHAR(255),
                          decorationTime VARCHAR(255),
                          brokerageFee VARCHAR(255),
                          type VARCHAR(255),
                          note TEXT,
                          linkOfBuilding VARCHAR(255),
                          map VARCHAR(255),
                          image VARCHAR(255),
                          createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          modifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          createdBy VARCHAR(255),
                          modifiedBy VARCHAR(255),
                          district_id BIGINT,
                          FOREIGN KEY (district_id) REFERENCES district(id)
);

-- ==========================================
-- 3. Bảng rentarea
-- ==========================================
CREATE TABLE rentarea (
                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          value INT NOT NULL,
                          building_id BIGINT,
                          FOREIGN KEY (building_id) REFERENCES building(id)
);

-- ==========================================
-- 4. Bảng renttype
-- ==========================================
CREATE TABLE renttype (
                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          name VARCHAR(255) NOT NULL
);

-- ==========================================
-- 5. Bảng buildingrenttype (n-n)
-- ==========================================
CREATE TABLE buildingrenttype (
                                  building_id BIGINT,
                                  renttype_id BIGINT,
                                  PRIMARY KEY (building_id, renttype_id),
                                  FOREIGN KEY (building_id) REFERENCES building(id) ON DELETE CASCADE,
                                  FOREIGN KEY (renttype_id) REFERENCES renttype(id) ON DELETE CASCADE

);

-- ==========================================
-- 6. Bảng customer
-- ==========================================
CREATE TABLE customer (
                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          fullname VARCHAR(255),
                          phone VARCHAR(20),
                          email VARCHAR(255),
                          companyName VARCHAR(255),
                          demand TEXT,
                          createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          modifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- 7. Bảng transactiontype
-- ==========================================
CREATE TABLE transactiontype (
                                 id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                 name VARCHAR(255) NOT NULL
);

-- ==========================================
-- 8. Bảng transaction
-- ==========================================
CREATE TABLE transaction (
                             id BIGINT PRIMARY KEY AUTO_INCREMENT,
                             note TEXT,
                             customer_id BIGINT,
                             staff_id BIGINT,
                             transactiontype_id BIGINT,
                             createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             FOREIGN KEY (customer_id) REFERENCES customer(id),
                             FOREIGN KEY (transactiontype_id) REFERENCES transactiontype(id),
                             FOREIGN KEY (staff_id) REFERENCES user(id)
);

-- ==========================================
-- 9. Bảng role
-- ==========================================
CREATE TABLE role (
                      id BIGINT PRIMARY KEY AUTO_INCREMENT,
                      name VARCHAR(255) NOT NULL
);

-- ==========================================
-- 10. Bảng user
-- ==========================================
CREATE TABLE user (
                      id BIGINT PRIMARY KEY AUTO_INCREMENT,
                      username VARCHAR(255) NOT NULL UNIQUE,
                      password VARCHAR(255) NOT NULL,
                      fullname VARCHAR(255),
                      status TINYINT DEFAULT 1,
                      avatar VARCHAR(255),
                      role_id BIGINT,
                      FOREIGN KEY (role_id) REFERENCES role(id)
);

-- ==========================================
-- 11. Bảng assignmentbuilding
-- ==========================================
CREATE TABLE assignmentbuilding (
                                    user_id BIGINT,
                                    building_id BIGINT,
                                    PRIMARY KEY (user_id, building_id),
                                    FOREIGN KEY (user_id) REFERENCES user(id),
                                    FOREIGN KEY (building_id) REFERENCES building(id)
);

-- ==========================================
-- 12. Bảng assignmentcustomer
-- ==========================================
CREATE TABLE assignmentcustomer (
                                    user_id BIGINT,
                                    customer_id BIGINT,
                                    PRIMARY KEY (user_id, customer_id),
                                    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
                                    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
);

-- ==========================================
-- DỮ LIỆU MẪU CHO real_estate_db
-- ==========================================

-- ====== 1. District ======
INSERT INTO district (name)
VALUES 
('Quận 1'),
('Quận 2'),
('Quận 3');

-- ==========================================
-- 2. building 
-- ==========================================

INSERT INTO building (
    name, street, ward, structure, number_of_basement, floor_area,
    rent_price, rent_price_description, service_fee, car_fee, motorbike_fee,
    overtime_fee, water_fee, electricity_fee, deposit, payment, rent_time,
    decoration_time, brokerage_fee, type, note, link_of_building, map, image,
    created_by, modified_by, district_id
)
VALUES
-- Alpha Tower
('Alpha Tower', 'Nguyen Hue', 'Ben Nghe', 'Steel', 2, 1200,
 5500, 'Giá đã bao gồm VAT', 'Miễn phí vệ sinh', '150$', '50$', 
 '20$', 'Miễn phí', 'Theo giá EVN', '2 tháng', 'Chuyển khoản', '1 năm', 
 '1 tháng', '10%', 'Văn phòng', 'Tòa nhà hiện đại trung tâm Q1', 
 'https://alpha.vn', 'https://goo.gl/maps/alpha', 'alpha.png', 
 'admin', 'admin', 1),

-- Beta Building
('Beta Building', 'Le Loi', 'Ben Thanh', 'Concrete', 3, 900,
 8000, 'Bao gồm nước', 'Miễn phí dọn dẹp', '180$', '60$', 
 '25$', 'Miễn phí', 'Theo hóa đơn', '3 tháng', 'Tiền mặt', '6 tháng', 
 '2 tháng', '12%', 'Văn phòng nhỏ', 'Vị trí thuận tiện gần chợ Bến Thành', 
 'https://beta.vn', 'https://goo.gl/maps/beta', 'beta.png', 
 'admin', 'admin', 1),

-- Gamma Plaza
('Gamma Plaza', 'Tran Hung Dao', 'Co Giang', 'Steel-Concrete', 1, 1500,
 6000, 'Chưa VAT', 'Free parking', '200$', '80$', 
 '30$', 'Miễn phí', 'Theo giá điện lực', '1 tháng', 'Chuyển khoản', '1 năm', 
 '3 tuần', '8%', 'Tòa nhà hỗn hợp', 'Kết hợp văn phòng và thương mại', 
 'https://gamma.vn', 'https://goo.gl/maps/gamma', 'gamma.png', 
 'manager01', 'manager01', 2);

-- ====== 3. Rentarea ======
INSERT INTO rentarea (value, building_id)
VALUES
(100, 1),
(200, 1),
(150, 2),
(250, 3);

-- ====== 4. Renttype ======
INSERT INTO renttype (name)
VALUES 
('Nguyên căn'),
('Tầng'),
('Phòng'),
('Khu vực');

-- ====== 5. Building-Renttype mapping ======
INSERT INTO buildingrenttype (building_id, renttype_id)
VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 3),
(3, 4);

-- ====== 6. Role ======
INSERT INTO role (name)
VALUES
('Admin'),
('Manager'),
('Staff'),
('Viewer');


-- ====== 7. User ======
INSERT INTO user (username, password, fullname, status, avatar, role_id)
VALUES
('admin', '123456', 'Nguyen Van Admin', 1, 'admin.png', 1),
('staff01', '123456', 'Tran Van Staff', 1, 'staff01.png', 2),
('manager01', '123456', 'Le Thi Manager', 1, 'manager01.png', 3);

-- ====== 8. Assignment Building ======
INSERT INTO assignmentbuilding (user_id, building_id)
VALUES
(2, 1), -- staff01 quản lý Alpha Tower
(2, 2), -- staff01 quản lý Beta Building
(3, 3); -- manager01 quản lý Gamma Plaza

-- ====== 9. Customer ======
INSERT INTO customer (fullname, phone, email, company_name, demand)
VALUES
('Nguyen Van A', '0909123456', 'a@gmail.com', 'Công ty A', 'Thuê nguyên căn'),
('Tran Thi B', '0912345678', 'b@gmail.com', 'Công ty B', 'Thuê phòng nhỏ'),
('Le Van C', '0933123123', 'c@gmail.com', 'Công ty C', 'Thuê văn phòng tầng 2');


-- ====== 10. Transaction type ======
INSERT INTO transactiontype (name)
VALUES
('Tư vấn'),
('Ký hợp đồng'),
('Chăm sóc khách hàng');

-- ====== 11. Transaction ======
INSERT INTO transaction (note, customer_id, staff_id, transactiontype_id)
VALUES
('Khách hàng A quan tâm Alpha Tower', 1, 2, 1),
('Đã ký hợp đồng tại Beta Building', 2, 2, 2),
('Gọi điện chăm sóc khách hàng C', 3, 2, 3);

-- ====== 12. Assignment Customer ======
INSERT INTO assignmentcustomer (user_id, customer_id)
VALUES
(2, 1), -- staff01 phụ trách khách hàng Nguyen Van A
(2, 2), -- staff01 phụ trách khách hàng Tran Thi B
(3, 3); -- manager01 phụ trách khách hàng Le Van C
