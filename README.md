# Book E-Commerce Backend API

A RESTful backend API for an online bookstore, built with Node.js, Express.js, MongoDB, and Mongoose. The system supports user authentication, book and category management, product reviews, shopping carts, order management, and Stripe payment processing.

> Replace any placeholder marked with `YOUR_...` or `[X]` after verifying the actual project details.

## Features

- User registration and login
- JWT-based authentication
- HTTP-only cookie-based sessions
- Protected routes and authorization
- Book management
- Category management
- Product reviews
- Shopping cart management
- Order creation and management
- Stripe Checkout integration
- Stripe webhook handling
- Cloudinary media uploads
- MongoDB data modeling with Mongoose
- Centralized error handling
- CORS configuration

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Security:** bcrypt
- **Payments:** Stripe
- **Media Storage:** Cloudinary
- **Testing Tool:** Postman
- **Version Control:** Git and GitHub

## Project Scope

The backend is organized around six core resource areas:

1. Users
2. Books
3. Categories
4. Reviews
5. Shopping carts
6. Orders and payments

## Project Architecture

```text
.
├── controllers/
├── middlewares/
├── models/
├── routers/
├── utils/
├── app.js
├── package.json
├── package-lock.json
└── .env.example
```

The project follows a modular MVC-style structure. Routers define the API routes, controllers contain business logic, models define MongoDB schemas, middleware handles authentication and shared request processing, and utility modules contain reusable functionality.

## API Modules

### Authentication and Users

- Register new users
- Authenticate users
- Hash passwords securely with bcrypt
- Store authentication sessions using JWT and HTTP-only cookies
- Protect authenticated routes

### Books and Categories

- Create, read, update, and delete book records
- Manage book categories
- Validate incoming data
- Store book information using MongoDB and Mongoose

### Reviews

- Create and manage product reviews
- Associate reviews with users and books
- Protect review actions for authenticated users

### Shopping Cart

- Add books to a cart
- Update cart items
- Remove cart items
- Retrieve the current user's cart

### Orders and Payments

- Create and manage orders
- Process payments through Stripe Checkout
- Handle Stripe webhook events
- Update order status after payment confirmation

## API Endpoints

> Update the endpoint names below to match the actual route definitions in the project before publishing this section.

### Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/register` | Register a new user | Not required |
| POST | `/login` | Authenticate a user | Not required |
| POST | `/logout` | Log out the current user | Required |

### Books

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/books` | Retrieve all books | Not required |
| GET | `/books/:id` | Retrieve a book by ID | Not required |
| POST | `/books` | Create a new book | Admin |
| PUT | `/books/:id` | Update a book | Admin |
| DELETE | `/books/:id` | Delete a book | Admin |

### Categories

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/categories` | Retrieve all categories | Not required |
| POST | `/categories` | Create a category | Admin |
| PUT | `/categories/:id` | Update a category | Admin |
| DELETE | `/categories/:id` | Delete a category | Admin |

### Reviews, Carts, and Orders

Add the actual routes from the project here:

```text
[Method] [Endpoint] - [Description] - [Authentication requirement]
```

## Authentication and Security

The project uses the following security practices:

- JWT-based authentication
- HTTP-only cookies for session storage
- bcrypt password hashing
- Protected routes for authenticated users
- Authorization checks where applicable
- Environment variables for sensitive configuration
- CORS configuration for cross-origin requests

## Payment Flow

1. The user creates an order.
2. The backend creates a Stripe Checkout session.
3. Stripe processes the payment.
4. Stripe sends a webhook event to the backend.
5. The backend verifies the event and updates the order status.

## Installation

