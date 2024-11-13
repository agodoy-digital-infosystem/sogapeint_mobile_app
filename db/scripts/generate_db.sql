
-- Création de la base de données
CREATE DATABASE sogapeint;
USE sogapeint;

-- Création de la table des utilisateurs
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Manager', 'Collaborateur', 'User') NOT NULL,
    company_id INT,
    FOREIGN KEY (company_id) REFERENCES Companies(id)
);

-- Création de la table des entreprises
CREATE TABLE Companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Création de la table des projets
CREATE TABLE Projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Table de liaison entre utilisateurs et projets
CREATE TABLE UserProjects (
    user_id INT,
    project_id INT,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (project_id) REFERENCES Projects(id)
);

-- Création de la table des documents
CREATE TABLE Documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    project_id INT,
    FOREIGN KEY (project_id) REFERENCES Projects(id)
);

-- Création de la table des notifications
CREATE TABLE Notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Création de la table des congés (leaves)
CREATE TABLE Leaves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Création de la table des articles de blog
CREATE TABLE BlogPosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id INT,
    FOREIGN KEY (author_id) REFERENCES Users(id)
);

-- Création de la table des réinitialisations de mot de passe
CREATE TABLE PasswordResets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    reset_token VARCHAR(255) NOT NULL UNIQUE,
    expiration DATETIME,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Ajout des index pour optimiser les requêtes
CREATE INDEX idx_user_email ON Users(email);
CREATE INDEX idx_reset_token ON PasswordResets(reset_token);

