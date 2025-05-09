# Modern Interactive Portfolio

![Portfolio Demo](https://img.shields.io/badge/Demo-Live%20Preview-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

A professional portfolio website showcasing technical skills and experience through dynamic, interactive web technologies. This project combines modern frontend development practices with engaging user experience design to create a standout developer portfolio.

## ✨ Features

- **Interactive UI** - Smooth animations and transitions using Framer Motion
- **3D Visualization** - Three.js-powered 3D elements for skills visualization
- **Mouse-Follow Effects** - Subtle cursor tracking elements in the hero section
- **Theme Toggle** - Dark/light mode with smooth transitions and localStorage persistence
- **Responsive Design** - Mobile-first approach with tailored experiences across all devices
- **Performance Optimized** - Efficient rendering with React hooks and memoization
- **Section Navigation** - Smart scrolling with active section detection
- **Dynamic Data Charts** - Interactive skill visualization using Chart.js
- **Touch-Friendly** - Optimized for mobile touch interactions

## 🛠️ Technologies

### Frontend
- React with TypeScript
- Vite for fast development and optimized builds
- Tailwind CSS for styling
- Framer Motion for animations
- Three.js for 3D graphics
- Chart.js for data visualization
- Shadcn UI components (based on Radix UI)

### Backend Integration
- Express.js for API endpoints
- TanStack Query for data fetching

## 📋 Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── data/              # Static data for portfolio
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   └── types/             # TypeScript type definitions
├── server/                    # Backend server code
├── shared/                    # Shared schemas and types
└── public/                    # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/modern-portfolio.git
   cd modern-portfolio
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

## 📱 Responsive Design

This portfolio is built with a mobile-first approach, ensuring a great experience on devices of all sizes:

- **Mobile** - Simplified navigation, touch-friendly elements
- **Tablet** - Adjusted layouts for medium screens
- **Desktop** - Enhanced interactive elements and animations
- **Large Screens** - Optimized spacing and proportions

## 🎨 Customization

### Theme Configuration

Edit the `theme.json` file to customize the color scheme:

```json
{
  "primary": "#06b6d4", 
  "variant": "professional",
  "appearance": "system",
  "radius": 0.5
}
```

### Content Modification

Update your portfolio information in the `client/src/data/data.ts` file:

- Personal information
- Skills and experience
- Projects showcase
- Education and certifications
- Contact details

## 🌐 Deployment

This project can be deployed to various platforms:

- **Vercel** - Easy deployment with GitHub integration
- **Netlify** - Simple deployment with continuous integration
- **Replit** - One-click deploy button
- **Custom Server** - Build and serve on your own infrastructure

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Shadcn UI for the component library
- Lucide React for the icon set
- React Three Fiber community
---

Made with ❤️ by [Vijit Mehrotra](https://github.com/vijitVM)
