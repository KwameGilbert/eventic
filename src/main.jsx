import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { TicketProvider } from "./context/TicketContext"

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TicketProvider>
            <AppRoutes />
          </TicketProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)