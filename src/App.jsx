import { HashRouter, Routes, Route } from 'react-router-dom';
import { BookingProvider } from "./Components/BookingContext";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { NotificationProvider } from "./Components/NotificationContext";
import Home from './Home';
import Services from './Services';
import Venuepage from './Venuepage';
import Decorators from './Decorators';
import Photographer from './Photographer';
import Login from './login';
import Signup from './Signup';
import VendorRegister from './VendorRegistrationform';
import VendorDashboard from './VendorDashboard';
import About from './About';
import VendorProfile from "./Photographer";
import ChatPage from "./ChatPage";
import BookingDetails from "./BookingDetails";
import PackageSelection from "./PackageSelection";
import Payment from "./Payment";
import VendorsList from "./VendorsList";
import CustomerDashboard from "./Components/CustomerDashboard";

// 👑 ADMIN IMPORTS
import AdminLayout from "./Components/AdminLayout";
import AdminDashboard from "./Admindashboard";
import VendorApproval from "./Components/VendorApproval";
import AllBookings from "./Components/AllBookings";
import Payouts from "./Components/Payouts";
import UserManagement from "./Components/UserManagement";
import ChatLogs from "./Components/ChatLogs";
import AdminProfile from "./Components/AdminProfile";

// 🌐 USER LAYOUT
function UserLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="vendors" element={<Venuepage />} />
        <Route path="decorators" element={<Decorators />} />
        <Route path="photographer" element={<Photographer />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="vendor-register" element={<VendorRegister />} />
        <Route path="vendor-dashboard" element={<VendorDashboard />} />
        <Route path="about" element={<About />} />
        <Route path="vendors/:id" element={<VendorProfile />} />
        <Route path="chat/:vendorId" element={<ChatPage />} />
        <Route path="details" element={<BookingDetails />} />
        <Route path="package" element={<PackageSelection />} />
        <Route path="payment" element={<Payment />} />
        <Route path="Vendorslist" element={<VendorsList />} />
        
        {/* 👤 CUSTOMER DASHBOARD DIRECT ENTRY PATH */}
        <Route path="customer-dashboard" element={<CustomerDashboard />} />
        
        {/* Trailing duplicate catch lines removed to avoid duplicate key compilation warnings */}
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <BookingProvider>
        <NotificationProvider>
          <Routes>
            
            {/* 🔐 ADMIN PANEL MODULE ROUTES */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminDashboard />} />
              <Route path="vendors" element={<VendorApproval />} />
              <Route path="bookings" element={<AllBookings />} />
              <Route path="payouts" element={<Payouts />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="chats" element={<ChatLogs />} />
              <Route path="disputes" element={<ChatLogs />} />
              <Route path="alerts" element={<ChatLogs />} />
              <Route path="commission" element={<AdminDashboard />} />
              <Route path="settings" element={<AdminDashboard />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* 🌐 MAIN WEBSITE LINK DETECTION */}
            <Route path="/*" element={<UserLayout />} />

          </Routes>
        </NotificationProvider>
      </BookingProvider>
    </HashRouter>
  );
}

export default App;