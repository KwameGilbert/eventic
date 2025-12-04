import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import BrowseEvents from "../pages/BrowseEvents";
import EventDetails from "../pages/EventDetails";
import SignIn from "../pages/SignIn";
import SignUpAttendee from "../pages/SignUpAttendee";
import SignUpOrganizer from "../pages/SignUpOrganizer";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import NotFound from "../pages/NotFound";
import Layout from "../components/layout/Layout";
import MyTickets from "../pages/MyTickets";
import HowItWorks from "../pages/HowItWorks";
import Settings from "../pages/Settings";
import ChangePassword from "../pages/ChangePassword";

const AppRoutes = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<BrowseEvents />} />
                <Route path="/event/:slug" element={<EventDetails />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup/attendee" element={<SignUpAttendee />} />
                <Route path="/signup/organizer" element={<SignUpOrganizer />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-tickets" element={<MyTickets />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Layout>
    )
}

export default AppRoutes
