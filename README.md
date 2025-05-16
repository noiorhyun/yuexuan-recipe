# RecipeNest

RecipeNest is a modern web application for sharing and discovering recipes. Built with Next.js and MongoDB, it provides a seamless experience for food enthusiasts to create, share, and explore culinary creations.

## Features

- **User Authentication**
  - Secure login and registration
  - Profile management
  - Session-based authentication

- **Recipe Management**
  - Create, edit, and delete recipes
  - Upload recipe images
  - Add cooking instructions and ingredients
  - Set cooking time and servings
  - Categorize recipes

- **Recipe Discovery**
  - Browse recipes by categories
  - Search functionality
  - View recipe details
  - Save favorite recipes

- **Review System**
  - Rate recipes (1-5 stars)
  - Add written reviews
  - View review history
  - Delete own reviews

- **User Profiles**
  - View published recipes
  - Manage personal information
  - Track recipe history

## Tech Stack

- **Frontend**
  - Next.js 14
  - React
  - CSS Modules
  - React Icons

- **Backend**
  - Next.js API Routes
  - MongoDB
  - Mongoose
  - bcryptjs (for password hashing)
  - next-auth (for authentication)

- **Authentication**
  - NextAuth.js
  - Session-based auth
  - Credentials provider

- **Styling**
  - CSS Modules
  - Responsive design
  - Modern UI components

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- MongoDB database
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/recipenest.git
   cd recipenest
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Install required dependencies:
   ```bash
   npm install bcryptjs next-auth
   # or
   yarn add bcryptjs next-auth
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
recipenest/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   ├── recipes/          # Recipe-related pages
│   ├── profile/          # User profile pages
│   └── auth/             # Authentication pages
├── lib/                   # Utility functions
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

### Recipe Reviews
- Rate recipes on a 5-star scale
- Add detailed reviews
- View review history
- Delete own reviews
- See reviewer usernames

### User Profiles
- View published recipes
- Edit profile information
- Manage recipe collection
- Track review history

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
