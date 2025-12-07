import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import BrowseEvents from "../pages/BrowseEvents";
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
import ProtectedRoute, { OrganizerRoute, AttendeeRoute } from "../components/auth/ProtectedRoute";

// Organizer Dashboard
import DashboardLayout from "../components/organizer/layout/DashboardLayout";
import Dashboard from "../pages/organizer/Dashboard";
import Events from "../pages/organizer/Events";
import CreateEvent from "../pages/organizer/CreateEvent";
import ViewEvent from "../pages/organizer/ViewEvent";
import EditEvent from "../pages/organizer/EditEvent";
import Orders from "../pages/organizer/Orders";
import ViewOrder from "../pages/organizer/ViewOrder";
import Attendees from "../pages/organizer/Attendees";
import Finance from "../pages/organizer/Finance";
import FinanceEventDetails from "../pages/organizer/FinanceEventDetails";
import OrganizerSettings from "../pages/organizer/OrganizerSettings";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout><Outlet /></Layout>}>
                {/* Home & Browse */}
                <Route path="/" element={<Home />} />
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
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<ViewOrder />} />
                <Route path="attendees" element={<Attendees />} />
                <Route path="finance" element={<Finance />} />
                <Route path="finance/events/:id" element={<FinanceEventDetails />} />
                <Route path="settings" element={<OrganizerSettings />} />
                <Route path="*" element={<Navigate to="/organizer/dashboard" replace />} />
            </Route>

            {/* 404 NOT FOUND */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
    )
}

export default AppRoutes
