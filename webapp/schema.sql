
DROP TABLE IF EXISTS zone_sensors;
DROP TABLE IF EXISTS activity;
DROP TABLE IF EXISTS zones;
DROP TABLE IF EXISTS device;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    email              VARCHAR(255) NOT NULL UNIQUE,
    password_hash      VARCHAR(255) NOT NULL,          
    parent_name        VARCHAR(120) NOT NULL DEFAULT '',
    child_name         VARCHAR(120) NOT NULL DEFAULT '',
    motion_sensitivity INT          NOT NULL DEFAULT 75,
    push_notifications TINYINT(1)   NOT NULL DEFAULT 0,
    sound_alerts       TINYINT(1)   NOT NULL DEFAULT 0,
    created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE device (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    api_key     VARCHAR(64) NOT NULL,                  
    armed       TINYINT(1)  NOT NULL DEFAULT 1,       
    alert_zone  VARCHAR(120) DEFAULT NULL,           
    alert_type  VARCHAR(40)  DEFAULT NULL,
    alert_time  TIMESTAMP    NULL DEFAULT NULL,
    last_seen   TIMESTAMP    NULL DEFAULT NULL,       
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE zones (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name    VARCHAR(120) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE zone_sensors (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    zone_id INT NOT NULL,
    type    ENUM('motion','sound','magnetic') NOT NULL,
    FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE activity (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    type       ENUM('motion','armed','deactivated','safe') NOT NULL,
    zone       VARCHAR(120) NOT NULL DEFAULT '',
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
