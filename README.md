# 💰 Expense Tracker App

A simple, efficient, and user-friendly expense tracker that helps you manage your finances with ease. Track your income, expenses, categorize transactions, and handle multiple currencies—all in one place.

## 🚀 Tech Stack

- **Next.js** – React framework for fast, modern web applications  
- **Clerk** – User authentication and management  
- **Tailwind CSS** – Utility-first CSS framework for sleek, responsive designs  
- **ShadCN** – Beautiful UI components for a polished interface  
- **Prisma** – ORM for efficient database management  

## ✨ Features

- **🔐 User Authentication:** Secure login and account management with Clerk  
- **💸 Income & Expense Tracking:** Record and monitor your financial activity effortlessly  
- **📊 Categories:** Organize transactions with custom categories for better insights  
- **🌍 Multi-Currency Support:** Manage transactions in different currencies seamlessly  
- **📁 Transaction Management:** Edit, delete, and view detailed records of all your transactions  

## ⚙️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/andrechandra/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file based on `.env.example`
   - Add your database URL, Clerk API keys, etc.

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Visit:** [http://localhost:3000](http://localhost:3000)

## 📈 Future Improvements

- Budget planning tools  
- Advanced reporting and analytics  
- Recurring transactions  
- Dark mode support  

## 📝 License

This project is licensed under the [MIT License](LICENSE).
