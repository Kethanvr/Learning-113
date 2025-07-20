
# MERN Refresher – Full Stack App (Next.js + MongoDB)

This is a full-stack web app built as an assignment from **Hitesh Choudhary**’s Modern MERN Stack course.
The course provided the base, and the rest of the project was built independently.

🎥 Course Reference: [Watch here](https://youtu.be/c8Z73cVl6x4?si=Q2H7j9sSmI4cjs-1)
📂 Project Repo: [github.com/Kethanvr/MERN-Refresher-02](https://github.com/Kethanvr/MERN-Refresher-02)

-----

## 🚀 Tech Stack

  - **Framework:** **Next.js** (App Router)
  - **Database:** **MongoDB**
  - **Authentication:** **NextAuth**
  - **File Handling & CDN:** **ImageKit**
  - **Styling:** Tailwind CSS 
  - **Language:** **TypeScript**

-----

## 🔐 Features

  - User Registration & Login
  - **Credential-based Authentication with NextAuth**
  - **Protected API Routes and Pages using Middleware**
  - **Secure Video Uploads to ImageKit**
  - **CRUD operations for video data**
  - Clean, minimal UI

-----

## 📂 Project Structure

The video builds a monolithic Next.js application, not a separate client/server structure.

```
/app
  /api -> Backend API routes
  /components -> Reusable UI components
  /lib -> Helper functions, API client, DB connection
  /(pages) -> Frontend pages (e.g., login, register)
/middleware.ts -> Route protection logic
```

-----

## 🛠️ Getting Started

### 1\. Clone the Repo

```bash
git clone https://github.com/Kethanvr/MERN-Refresher-02.git
```

### 2\. Install Dependencies

```bash
cd MERN-Refresher-02
npm install
```

### 3\. Environment Variables

Create a `.env.local` file in the root of the project and add the following:

```
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_string_for_nextauth

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### 4\. Run the Development Server

```bash
npm run dev
```

-----

## 🙌 Credits

Big thanks to **Hitesh Choudhary** for designing a course that focuses on teaching how to think like a real-world developer.

-----

> Built with learning, broken with bugs, and fixed with coffee. ☕

## 📄 License

MIT