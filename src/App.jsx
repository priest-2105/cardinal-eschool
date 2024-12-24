import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Public/Home';
import PublicRootLayout from './Components/Generic Layout/Public/Index';
import AuthRootLayout from './Components/Generic Layout/Public/Auth/Index';

async function getAllRoutes() {
  
  return [
    {
      path: '/',
      element: <PublicRootLayout />,
      children: [
        { index: true, element: <Home /> }, 
      ],
    },
    {
      path: '/auth',
      element: <AuthRootLayout />,
      children: [
        { index: true, element: <Home /> }, 
      ],
    },
    {
      path: '/dashboard/student',
      element: <AuthRootLayout />,
      children: [
        { index: true, element: <Home /> }, 
      ],
    },
    {
      path: '/dashboard/tutor',
      element: <AuthRootLayout />,
      children: [
        { index: true, element: <Home /> }, 
      ],
    },
    {
      path: '/dashboard/admin',
      element: <AuthRootLayout />,
      children: [
        { index: true, element: <Home /> }, 
      ],
    },
  ];
}

function App() {
  const [router, setRouter] = useState(null);

  useEffect(() => {
    async function setupRouter() {
      const moduleRoutes = await getAllRoutes();
      const routerInstance = createBrowserRouter(moduleRoutes);
      setRouter(routerInstance);
    }

    setupRouter();
  }, []);
 
  if (!router) {
    return <div>Loading...</div>;
  }

  return <RouterProvider router={router} />;
}

export default App;
