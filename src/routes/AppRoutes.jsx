import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import BrowseEvents from "../pages/BrowseEvents";
import BrowseAwards from "../pages/BrowseAwards";
import AwardDetail from "../pages/AwardDetail";
import AwardLeaderboard from "../pages/AwardLeaderboard";
import VotePayment from "../pages/VotePayment";
import EventDetails from "../pages/EventDetails";
import Categories from "../pages/Categories";
import SignIn from "../pages/SignIn";
import SignUpAttendee from "../pages/SignUpAttendee";
import SignUpOrganizer from "../pages/SignUpOrganizer";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import NotFound from "../pages/NotFound";
import Layout from "../components/layout/Layout";
import MyTickets from "../pages/MyTickets";
import MyOrders from "../pages/MyOrders";
import OrderDetails from "../pages/OrderDetails";
import HowItWorks from "../pages/HowItWorks";
import Settings from "../pages/Settings";
import ChangePassword from "../pages/ChangePassword";

// Auth Components
import { OrganizerRoute, AttendeeRoute, AdminRoute } from "../components/auth/ProtectedRoute";

// Organizer Dashboard
import DashboardLayout from "../components/organizer/layout/DashboardLayout";
import Dashboard from "../pages/organizer/Dashboard";
import Events from "../pages/organizer/Events";
import CreateEvent from "../pages/organizer/CreateEvent";
import ViewEvent from "../pages/organizer/ViewEvent";
import EditEvent from "../pages/organizer/EditEvent";
import Awards from "../pages/organizer/Awards";
import ViewAward from "../pages/organizer/ViewAward";
import CreateAward from "../pages/organizer/CreateAward";
import EditAward from "../pages/organizer/EditAward";
import Orders from "../pages/organizer/Orders";
import ViewOrder from "../pages/organizer/ViewOrder";
import Attendees from "../pages/organizer/Attendees";
import Finance from "../pages/organizer/Finance";
import FinanceEventDetails from "../pages/organizer/FinanceEventDetails";
import OrganizerSettings from "../pages/organizer/OrganizerSettings";

// Admin Dashboard
import AdminLayout from "../components/admin/layout/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminUserDetail from "../pages/admin/UserDetail";
import AdminEvents from "../pages/admin/Events";
import AdminEventDetail from "../pages/admin/EventDetail";
import AdminAwards from "../pages/admin/Awards";
import AdminAwardDetail from "../pages/admin/AwardDetail";
import AdminFinance from "../pages/admin/Finance";
import AdminAnalytics from "../pages/admin/Analytics";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout><Outlet /></Layout>}>
                {/* Home & Browse */}
                <Route path="/" element={<Home />} />

                {/* Awards Routes */}
                <Route path="/awards" element={<BrowseAwards />} />
                <Route path="/award/:slug" element={<AwardDetail />} />
                <Route path="/award/:slug/results" element={<AwardLeaderboard />} />
                <Route path="/award/:slug/leaderboard" element={<AwardLeaderboard />} />
                <Route path="/award/:slug/vote/payment" element={<VotePayment />} />

                {/* Events Routes */}
                <Route path="/events" element={<BrowseEvents />} />
                <Route path="/event/:slug" element={<EventDetails />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/how-it-works" element={<HowItWorks />} />

                {/* Authentication */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup/attendee" element={<SignUpAttendee />} />
                <Route path="/signup/organizer" element={<SignUpOrganizer />} />

                <Route path="/cart" element={<Cart />} />
            </Route>

            {/* Attendee-Only Routes */}
            <Route element={<Layout><Outlet /></Layout>}>
                <Route path="/checkout" element={<AttendeeRoute pageName="Checkout"><Checkout /></AttendeeRoute>} />
                <Route path="/my-tickets" element={<AttendeeRoute pageName="My Tickets"><MyTickets /></AttendeeRoute>} />
                <Route path="/my-orders" element={<AttendeeRoute pageName="My Orders"><MyOrders /></AttendeeRoute>} />
                <Route path="/orders/:id" element={<AttendeeRoute pageName="Order Details"><OrderDetails /></AttendeeRoute>} />
                <Route path="/settings" element={<AttendeeRoute pageName="Settings"><Settings /></AttendeeRoute>} />
                <Route path="/change-password" element={<AttendeeRoute pageName="Change Password"><ChangePassword /></AttendeeRoute>} />
            </Route>

            {/* ORGANIZER DASHBOARD ROUTES */}
            <Route path="/organizer" element={<OrganizerRoute><DashboardLayout /></OrganizerRoute>}>
                <Route index element={<Navigate to="/organizer/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="events" element={<Events />} />
                <Route path="events/create" element={<CreateEvent />} />
                <Route path="events/:id" element={<ViewEvent />} />
                <Route path="events/:id/edit" element={<EditEvent />} />
                <Route path="awards" element={<Awards />} />
                <Route path="awards/create" element={<CreateAward />} />
                <Route path="awards/:id" element={<ViewAward />} />
                <Route path="awards/:id/edit" element={<EditAward />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<ViewOrder />} />
                <Route path="attendees" element={<Attendees />} />
                <Route path="finance" element={<Finance />} />
                <Route path="finance/events/:id" element={<FinanceEventDetails />} />
                <Route path="settings" element={<OrganizerSettings />} />
                <Route path="*" element={<Navigate to="/organizer/dashboard" replace />} />
            </Route>

            {/* ADMIN DASHBOARD ROUTES */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:id" element={<AdminUserDetail />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="events/:id" element={<AdminEventDetail />} />
                <Route path="awards" element={<AdminAwards />} />
                <Route path="awards/:id" element={<AdminAwardDetail />} />
                <Route path="finance" element={<AdminFinance />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* 404 NOT FOUND */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
    )
}

export default AppRoutes
