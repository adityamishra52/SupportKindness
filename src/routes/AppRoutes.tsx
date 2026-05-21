import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AboutPage from "@/pages/public/AboutPage";
import AnimalHelpPage from "@/pages/public/AnimalHelpPage";
import CommunitySupportPage from "@/pages/public/CommunitySupportPage";
import ContactPage from "@/pages/public/ContactPage";
import DisclaimerPage from "@/pages/legal/DisclaimerPage";
import DonationDetailsPage from "@/pages/public/DonationDetailsPage";
import DonationStatusPage from "@/pages/public/DonationStatusPage";
import FAQPage from "@/pages/public/FAQPage";
import FoodDistributionPage from "@/pages/public/FoodDistributionPage";
import GalleryPage from "@/pages/public/GalleryPage";
import HomePage from "@/pages/public/HomePage";
import NotFoundPage from "@/pages/public/NotFoundPage";
import OurWorkPage from "@/pages/public/OurWorkPage";
import PrivacyPolicyPage from "@/pages/legal/PrivacyPolicyPage";
import RefundPolicyPage from "@/pages/legal/RefundPolicyPage";
import SupportLeaderboardAdminPage from "@/pages/admin/SupportLeaderboardAdminPage";
import SupportUsPage from "@/pages/public/SupportUsPage";
import TermsConditionsPage from "@/pages/legal/TermsConditionsPage";
import TestimonialsPage from "@/pages/public/TestimonialsPage";
import TransparencyPage from "@/pages/public/TransparencyPage";
import TreePlantationPage from "@/pages/public/TreePlantationPage";
import VolunteerPage from "@/pages/public/VolunteerPage";
import { clearAdminSession, isAdminSessionValid } from "@/utils/adminAuth";

function RequireAdmin({ children }: { children: ReactElement }) {
  if (!isAdminSessionValid()) {
    clearAdminSession();
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/our-work" element={<OurWorkPage />} />
        <Route path="/animal-help" element={<AnimalHelpPage />} />
        <Route path="/tree-plantation" element={<TreePlantationPage />} />
        <Route path="/food-distribution" element={<FoodDistributionPage />} />
        <Route path="/community-support" element={<CommunitySupportPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/transparency" element={<TransparencyPage />} />
        <Route path="/support-us" element={<SupportUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/donation-details" element={<DonationDetailsPage />} />
        <Route path="/donation/success" element={<DonationStatusPage status="success" />} />
        <Route path="/donation/failure" element={<DonationStatusPage status="failure" />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          index
          element={
            <RequireAdmin>
              <AdminDashboardPage />
            </RequireAdmin>
          }
        />
        <Route
          path="support-us"
          element={
            <RequireAdmin>
              <SupportLeaderboardAdminPage />
            </RequireAdmin>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
