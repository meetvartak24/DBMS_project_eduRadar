CREATE TABLE IF NOT EXISTS institutes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  code VARCHAR(32) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institute_id INT NOT NULL,
  role ENUM('admin','faculty','student') NOT NULL,
  name VARCHAR(120) NOT NULL,
  identifier VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  password_hash VARCHAR(256) NOT NULL,
  branch VARCHAR(100) NOT NULL DEFAULT '',
  division VARCHAR(20) NOT NULL DEFAULT '',
  semester INT NOT NULL DEFAULT 1,
  academic_year VARCHAR(20) NOT NULL DEFAULT '',
  UNIQUE(institute_id,role,identifier),
  UNIQUE(institute_id,id),
  FOREIGN KEY(institute_id) REFERENCES institutes(id)
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64) PRIMARY KEY,
  user_id INT NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS subjects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institute_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  code VARCHAR(32) NOT NULL,
  semester INT NOT NULL,
  credits INT NOT NULL,
  faculty_id INT NULL,
  UNIQUE(institute_id,code),
  UNIQUE(institute_id,id),
  FOREIGN KEY(institute_id) REFERENCES institutes(id),
  FOREIGN KEY(institute_id,faculty_id) REFERENCES users(institute_id,id)
);
CREATE TABLE IF NOT EXISTS records (
  institute_id INT NOT NULL,
  student_id INT NOT NULL,
  subject_id INT NOT NULL,
  mse DECIMAL(5,2) NULL,
  ese DECIMAL(5,2) NULL,
  attended INT NOT NULL DEFAULT 0,
  classes INT NOT NULL DEFAULT 0,
  assignments INT NOT NULL DEFAULT 0,
  submitted INT NOT NULL DEFAULT 0,
  practicals INT NOT NULL DEFAULT 0,
  completed INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(institute_id,student_id,subject_id),
  FOREIGN KEY(institute_id,student_id) REFERENCES users(institute_id,id),
  FOREIGN KEY(institute_id,subject_id) REFERENCES subjects(institute_id,id),
  CHECK(mse BETWEEN 0 AND 30),
  CHECK(ese BETWEEN 0 AND 70),
  CHECK(attended BETWEEN 0 AND classes),
  CHECK(submitted BETWEEN 0 AND assignments),
  CHECK(completed BETWEEN 0 AND practicals)
);
CREATE TABLE IF NOT EXISTS events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institute_id INT NOT NULL,
  student_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  event_date DATE NOT NULL,
  status VARCHAR(80) NOT NULL,
  certificate VARCHAR(500) NOT NULL DEFAULT '',
  FOREIGN KEY(institute_id,student_id) REFERENCES users(institute_id,id)
);
CREATE TABLE IF NOT EXISTS audit_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institute_id INT NOT NULL,
  actor_id INT NOT NULL,
  student_id INT NOT NULL,
  subject_id INT NOT NULL,
  details JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(institute_id,actor_id) REFERENCES users(institute_id,id)
);
