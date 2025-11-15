import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";

import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";

import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Retreat from './pages/Retreat/Retreat';
import HotelForm from './pages/Retreat/RetreatForm';
import Category from './pages/Category/Category';
import CategoryForm from './pages/Category/CategoryForm';
import GalleryCategory from './pages/GalleryCategory/GalleryCategory';
import GalleryCategoryForm from "./pages/GalleryCategory/GalleryCategoryForm";
import Gallery from "./pages/Gallery/Gallery";
import GalleryForm from './pages/Gallery/GalleryForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from "./auth/Login";

export default function App() {
  return (
    <>
      <Router>
        <ToastContainer position="bottom-right" autoClose={3000} />
        <ScrollToTop />

        <Routes>

          {/* ---------------- AUTH ROUTES (NO SIDEBAR) ---------------- */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />


          {/* ---------------- DASHBOARD ROUTES (WITH SIDEBAR) ---------------- */}
          <Route element={<AppLayout />}>

            <Route path="/dashboard" element={<Home />} />

            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Retreat */}
            <Route path="/retreat" element={<Retreat />} />
            <Route path="/retreat/new" element={<HotelForm />} />
            <Route path="/retreat/edit/:id" element={<HotelForm />} />

            {/* Category */}
            <Route path="/category" element={<Category />} />
            <Route path="/category/new" element={<CategoryForm />} />
            <Route path="/category/edit/:id" element={<CategoryForm />} />

            {/* Gallery Category */}
            <Route path="/gallery-category" element={<GalleryCategory />} />
            <Route path="/gallery-category/new" element={<GalleryCategoryForm />} />
            <Route path="/gallery-category/edit/:id" element={<GalleryCategoryForm />} />

            {/* Galleries */}
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/new" element={<GalleryForm />} />
            <Route path="/gallery/edit/:id" element={<GalleryForm />} />

          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

