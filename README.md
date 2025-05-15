# RecipeNest - Your Personal Recipe Management System

RecipeNest is a modern web application that allows users to create, manage, and share their favorite recipes. Built with Next.js and MongoDB, it provides a seamless experience for food enthusiasts to organize their culinary creations.

## Features

### Recipe Management
- Create new recipes with detailed information
- Edit existing recipes
- Delete recipes
- View recipe details including:
  - Recipe name and image
  - Cooking time and servings
  - Categories/tags
  - Ingredients list
  - Step-by-step instructions
  - Optional video links (YouTube support)

### Review System
- Rate recipes using a 5-star system
- Add detailed reviews with comments
- Upload images with reviews
- View all reviews for each recipe
- Delete your own reviews
- Real-time average rating calculation

### User Interface
- Clean and intuitive design
- Responsive layout for all devices
- Image upload support
- YouTube video embedding
- Interactive star rating system
- Modern form controls

## Technical Stack

- **Frontend:**
  - Next.js 14
  - React
  - CSS Modules
  - Client-side form validation

- **Backend:**
  - Next.js API Routes
  - MongoDB for data storage
  - RESTful API architecture

- **Features:**
  - Server-side rendering
  - Client-side navigation
  - Image upload handling
  - YouTube video embedding
  - Responsive design

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/noiorhyun/yuexuan-recipe.git
cd recipenest
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
MONGODB_URI=mongodb+srv://Jane:jane980511@cluster0.ocgmb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
recipenest/
├── app/
│   ├── api/              # API routes
│   ├── recipes/          # Recipe pages
│   ├── components/       # Reusable components
│   └── styles/          # Global styles
├── public/              # Static files
├── lib/                 # Utility functions
└── package.json         # Project dependencies
```

## API Endpoints

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/[id]` - Get a specific recipe
- `POST /api/recipes` - Create a new recipe
- `PUT /api/recipes/[id]` - Update a recipe
- `DELETE /api/recipes/[id]` - Delete a recipe

### Reviews
- `POST /api/recipes/[id]/reviews` - Add a review
- `DELETE /api/recipes/[id]/reviews` - Delete a review

### Upload
- `POST /api/upload` - Upload images for recipes and reviews

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
- MongoDB for the database solution
- All contributors who have helped shape this project

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ by Yuexuan Lu
