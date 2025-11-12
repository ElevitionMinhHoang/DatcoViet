# Hoa Nắng – Online Catering Management System

This is the backend for the Hoa Nắng – Online Catering Management System. It is a Node.js application built with NestJS, a progressive Node.js framework.

## Features

-   **Authentication & Authorization:** JWT-based authentication with role-based access control.
-   **Menu Management:** CRUD operations for menu items.
-   **Order Management:** Create, confirm, cancel, and track orders.
-   **Payment Processing:** Mock integration with MoMo/VNPay.
-   **Feedback System:** Submit and manage customer feedback.
-   **Delivery Tracking:** Assign shippers and track delivery status.
-   **Reporting:** Generate reports on revenue, top-selling dishes, and top customers.
-   **API Documentation:** Interactive API documentation with Swagger.
-   **Containerization:** Dockerfile and docker-compose.yml for easy deployment.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or higher)
-   [pnpm](https://pnpm.io/)
-   [Docker](https://www.docker.com/)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/hoa-nang-backend.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd hoa-nang-backend
    ```

3.  Install the dependencies:

    ```bash
    pnpm install
    ```

### Running the Application

1.  Create a `.env` file in the root of the project and add the following environment variables:

    ```
    DATABASE_URL="postgresql://postgres:password@localhost:5432/hoa_nang?schema=public"
    JWT_SECRET="your-secret-key"
    ```

2.  Start the PostgreSQL database using Docker:

    ```bash
    docker-compose up -d
    ```

3.  Run the database migrations:

    ```bash
    npx prisma migrate dev
    ```

4.  Seed the database with initial data:

    ```bash
    pnpm run seed
    ```

5.  Start the application in development mode:

    ```bash
    pnpm run start:dev
    ```

The application will be running at `http://localhost:3000`. The API documentation will be available at `http://localhost:3000/api/docs`.

### Running the Tests

To run the unit and end-to-end tests, use the following command:

```bash
pnpm run test
```

## API Documentation

The API documentation is generated using Swagger and is available at `http://localhost:3000/api/docs`.

## Deployment

The application can be deployed using Docker. The `Dockerfile` and `docker-compose.yml` files are included in the project.

```bash
docker-compose up -d --build
```
