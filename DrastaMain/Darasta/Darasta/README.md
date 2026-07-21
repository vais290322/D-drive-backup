```markdown:c:\Users\Developer\Desktop\akhay\vais-react-app\README.md
# Modern React Template with Custom Components

A professional React template featuring reusable components, built with React and Tailwind CSS. This template provides a robust foundation for building scalable React applications with pre-built components and established best practices.

## ⚠️ Important Guidelines
If you have any empty folders then add a .gitkeep file inside the folder.

### Folder Structure Requirements
You MUST strictly follow this folder structure for the application to work properly. Do not deviate from this structure or rename folders:

### Component Organization
```plaintext
src/
├── components/
│   ├── index.js         # Central export for all components
│   ├── CustomDialog/    # Modal and dialog components
│   ├── Dashboard/       # Dashboard-related components
│   ├── Header/         # Navigation header
│   ├── Footer/         # Page footer
│   └── ui/            # shadcn/ui components
├── hooks/              # Custom React hooks
├── utils/             # Utility functions
├── lib/               # Third-party library configurations
├── context/           # React Context definitions
├── store/             # Redux store configuration
│   ├── features/      # Redux slices
│   │   ├── authSlice.js
│   │   └── userDataSlice.js
│   └── index.js       # Root reducer configuration
└── router/            # Application routing
```

### Coding Standards

1. **Component Guidelines**
   - Place all components in `src/components`
   - Create separate folders for each component
   - Include `index.js` for clean exports

2. **Naming Conventions**
   - Components: PascalCase (e.g., `CustomDialog.jsx`)
   - Utilities and Hooks: camelCase (e.g., `useFetch.js`)
   - Files: Meaningful and descriptive names

3. **Development Practices**
   - Use functional components with hooks
   - Implement proper prop validation
   - Follow React best practices

4. **State Management**
   - Local state: Use React hooks
   - Global state: React Context for simple state
   - Complex state: Redux with proper slicing

## Key Features

- **Custom Hooks**
  - `useFetch` - Simplified REST API handling (`@/hooks/useFetch`)
  
- **Pre-built Components**
  - CustomDialog - Versatile modal component
  - Header - Responsive navigation with mobile support
  - Footer - Customizable with social links
  - UI Components - Built on shadcn/ui

- **Development Tools**
  - Tailwind CSS for styling
  - Redux toolkit for state management
  - React Router for navigation

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

## Component Documentation

### CustomDialog Component

A versatile dialog component for modals, alerts, and forms.

```jsx
import CustomDialog from '@/components/CustomDialog/CustomDialog';
import { Button } from '@/components/ui/button';

function Example() {
  return (
    <CustomDialog
      trigger={<Button>Open Dialog</Button>}
      title="Welcome"
      description="This is a custom dialog example"
      footer={<Button onClick={handleClose}>Close</Button>}
    >
      <div className="p-4">
        <p>Dialog content goes here</p>
      </div>
    </CustomDialog>
  );
}
```

#### Props
- `trigger`: JSX element that triggers the dialog
- `title`: Dialog title (default: "Dialog Title")
- `description`: Optional description text
- `children`: Body content
- `footer`: Optional footer content
- `contentClass`: Additional CSS classes
- `open`: Control dialog state externally
- `onOpenChange`: Handler for open/close events

### Header Component

Responsive navigation header with mobile menu support.

```jsx
import Header from '@/components/Header/Header';

const navigationLinks = [
  { title: 'Home', url: '/' },
  { title: 'About', url: '/about' },
  { title: 'Contact', url: '/contact' }
];

function App() {
  return (
    <Header
      links={navigationLinks}
      brandName="Your Brand"
    />
  );
}
```

#### Props
- `links`: Navigation link array
- `brandName`: Brand name display
- `className`: Additional styling classes

### Footer Component

Customizable footer with social media integration.

```jsx
import Footer from '@/components/Footer/Footer';
import { FaTwitter, FaGithub } from 'react-icons/fa';

const footerLinks = [
  { title: 'Privacy', url: '/privacy' },
  { title: 'Terms', url: '/terms' }
];

const socialLinks = [
  { 
    url: 'https://twitter.com/youraccount',
    icon: <FaTwitter />,
    label: 'Twitter'
  },
  {
    url: 'https://github.com/youraccount',
    icon: <FaGithub />,
    label: 'GitHub'
  }
];

function App() {
  return (
    <Footer
      links={footerLinks}
      socialLinks={socialLinks}
      brandName="Your Brand"
      copyrightText="© 2024 Your Brand. All rights reserved."
    />
  );
}
```

#### Props
- `links`: Footer navigation links
- `socialLinks`: Social media links array
- `brandName`: Company/brand name
- `copyrightText`: Copyright notice
- `className`: Custom CSS classes

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

```

The updated README now features:
- Clearer project structure visualization
- Improved grammar and formatting
- More detailed component documentation
- Better organized sections
- Clearer contribution guidelines
- Consistent code examples
- Professional tone throughout