```bash
git clone https://github.com/Ahmed-Abdulhafez/Book-E-Commerce-BackEnd.git
cd Book-E-Commerce-BackEnd
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=8080
MONGO_DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Never commit the actual `.env` file or any secret keys to GitHub. Commit only a safe `.env.example` file.

## Running the Project

### Development

```bash
npm run dev
```

### Production

```bash
node app.js
```

The server runs on the following address by default:

```text
http://localhost:8080
```

## Testing the API

The API can be tested using Postman. Recommended test scenarios include:

- User registration and login
- Authentication and protected routes
- Book CRUD operations
- Category management
- Review creation and retrieval
- Cart operations
- Order creation
- Stripe Checkout
- Stripe webhook payment confirmation
- Invalid input and error responses

Add the Postman collection link here after publishing it:

```md
[Postman Collection](YOUR_POSTMAN_COLLECTION_URL)
```

## Deployment

Add a deployment link only if the project is publicly available and working:

```md
[Live API](YOUR_DEPLOYMENT_URL)
```

If the project is deployed using Vercel or another hosting provider, add the deployment instructions here.

## Future Improvements

- Add automated tests using Jest and Supertest
- Add API documentation using Swagger/OpenAPI
- Add pagination and advanced filtering
- Add rate limiting
- Add Docker support
- Add CI/CD with GitHub Actions
- Add a public production demo
- Add request validation with a dedicated validation library

## License

This project is licensed under the MIT License.

---

# CV Project Description

The following section can be copied into the Projects or Project Experience section of the resume.

## Book E-Commerce Platform — Backend REST API

`Node.js | Express.js | MongoDB | Mongoose | JWT | Stripe | Cloudinary`

- Developed a RESTful e-commerce backend covering **6 core resource areas**: users, books, categories, reviews, shopping carts, and orders.
- Applied MVC architecture with modular routers, controllers, models, middleware, utility modules, and centralized error handling.
- Implemented JWT authentication, HTTP-only cookie sessions, bcrypt password hashing, protected routes, and authorization controls.
- Designed MongoDB schemas with Mongoose for users, books, categories, reviews, shopping carts, and orders.
- Integrated Stripe Checkout and webhook handling to support payment confirmation and order processing.
- Added Cloudinary integration for media uploads and tested authentication, CRUD operations, cart workflows, and order flows using Postman.

## Stronger Quantified Version

Use the version below only after replacing each placeholder with a verified number:

- Developed **[X]+ REST API endpoints** across 6 core modules: users, books, categories, reviews, shopping carts, and orders.
- Implemented **[X] protected routes** using JWT authentication, HTTP-only cookies, bcrypt password hashing, and authorization middleware.
- Designed and integrated **[X] MongoDB/Mongoose data models** with validation for users, books, categories, reviews, carts, and orders.
- Integrated Stripe Checkout and webhook handling to support secure payment confirmation and automated order updates.
- Tested **[X] API workflows** with Postman, covering authentication, CRUD operations, cart management, checkout, and order processing.

## How to Verify the Numbers

Before using the quantified version, verify the values directly from the repository:

- Count all `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` route definitions.
- Count the actual Mongoose model files.
- Count the routes protected by authentication middleware.
- Count the Postman requests or workflows that you actually tested.
- Add performance metrics only if you measured them with a documented tool.
- Do not claim a percentage improvement without a before-and-after measurement.

## Short One-Page Resume Version

```text
Book E-Commerce Platform — Backend REST API
Node.js | Express.js | MongoDB | Mongoose | JWT | Stripe | Cloudinary

- Developed a RESTful e-commerce backend across 6 core modules: users, books, categories, reviews, carts, and orders.
- Applied MVC architecture with modular routers, controllers, models, middleware, and centralized error handling.
- Implemented JWT authentication, HTTP-only cookie sessions, bcrypt password hashing, and protected routes.
- Integrated Stripe Checkout and webhooks for payment confirmation and order processing.
- Designed MongoDB schemas with Mongoose and tested authentication, CRUD, cart, and order workflows using Postman.
```

## Deployment-Specific Resume Version

Use this version only if the project is actually deployed and the link can be verified:

```text
- Developed and deployed a Node.js e-commerce backend serving 6 core modules for users, books, categories, reviews, carts, and orders.
- Integrated Stripe Checkout, payment webhooks, and Cloudinary uploads to support end-to-end commerce workflows.
```

If there is no working public deployment, use `Developed` instead of `Developed and deployed`.

## Recommended Project Improvements

1. Add this README to the repository.
2. Add a safe `.env.example` file.
3. Publish a Postman collection.
4. Add Jest and Supertest tests.
5. Add a verified deployment link.
6. Count and document the actual endpoints.
7. Add Swagger/OpenAPI documentation.
8. Add GitHub Actions for automated checks.
