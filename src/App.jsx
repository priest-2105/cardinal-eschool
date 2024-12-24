import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Public/Home';
import PublicRootLayout from './Components/Generic Layout/Public/Index';
import AuthRootLayout from './Components/Generic Layout/Public/Auth/Index';
import Signup from './pages/Public/Auth/Signup';
import Login from './pages/Public/Auth/login';
import DashboardStudentHome from './pages/Dashboard/Student/Home';
import DashboardTutorHome from './pages/Dashboard/Tutor/Home';
import DashboardAdminHome from './pages/Dashboard/Admin/Home';
import DashboardAdminRootLayout from './Components/Generic Layout/Dashboard/Admin';
import DashboardStudentRootLayout from './Components/Generic Layout/Dashboard/Student';
import DashboardTutorRootLayout from './Components/Generic Layout/Dashboard/Tutor';

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
      path: 'auth',
      element: <AuthRootLayout />,
      children: [
        {  path: 'login', index: true, element: <Login/> }, 
        { path: 'signup', element: <Signup/> },  
      ],
    },
    {
      path: 'dashboard/student',
      element: <DashboardStudentRootLayout/>,
      children: [
        { index: true, element: <DashboardStudentHome /> }, 
      ],
    },
    {
      path: 'dashboard/tutor',
      element: <DashboardTutorRootLayout />,
      children: [
        { index: true, element: <DashboardTutorHome /> }, 
      ],
    },
    {
      path: 'dashboard/admin',
      element: <DashboardAdminRootLayout/>,
      children: [
        { index: true, element: <DashboardAdminHome /> }, 
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
