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
-- DỮ LIỆU MẪU
-- ==========================================

-- District
INSERT INTO district(name) VALUES ('Quận 1'), ('Quận 2'), ('Quận 3');

-- Building
INSERT INTO building (name, street, ward, structure, numberOfBasement, floorArea, rentPrice, serviceFee, brokerageFee, district_id, image)
VALUES
    ('Alpha Tower', 'Nguyen Hue', 'Ben Nghe', 'Steel', 2, 1000, 5000, 'Free water', '10%', 1, 'alpha.png'),
    ('Beta Building', 'Le Loi', 'Ben Thanh', 'Concrete', 3, 1500, 8000, 'Free cleaning', '12%', 1, 'beta.png'),
    ('Gamma Plaza', 'Tran Hung Dao', 'Co Giang', 'Steel-Concrete', 1, 1200, 6000, 'Free parking', '8%', 2, 'gamma.png');

-- Rentarea
INSERT INTO rentarea (value, building_id) VALUES
                                              (100, 1), (200, 1), (150, 2), (250, 3);

-- Renttype
INSERT INTO renttype (name) VALUES ('Nguyên căn'), ('Tầng'), ('Phòng'), ('Khu vực');

-- Building-Renttype mapping
INSERT INTO buildingrenttype VALUES
                                 (1,1), (1,2), (2,2), (3,3), (3,4);

-- Role
INSERT INTO role(name) VALUES ('Admin'), ('Staff'), ('Manager');

-- User
INSERT INTO user (username, password, fullname, status, avatar, role_id) VALUES
                                                                             ('admin', '123456', 'Nguyen Van Admin', 1, 'admin.png', 1),
                                                                             ('staff01', '123456', 'Tran Van Staff', 1, 'staff01.png', 2),
                                                                             ('manager01', '123456', 'Le Thi Manager', 1, 'manager01.png', 3);

-- Assignment building
INSERT INTO assignmentbuilding VALUES
                                   (2,1), -- staff01 quản lý Alpha Tower
                                   (2,2), -- staff01 quản lý Beta Building
                                   (3,3); -- manager01 quản lý Gamma Plaza

-- Customer
INSERT INTO customer(fullname, phone, email, companyName, demand) VALUES
                                                                      ('Nguyen Van A', '0909123456', 'a@gmail.com', 'Công ty A', 'Thuê nguyên căn'),
                                                                      ('Tran Thi B', '0912345678', 'b@gmail.com', 'Công ty B', 'Thuê phòng nhỏ');

-- Transaction type
INSERT INTO transactiontype(name) VALUES ('Tư vấn'), ('Ký hợp đồng');

-- Transaction
INSERT INTO transaction(note, customer_id, staff_id, transactiontype_id) VALUES
                                                                             ('Khách hàng quan tâm Alpha Tower', 1, 2, 1),
                                                                             ('Đã ký hợp đồng tại Beta Building', 2, 2, 2);
