# 🛒 Bazar Dor — Daily Market Price Tracker

Bazar Dor is a web application designed to help users explore daily market prices of essential commodities in Bangladesh.

## ✨ Features

- Responsive design for desktop, tablet, and mobile devices
- Browse products and market prices
- View product details
- Explore products by category
- Compare current and previous prices where available
- Explore rising and falling price trends
- User registration and login with Better Auth
- Protected routes
- Shopping cart interface
- User profile management
- Custom 404 page

> Make sure each listed feature is implemented and working in your project before submitting.

## 🧰 Technologies Used

- Next.js
- React
- JavaScript
- Tailwind CSS
- Better Auth
- REST API
- Git and GitHub

## 📡 API Integration

**Base API URL:**  
https://openapi.programming-hero.com/api/bazardor

### API Endpoints

| Endpoint | Description |
|---|---|
| `/products` | Retrieve products |
| `/products?category=chal` | Filter products by category |
| `/products/1` | Retrieve product details |
| `/categories` | Retrieve categories |
| `/categories/chal` | Retrieve category information |

## 🚀 Getting Started

### Prerequisites

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

Create a `.env` file in the project root and add the environment variables required by your application.

Example, if applicable to your current setup:

```env
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

Never upload secret keys or private credentials to GitHub.

**5. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```text
Bazar-dor-app/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── package.json
└── README.md
```

*This is an illustrative structure. Update it to match your actual project.*

## 🌐 Live Demo

Not deployed yet. The live demo link will be added after deployment.

## 📂 GitHub Repository

[View Source Code](https://github.com/abdullahmamun-docs-dev/Bazar-dor-app)

## 👨‍💻 Author

**Abdullah Al Mamun**

Frontend Developer | React & Next.js Developer

GitHub: [@abdullahmamun-docs-dev](https://github.com/abdullahmamun-docs-dev)

## 🎯 Project Objective

To make essential commodity price information in Bangladesh easier to explore through a convenient digital platform.

## 📄 License

Developed for educational and assignment purposes.
