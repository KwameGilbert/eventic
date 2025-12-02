import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import BrowseEvents from "../pages/BrowseEvents";
import SignIn from "../pages/SignIn";
import SignUpAttendee from "../pages/SignUpAttendee";
import SignUpOrganizer from "../pages/SignUpOrganizer";
import NotFound from "../pages/NotFound";
import Layout from "../components/layout/Layout";

const AppRoutes = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<BrowseEvents />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup/attendee" element={<SignUpAttendee />} />
                <Route path="/signup/organizer" element={<SignUpOrganizer />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Layout>
    )
}

export default AppRoutes
