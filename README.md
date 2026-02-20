# Bookcircle

Bookcircle is a full-stack web application designed to enable users to discover, review, and discuss books in a community-driven environment. The platform follows a layered backend architecture and RESTful design principles to ensure scalability, maintainability, and clean separation of concerns.

# Overview

Bookcircle provides a centralized platform where readers can:
Explore books
Share reviews and ratings
Maintain personalized reading lists
Engage in discussions with other users
The system is built using Java (Spring Boot) for the backend and JavaScript-based frontend technologies, with Docker support for containerized deployment.

The application follows a standard layered architecture:

  Client (Browser)
      ->
  Frontend (JavaScript, HTML, CSS)
      ->
  REST API (Spring Boot - Java)
      ->
  Service Layer
      ->
  Repository Layer
      ->
  Database
  
# Backend Architecture Pattern

1. Controller Layer – Handles HTTP requests

2. Service Layer – Contains business logic

3. Repository Layer – Manages data persistence

4. Model Layer – Entity definitions

5. This structure improves maintainability, testability, and scalability.

# Database:
  NeonDB- Serverless PostgreSQL
# Core Features

1. User Authentication and Authorization
2. Book search and browsing
3. Rating and review system
4. Comment functionality
5. Personalized reading list management
6. Structured REST API endpoints
8. Dockerized deployment support

# Jupyter notebooks were used for:

1. Exploratory Data Analysis (EDA)
2. Recommendation logic experimentation
3. Performance validation

