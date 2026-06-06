# Social Post App

A full-stack social media web application where users can register, log in, create posts (text & images), like, comment, edit, and delete their content — all in a clean, modern feed interface.

**Live Demo:** [https://social-post-app-smoky.vercel.app/](https://social-post-app-smoky.vercel.app/)

---

##  Screenshots


### Login Page
![Login Page](<img width="1901" height="897" alt="image" src="https://github.com/user-attachments/assets/3b9a9284-e739-40cd-9453-cc5226cb1f4a" />)

### Register Page
![Register Page](<img width="1907" height="893" alt="image" src="https://github.com/user-attachments/assets/61feac75-7408-4b3b-a275-9eebf5fdd14c" />


### Feed / Home Page
![Feed Page](<img width="1880" height="901" alt="image" src="https://github.com/user-attachments/assets/3c85b2f7-833c-46ec-841e-3737f390b2a4" />
)


---

##  Features

- **User Authentication** — Secure register & login with JWT
- **Create Posts** — Share text, images, or both
- **Image Uploads** — Images streamed directly to Cloudinary (no local disk usage)
- **Like / Unlike** — Toggle likes on any post
- **Comments** — Add comments to posts with collapsible comment threads
- **Edit & Delete** — Full CRUD on your own posts via a context menu
- **Responsive UI** — Mobile-friendly design using Material UI
- **Protected Routes** — Feed is only accessible when authenticated
- **Persistent Sessions** — JWT stored in localStorage for seamless UX

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router v7 | Client-side routing |
| Material UI (MUI) v9 | Component library & theming |
| Axios | HTTP requests |
| Vercel | Deployment |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| Multer | Multipart form / file handling |
| Cloudinary | Cloud image storage |
| Render | Deployment |

---

## Project Structure

```
social-post-app/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── models/
│   │   ├── User.js              # User schema (username, email, password)
│   │   └── Post.js              # Post schema (text, image, likes, comments)
│   ├── routes/
│   │   ├── auth.js              # POST /api/auth/register, /api/auth/login
│   │   └── posts.js             # CRUD + like/comment routes for posts
│   ├── server.js                # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login form
│   │   │   ├── Register.jsx     # Registration form
│   │   │   └── Feed.jsx         # Main social feed
│   │   ├── components/
│   │   │   └── Auth.js          # (Auth helpers)
│   │   ├── App.js               # Route definitions
│   │   ├── index.js             # React entry point with ThemeProvider
│   │   └── theme.js             # MUI custom theme
│   ├── vercel.json              # SPA rewrite rules for Vercel
│   └── package.json
│
└── .gitignore
```

---

## Getting Started (Local Development)

### Prerequisites

- Node.js >= 18
- npm >= 8
- A MongoDB Atlas account (or local MongoDB)
- A Cloudinary account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/social-post-app.git
cd social-post-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

Start the backend server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be running at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React app will open at `http://localhost:3000`.

> **Note:** By default, the frontend points to the deployed Render backend URL. For local development, update the `axios` base URLs in `Feed.jsx`, `Login.jsx`, and `Register.jsx` to `http://localhost:5000`.

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login and receive a JWT | No |

**Register / Login Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGci...",
  "user": { "id": "...", "username": "john_doe", "email": "john@example.com" }
}
```

---

### Post Routes — `/api/posts`

> All write operations require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all posts (newest first) | No |
| POST | `/` | Create a new post (text/image) | Yes |
| PUT | `/:id` | Edit post text | Yes (owner only) |
| DELETE | `/:id` | Delete a post | Yes (owner only) |
| POST | `/:id/like` | Like or unlike a post | Yes |
| POST | `/:id/comment` | Add a comment to a post | Yes |

---

## Deployment

### Frontend — Vercel
- The `frontend/vercel.json` contains a rewrite rule so React Router works correctly on direct URL access.
- Connect the `frontend/` folder to a Vercel project and deploy.

### Backend — Render
- Create a new **Web Service** on Render pointing to the `backend/` folder.
- Set the **Start Command** to `node server.js`.
- Add all environment variables from your `.env` file in the Render dashboard.

---

## Security Notes

- Passwords are hashed using **bcryptjs** before being stored.
- JWTs expire after **7 days**.
- The `auth.js` middleware validates the token on every protected route.
- The `.env` file is listed in `.gitignore` — **never commit secrets to source control**.

---

## Roadmap / Future Improvements

- [ ] Follow / unfollow users
- [ ] User profile pages
- [ ] Notifications system
- [ ] Real-time updates with Socket.io
- [ ] Dark mode toggle
- [ ] Pagination / infinite scroll on the feed
- [ ] Delete individual comments

---


## License

This project is open source and available under the [MIT License](LICENSE).

---

## Author

**Visesh Bajpai**  
GitHub: [@Veebeeo](https://github.com/Veebeeo)  
Project Link: [https://social-post-app-smoky.vercel.app/](https://social-post-app-smoky.vercel.app/)
