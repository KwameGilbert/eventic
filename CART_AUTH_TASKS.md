# Remaining Tasks for Cart & Auth Implementation

## 1. Update NavBar.jsx
The NavBar needs to show:
- **When logged in**: Cart icon with badge + User menu (with My Tickets, Cart, Logout)
- **When not logged in**: Sign In + Sign Up buttons

Replace lines 58-100 in NavBar.jsx with the auth/cart conditional rendering.

## 2. Update TicketModal.jsx
Add authentication check:
```javascript
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

// In component:
const navigate = useNavigate();
const location = useLocation();
const { isAuthenticated } = useAuth();
const { addToCart } = useCart();

// In "Proceed to Checkout" button handler:
const handleCheckout = () => {
    if (!isAuthenticated()) {
        // Save current location and redirect to login
        navigate('/signin', { state: { from: location.pathname } });
        onClose();
        return;
    }
    
    // Add to cart
    addToCart(event, selectedTickets);
    onClose();
    // Optionally navigate to cart
    navigate('/cart');
};
```

## 3. Update SignIn.jsx
Add redirect logic after login:
```javascript
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// In component:
const navigate = useNavigate();
const location = useLocation();
const { login } = useAuth();

// In form submit:
const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    
    // Redirect to previous page or home
    const from = location.state?.from || '/';
    navigate(from);
};
```

## 4. Create Cart Page
Create `src/pages/Cart.jsx` to display cart items

## 5. Add Cart Route
In `AppRoutes.jsx`:
```javascript
<Route path="/cart" element={<Cart />} />
```

## Files Created:
✅ src/context/AuthContext.jsx
✅ src/context/CartContext.jsx  
✅ Updated src/main.jsx

## Files to Update:
- [ ] src/components/layout/NavBar.jsx (add cart icon & user menu)
- [ ] src/components/modals/TicketModal.jsx (add auth check)
- [ ] src/pages/SignIn.jsx (add redirect after login)
- [ ] src/routes/AppRoutes.jsx (add /cart route)
- [ ] Create src/pages/Cart.jsx (new file)
