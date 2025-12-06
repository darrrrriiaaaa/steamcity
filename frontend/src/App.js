import './index.css';
import logo from './images/logo.jpg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Main from './pages/Main';
import About from './pages/About';
import Contacts from './pages/Contacts';
import Login from './pages/Login';

import AdminDashboard from './pages/AdminDashboard';
import UsersScreen from './pages/UsersScreen';
import GroupScreen from './pages/GroupScreen';
import PaymentScreen from './pages/PaymentScreen';
import ScheduleScreen from './pages/ScheduleScreen';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/about' element={<About />} />
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/authorize' element={<Login />} />

          <Route path='/dashboard/admin' element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path='/admin/users' element={<ProtectedRoute allowedRoles={['admin']}><UsersScreen /></ProtectedRoute>} />
          <Route path='/admin/groups' element={<ProtectedRoute allowedRoles={['admin']}><GroupScreen /></ProtectedRoute>} />
          <Route path='/admin/payments' element={<ProtectedRoute allowedRoles={['admin']}><PaymentScreen /></ProtectedRoute>} />

          <Route path='/schedule' element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}><ScheduleScreen /></ProtectedRoute>} />

          <Route path='/dashboard/teacher' element={<ProtectedRoute allowedRoles={['teacher']}><ScheduleScreen /></ProtectedRoute>} />
          <Route path='/dashboard/student' element={<ProtectedRoute allowedRoles={['student']}><ScheduleScreen /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
      <Footer></Footer>
    </div>
  );
}

export default App;
