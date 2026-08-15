import { HashRouter, Routes, Route } from 'react-router-dom';
import { BookingProvider } from "./Components/BookingContext";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { NotificationProvider } from "./Components/NotificationContext";
import { AuthProvider } from "./Components/AuthContext";
import Home from './Home';
import Services from './Services';
import Venuepage from './Venuepage';
import Decorators from './Decorators';
import Photographer from './Photographer';
import Login from './login';
import Signup from './Signup';
//import ForgotPassword from './ForgotPassword';
import ForgotPassword from './ForgotPassword';
import VendorRegister from './VendorRegistrationform';
import VendorDashboard from './VendorDashboard';
import About from './About';
import VendorProfile from "./Photographer";
import ChatPage from "./ChatPage";
import BookingDetails from "./BookingDetails";
import PackageSelection from "./PackageSelection";
import Payment from "./Payment";
import VendorsList from "./VendorsList";

// 💳 STRIPE IMPORTS & ACCURATE INITIALIZATION FIX
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Fallback Stripe Key ensure karega ke undefined wala red error kabhi mat aaye
const STRIPE_PUBLISHABLE_KEY = 
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 
  "pk_test_51PxxxxxxDummyStripeKeyForTestingOnly000000";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// 👤 CUSTOMER DASHBOARD IMPORT
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

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="vendor-register" element={<VendorRegister />} />
        <Route path="vendor-dashboard" element={<VendorDashboard />} />
        <Route path="about" element={<About />} />
        <Route path="vendors/:id" element={<VendorProfile />} />
        <Route path="chat/:vendorId" element={<ChatPage />} />
        <Route path="details" element={<BookingDetails />} />
        <Route path="package" element={<PackageSelection />} />
        
        {/* Payment route ko Stripe Elements Wrapper ke sath connect kar diya hai */}
        <Route 
          path="payment" 
          element={
            <Elements stripe={stripePromise}>
              <Payment />
            </Elements>
          } 
        />
        
        <Route path="Vendorslist" element={<VendorsList />} />
        
        {/* CUSTOMER ROUTE */}
        <Route path="customer-dashboard" element={<CustomerDashboard />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <BookingProvider>
          <NotificationProvider>
            <Routes>
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
              <Route path="/*" element={<UserLayout />} />
            </Routes>
          </NotificationProvider>
        </BookingProvider>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;