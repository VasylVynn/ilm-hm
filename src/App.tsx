import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './AuthContext';
import MemberProducts from './pages/MemberProducts';
import MemberProductsRequest from './pages/MemberProductsRequest';
import CAManual from './pages/CAManual';
import CAManualRequest from './pages/CAManualRequest';
import CAAuto from './pages/CAAuto';

export const hMRoutes = [
  {
    path: '/dashboard',
    element: <Dashboard />,
    name: 'H&M (нові)'
  },
  {
    path: '/memberPrices',
    element: <MemberProducts />,
    name: 'H&M Додано вручну'
  },
  {
    path: '/memberPrices/request',
    element: <MemberProductsRequest />,
    name: 'Додати товари H&M'
  }
]

export const cARoutes = [
  {
    path: '/c-and-a-auto',
    element: <CAAuto />,
    name: 'C&A (нові)'
  },
  {
    path: '/c-and-a-manual',
    element: <CAManual />,
    name: 'C&A Додано вручну'
  },
  {
    path: '/c-and-a-manual/request',
    element: <CAManualRequest />,
    name: 'Додати товари C&A'
  },
]


export const routes = [
  {
    path: '/',
    element: <Login />,
    name: 'Логін'
  },
  ...hMRoutes,
  ...cARoutes
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
