# Majesty Shoe Collections - Backend API ✔

## ✔ Overview

The backend API for **Majesty Shoe Collections** is built using **Express.js**, **Node.js**, and **MongoDB**. This API allows you to manage the shoe collection, customers, orders, and more for the online store. It is developed by **Welt Tallis Cooperation**.

##✔ Features

- Manage shoe collection (add, update, delete)
- User management (signup, login, authentication)
- Order management (create, update, view orders)
- Shopping cart functionality
- Payment integration  is  MPESA 
- Email  notifications 

## Technologies Used

- **Node.js** ❤
- **Express.js** - framework
- **MongoDB** - NoSQL database 
- **Mongoose** - ODM 
- **JWT (JSON Web Token)** - Authentication and authorization
- **dotenv** - Manage environment variables
-**MVC-SOFTWARE-DESIGN-PATTERN** -  Custom 

## Installation  E_COMERCE_BACKEND_SERVER_APLLICATION_PROGRAMMING_INTERFACE 😂😊😂😂🎉🤳

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Mumoh254/E-Comerce-API
    ```

2. **Navigate to the project directory**:
    ```bash
    cd  <  directory >
    ```

3. **Install dependencies**:
    Make sure you have `Node.js` and    run `npm` 
    ```bash
    npm install
    ```

4. **Set up environment variables**:
    `.env` (configure )
    ```
   MONGOOSE_CONNECTION_STRING = <your-mongodb-connection-uri>
   JWT_SECRET_KEYS_AUTHORIZE =<your-jwt-secret>
    PORT = 8000

    ```

 `<your-mongodb-connection-uri>`  and `<your-jwt-secret>` 


## API Endpoints

### 1. **Shoe Collection**

- **GET** `/api/shoes` - Get all shoes in the collection
- **POST** `/api/shoes` - Add a new shoe to the collection
- **PUT** `/api/shoes/:id` - Update shoe details by ID
- **DELETE** `/api/shoes/:id` - Delete a shoe from the collection

### 2. **User Management**

- **POST** `http://localhost:8000/apiV1/majestycollections/register` - Register a new user
- **POST** `http://localhost:8000/apiV1/majestycollections/login` - User login (returns JWT)
- **GET** `http://localhost:8000/apiV1/majestycollections/allusers`  (requires JWT authentication)
- **DELETE** `http://localhost:8000/apiV1/majestycollections/deleteuser/:id` 
- **GET** `http://localhost:8000/apiV1/majestycollections/getuser/:id` 
- **PUT** `http://localhost:8000/apiV1/majestycollections/ublockuser/:id` (unblock user)
- **PUT** `http://localhost:8000/apiV1/majestycollections/blockuser/:id`(block  user)
- **GET** `http://localhost:8000/apiV1/majestycollections/refresh`(refresh  tokens)


### 3. **Orders**

- **POST** `/api/orders` - Create a new order
- **GET** `/api/orders/:id` - Get order details by ID
- **GET** `/api/orders` - Get all orders

### 4. **Shopping Cart**

- **POST** `/api/cart` - Add a product to the shopping cart
- **GET** `/api/cart` - Get the current user's shopping cart
- **DELETE** `/api/cart/:id` - Remove an item from the shopping cart

## Running the App

- **Run in Development Mode** using `nodemon`:
    ```bash
    npm  install  (installs  all  packages)
    npm run dev
    ```
    This will start the server on port 8000 ||  5000 ( *5000* port  in `.env`).

- **Run in PRODUCTION Project**:


Ensure that MongoDB is running or connected to a cloud database like MongoDB Atlas for the app to function correctly.

## Testing

You can use **Postman** or **Insomnia** to test the API endpoints.

## License

This project is licensed under the MIT License 

## Credits  🏍💥

- **Majesty Shoe Collections** by **Welt Tallis Cooperation 🎉🤳**
- Developed by  ** WELT  TALLIS  COOPERATION ***
- CONTACTS  WELT  TALLIS  +254740045355 💬
- EMAIL  WELT  TALLIS  *peteritumo2030@gmail.com* 🗯
- Buy  Me  Coffeee : Mpesa  +254740045355
- Thankyou  for  trusting   WELT  TALLIS 
-----------------------------------------------
-     WHERE  CREATIVITY  MEETS  INNOVATION 
            🌹🌹🌹✨✨😃❤❤❤

----------------------------------------------