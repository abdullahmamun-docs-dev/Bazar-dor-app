# 🛒 Bazar Dor — Daily Market Price Tracker

Bazar Dor is a web application designed to help users explore daily market prices of essential commodities in Bangladesh. It provides product information, category-based browsing, price comparisons, market trends, and user account management in a responsive interface.

## 🌐 Live Demo

**Live Website:** https://bazar-dor-2q6z7rwgz-we-407e.vercel.app

**GitHub Repository:** https://github.com/abdullahmamun-docs-dev/Bazar-dor-app

## ✨ Features

- 📱 Responsive design for desktop, tablet, and mobile devices
- 🛍️ Browse essential products and daily market prices
- 🔎 View detailed product information
- 📂 Explore products by category
- ↕️ Sort products by price and other available criteria
- 📊 Compare current and previous prices where available
- 📈 Explore rising and falling price trends
- 🔐 User registration and login with Better Auth
- 🛡️ Protected routes for authenticated users
- 🛒 Shopping cart interface and cart state management
- 👤 User profile management and profile updates
- 🚫 Custom 404 Not Found page

## 🧰 Technologies Used

- **Next.js** — React framework for web applications
- **React** — Component-based user interface
- **JavaScript** — Application logic
- **Tailwind CSS** — Responsive styling
- **Better Auth** — Authentication and session management
- **MongoDB** — Database for authentication data
- **REST API** — Product and category data integration
- **Git & GitHub** — Version control and source code management
- **Vercel** — Application deployment

## 📡 API Integration

**Base API URL:**  
https://openapi.programming-hero.com/api/bazardor

### API Endpoints

| Endpoint | Description |
|---|---|
| `/products` | Retrieve product information |
| `/products?category=chal` | Retrieve products filtered by category |
| `/products/1` | Retrieve details for a product |
| `/categories` | Retrieve available categories |
| `/categories/chal` | Retrieve category information |

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/abdullahmamun-docs-dev/Bazar-dor-app.git
```

**2. Navigate to the project directory**

```bash
cd Bazar-dor-app
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env.local` file in the project root and configure the variables required by your application.

Example:

```env
BETTER_AUTH_SECRET=your_generated_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
```

Replace the example values with your actual local configuration. Check your application code for any additional required variables, including social login credentials if applicable.

**Important:** Never upload `.env.local`, secret keys, database credentials, or other private credentials to GitHub. Configure production environment variables separately in your Vercel project settings.

**5. Start the development server**

```bash
npm run dev
```

**6. Open the application**

Visit:

http://localhost:3000

## 📁 Project Structure

```text
Bazar-dor-app/
├── app/
├── components/
├── context/
├── lib/
├── public/
├── .gitignore
├── AGENTS.md
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── package-lock.json
└── README.md
```

## 🔐 Authentication

Bazar Dor uses Better Auth to support user authentication and session management.

Authentication features include:

- User registration
- Email and password sign-in
- Session management
- Protected pages
- User profile management

Production authentication requires the appropriate environment variables to be configured in Vercel.

## 🛒 Shopping Cart

The application includes a shopping cart interface with cart state management to support the shopping experience.

## 📊 Market Price Tracking

Users can explore essential commodity prices, browse products by category, view available product details, compare current and previous prices, and review rising or falling price trends where the API provides that information.

## 📱 Responsive Design

The user interface is designed to work across desktop computers, tablets, and mobile devices.

## 🚀 Deployment

The application is deployed using Vercel.

**Live Website:** https://bazar-dor-2q6z7rwgz-we-407e.vercel.app

To deploy your own version:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables in Vercel.
4. Deploy the application.
5. Verify authentication, database connectivity, and application routes.

## 👨‍💻 Author

**Abdullah Al Mamun**

Frontend Developer | React & Next.js Developer

- **GitHub:** https://github.com/abdullahmamun-docs-dev
- **Repository:** https://github.com/abdullahmamun-docs-dev/Bazar-dor-app

## 🎯 Project Objective

The objective of Bazar Dor is to make essential commodity price information in Bangladesh easier to explore through a convenient, accessible, and user-friendly digital platform.

## 📄 License

This project was developed for educational and assignment purposes.
