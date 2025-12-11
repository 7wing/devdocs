📚 **DevDocs**

DevDocs is a full‑stack platform designed to help developers share insights, publish tutorials and build a technical portfolio. It combines a modern React frontend with a secure Express + MongoDB backend, offering a seamless experience for writing, browsing and managing developer content.

This project demonstrates proficiency in **React + TypeScript**, modular architecture, authentication flows and recruiter‑friendly scaffolding including blog publishing, profile dashboards and onboarding.


🚀 **Live Demo**

[DevDocs](https://devdocs-omega.vercel.app/)


🖼️ **Screenshots**

### Light mode

![DevDocs Laptop Light Mode](./src/assets/DevDocs%20Laptop%20Light%20Mode.png)

### Dark mode

![DevDocs Laptop Dark Mode](./src/assets/DevDocs%20Laptop%20Dark%20Mode.png)


✨ **Features**

🧠 *Developer Blogging*

- New Post Editor: Rich text editor with formatting, code blocks and image embeds.
- Tagging System: Comma‑separated tags normalized for consistency.
- Error Handling: Clear feedback when publishing fails.

📖 *Blog Browsing*

- Latest Posts Grid: Responsive layout for tutorials and documentation.
- Error States: Graceful fallbacks when API calls fail.
- Reusable BlogCard Component: Clean presentation of title, excerpt, author and tags.

👤 *Profile Management*

- Profile Header: Display user info and stats.
- StatsCard: Track authored posts and engagement.
- BlogList: Filter posts by author ID.
- Logout Flow: Securely end session and redirect to Welcome.

🎨 *Premium UI/UX*

- Hero Section: Gradient text and responsive design.
- Navbar: Global navigation with theme toggle.
- Dark Mode: Automatic theme detection with white text in dark mode.
- Animations: Subtle fade‑ins and hover effects for recruiter polish.

🔐 *Secure Backend*

- Express + MongoDB: REST API for posts and users.
- Authentication: Firebase/Auth integration with Google and GitHub providers.
- Error Handling: JSON responses with clear messages.

🧰 **Tech Stack**

| Frontend | Backend | Auth | Styling |
| :--- | :--- | :--- | :--- |
| React + TypeScript | Express.js | Firebase/Auth | TailwindCSS |
| Vite | MongoDB | Google/GitHub OAuth | Radix UI |
| React Router | Mongoose | JWT | Lucide Icons |


📦 **Installation**

```bash
# Clone the repo
git clone https://github.com/yourusername/devdocs.git

# Install dependencies
npm install

# Run backend (Express + MongoDB)
node server/server.js

# Run frontend (Vite)
npm run dev
```

💡 **Why This Matters**

By combining frontend polish with a secure backend, DevDocs empowers developers to:

- Document their journey.

- Share tutorials and insights.

- Build a portfolio that recruiters can instantly understand.
