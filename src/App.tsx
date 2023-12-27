import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './AuthContext';
import MemberProducts from './pages/MemberProducts';
import MemberProductsRequest from './pages/MemberProductsRequest';

export const routes = [
  {
    path: '/',
    element: <Login />,
    name: 'Логін'
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    name: 'Товари (нові)'
  },
  {
    path: '/memberPrices',
    element: <MemberProducts />,
    name: 'Товари Member Prices'
  },
  {
    path: '/memberPrices/request',
    element: <MemberProductsRequest />,
    name: 'Додати товари Member Prices'
  }
]


const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {
            routes.map(route => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))
          }
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
