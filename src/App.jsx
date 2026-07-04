import { HashRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
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

// 👑 ADMIN IMPORTS
// 👑 ADMIN IMPORTS (Corrected Paths & Names)
import AdminLayout from "./Components/AdminLayout";
import AdminDashboard from "./Admindashboard";
import VendorApproval from "./Components/VendorApproval";
import AllBookings from "./Components/AllBookings";
import Payouts from "./Components/Payouts";
import UserManagement from "./Components/UserManagement"; // 's' hata diya kyunki file singular hai
import ChatLogs from "./Components/ChatLogs";

// 📦 Aise Wrapper Component jo Main Website ke page par Navbar/Footer dikhaye
function UserLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/vendors" element={<Venuepage />} />
        <Route path="/decorators" element={<Decorators />} />
        <Route path="/photographer" element={<Photographer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/vendor-register" element={<VendorRegister />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/vendors/:id" element={<VendorProfile />} />
        <Route
          path="/chat/:vendorId"
            element={
               <ProtectedRoute>
                <ChatPage />
                 </ProtectedRoute>
                     }
                     />
                     <Route
                     path="/details"
                      element={
                       <ProtectedRoute>
                        <BookingDetails />
                       </ProtectedRoute>
                          }
                          />
                            <Route
                    path="/package"
                  element={
                 <ProtectedRoute>
                    <PackageSelection />
                    </ProtectedRoute>
                      }
           />
                        <Route
                 path="/payment"
  element={
    <ProtectedRoute>
      <Payment />
    </ProtectedRoute>
  }
/>
        <Route path="/Vendorslist" element={<VendorsList />} />
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
            {/* 🌐 MAIN CUSTOMER/VENDOR ROUTES (With Default Navbar & Footer) */}
            <Route path="/*" element={<UserLayout />} />

            {/* 🔐 NESTED ADMIN MODULE ROUTES (Clean Layout - No Default Navbar/Footer) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="vendors" element={<VendorApproval />} />
              <Route path="bookings" element={<AllBookings />} />
              <Route path="payouts" element={<Payouts />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="chats" element={<ChatLogs />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </BookingProvider>
    </HashRouter>
  );
}

export default App;