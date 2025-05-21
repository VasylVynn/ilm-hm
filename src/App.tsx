import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './AuthContext'
import CAAuto from './pages/CAAuto'
import Carters from './pages/Carters'
import Smyk from './pages/Smyk'

export const hMRoutes = [
  {
    path: '/h-and-m',
    element: <Dashboard />,
    name: 'H&M (нові)'
  }
]

export const cARoutes = [
  {
    path: '/c-and-a-auto',
    element: <CAAuto />,
    name: 'C&A (нові)'
  }
]

export const cartersRoutes = [
  {
    path: '/carters',
    element: <Carters />,
    name: 'Carters'
  }
]

export const smykRoutes = [
  {
    path: '/smyk',
    element: <Smyk />,
    name: 'Smyk'
  }
]

export const routes = [
  {
    path: '/',
    element: <Login />,
    name: 'Логін'
  },
  ...hMRoutes,
  ...cARoutes,
  ...cartersRoutes,
  ...smykRoutes
]

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
