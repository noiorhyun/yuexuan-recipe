# RecipeNest

RecipeNest is a modern web application for sharing and discovering recipes. Built with Next.js and MongoDB, it provides a seamless experience for food enthusiasts to create, share, and explore culinary creations.

## Features

- **User Authentication**
  - Secure login and registration
  - Profile management
  - Session-based authentication with NextAuth.js
  - Protected routes and API endpoints

- **Recipe Management**
  - Create, edit, and delete recipes
  - Upload recipe images
  - Add cooking instructions and ingredients
  - Set cooking time and servings
  - Categorize recipes
  - Track recipe history

- **Recipe Discovery**
  - Browse recipes by categories
  - Search functionality
  - View recipe details
  - Save favorite recipes
  - Filter recipes by cooking time and servings

- **Review System**
  - Rate recipes (1-5 stars)
  - Add written reviews
  - View review history
  - Delete own reviews
  - See reviewer usernames

- **User Profiles**
  - View published recipes
  - Manage personal information
  - Track recipe history
  - View review history
  - Edit profile details

## Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - React 18
  - CSS Modules
  - React Icons
  - Client-side form validation

- **Backend**
  - Next.js API Routes
  - MongoDB (Database)
  - Mongoose (ODM)
  - bcryptjs (Password hashing)
  - next-auth (Authentication)

- **Authentication**
  - NextAuth.js
  - Session-based auth
  - Credentials provider
  - JWT tokens
  - Protected routes

- **Styling**
  - CSS Modules
  - Responsive design
  - Modern UI components
  - Mobile-first approach

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- MongoDB database
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/noiorhyun/recipenest.git
   cd recipenest
   ```

2. Install core dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Install additional required dependencies:
   ```bash
   # Authentication and Security
   npm install next-auth bcryptjs
   
   # Database
   npm install mongodb mongoose
   
   # UI Components and Icons
   npm install react-icons
   
   # Form Handling and Validation
   npm install react-hook-form
   
   # Image Upload
   npm install multer
   
   # Date Handling
   npm install date-fns
   
   # or using yarn
   yarn add next-auth bcryptjs mongodb mongoose react-icons react-hook-form multer date-fns
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth Configuration
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Optional: Image Upload Configuration
   UPLOAD_DIR=public/uploads
   MAX_FILE_SIZE=5242880  # 5MB in bytes
   ```

5. Create required directories:
   ```bash
   # Create upload directory for recipe images
   mkdir -p public/uploads
   ```

6. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Dependencies Overview

- **Core Dependencies**
  - `next`: The Next.js framework
  - `react`: React library
  - `react-dom`: React DOM rendering

- **Authentication & Security**
  - `next-auth`: Authentication for Next.js
  - `bcryptjs`: Password hashing

- **Database**
  - `mongodb`: MongoDB database driver
  - `mongoose`: MongoDB object modeling

- **UI & Styling**
  - `react-icons`: Icon library
  - `css-modules`: CSS Modules for styling

- **Form Handling**
  - `react-hook-form`: Form validation and handling

- **File Upload**
  - `multer`: File upload handling

- **Utilities**
  - `date-fns`: Date manipulation library

## Project Structure

```
recipenest/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── recipes/      # Recipe-related endpoints
│   ├── components/        # Reusable components
│   ├── recipes/          # Recipe-related pages
│   ├── profile/          # User profile pages
│   └── auth/             # Authentication pages
├── lib/                   # Utility functions
│   └── mongodb.js        # MongoDB connection
├── models/               # Database models
├── public/               # Static assets
└── styles/              # Global styles
```

## Features in Detail

### Recipe Creation
- Add recipe name, ingredients, and instructions
- Set cooking time and servings
- Upload recipe images
- Add video links
- Categorize recipes
- Preview before publishing

### Recipe Reviews
- Rate recipes on a 5-star scale
- Add detailed reviews
- View review history
- Delete own reviews
- See reviewer usernames
- Sort reviews by date/rating

### User Profiles
- View published recipes
- Edit profile information
- Manage recipe collection
- Track review history
- Update account settings

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/profile` - Get user profile

### Recipes
- GET `/api/recipes` - Get all recipes
- POST `/api/recipes` - Create new recipe
- GET `/api/recipes/[id]` - Get recipe by ID
- PUT `/api/recipes/[id]` - Update recipe
- DELETE `/api/recipes/[id]` - Delete recipe
- GET `/api/recipes/my-recipes` - Get user's recipes
- GET `/api/recipes/search` - Search recipes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database
- All contributors who have helped shape this project

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ by Yuexuan Lu
