/**
 * Services Index
 * 
 * Central export point for all API services.
 * Import services from this file for cleaner imports.
 * 
 * Usage:
 *   import { authService, eventService } from '../services';
 *   // or
 *   import authService from '../services/authService';
 */

export { default as api, TokenManager, API_BASE_URL } from './api';
export { default as authService } from './authService';
export { default as eventService } from './eventService';
export { default as organizerService } from './organizerService';
export { default as ticketService } from './ticketService';
export { default as orderService } from './orderService';
export { default as attendeeService } from './attendeeService';
