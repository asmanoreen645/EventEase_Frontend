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
import AdminDashboard from "./Admindashboard"
import VendorsList from "./VendorsList"


function App() {
  return (
    <HashRouter>
      <BookingProvider>
        <NotificationProvider>
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
        <Route path="/chat/:vendorId" element={<ChatPage />} />
        <Route path="/details" element={<BookingDetails />} />
        <Route path="/package" element={<PackageSelection />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/Vendorslist" element={<VendorsList />} />
        
      </Routes>

      <Footer />
      </NotificationProvider>
      </BookingProvider>
    </HashRouter>
  );
}
export default App;