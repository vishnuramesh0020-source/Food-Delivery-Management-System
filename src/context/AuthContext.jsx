import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../utils/mockUsers';
import customToast from '../utils/customToast';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'biterate_current_user';
const STORAGE_KEY_ALL_USERS = 'biterate_all_users';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize users and current session from localStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY_ALL_USERS);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(INITIAL_USERS));
        setUsers(INITIAL_USERS);
      }

      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load user session from localStorage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper to persist users list
  const persistUsers = (newUsersList) => {
    setUsers(newUsersList);
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(newUsersList));
  };

  // Helper to persist current session
  const persistSession = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  };

  // Login handler
  const login = async (email, password) => {
    await new Promise((res) => setTimeout(res, 400));

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!existingUser) {
      throw new Error('No account found with this email address.');
    }

    if (existingUser.password !== password) {
      throw new Error('Invalid password. Please try again.');
    }

    persistSession(existingUser);
    customToast.authLogin(existingUser);
    return existingUser;
  };

  // Register handler
  const register = async (userData) => {
    await new Promise((res) => setTimeout(res, 400));

    const normalizedEmail = userData.email.trim().toLowerCase();
    const emailTaken = users.some(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (emailTaken) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name.trim(),
      email: normalizedEmail,
      password: userData.password,
      phone: userData.phone || '+1 (555) 000-0000',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + (users.length * 10)}?w=150&auto=format&fit=crop&q=80`,
      addresses: [
        {
          id: `addr-${Date.now()}`,
          title: 'Home',
          street: userData.street || '101 Main Street',
          city: userData.city || 'New York',
          state: userData.state || 'NY',
          zipCode: userData.zipCode || '10001',
          phone: userData.phone || '+1 (555) 000-0000',
          isDefault: true,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    persistUsers(updatedUsers);
    persistSession(newUser);
    customToast.authRegister(newUser);
    return newUser;
  };

  // Forgot password & reset handler
  const forgotPassword = async (email, newPassword) => {
    await new Promise((res) => setTimeout(res, 400));

    const normalizedEmail = email.trim().toLowerCase();
    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (userIndex === -1) {
      throw new Error('We could not find an account registered with that email.');
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword,
    };

    persistUsers(updatedUsers);

    if (user && user.email.toLowerCase() === normalizedEmail) {
      persistSession(updatedUsers[userIndex]);
    }

    customToast.authResetPassword();
    return true;
  };

  // Logout handler
  const logout = () => {
    persistSession(null);
    customToast.authLogout();
  };

  // Profile update handler
  const updateProfile = (updatedFields, { silent = false } = {}) => {
    if (!user) return { success: false, error: 'Not signed in.' };

    // Validate duplicate email if email is being changed
    if (updatedFields.email) {
      const normalizedNewEmail = updatedFields.email.trim().toLowerCase();
      const emailTaken = users.some(
        (u) => u.id !== user.id && u.email.toLowerCase() === normalizedNewEmail
      );
      if (emailTaken) {
        customToast.error(
          'Email Already In Use',
          'Another account is already registered with this email address.'
        );
        return {
          success: false,
          error: 'Another account is already registered with this email address.',
        };
      }
      updatedFields = { ...updatedFields, email: normalizedNewEmail };
    }

    const updatedUser = { ...user, ...updatedFields };
    persistSession(updatedUser);

    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    persistUsers(updatedUsers);
    if (!silent) {
      customToast.authProfileUpdate();
    }
    return { success: true, user: updatedUser };
  };

  // Add saved delivery address
  const addAddress = (addressData) => {
    if (!user) return null;
    const currentAddresses = user.addresses || [];
    const newAddress = {
      id: `addr-${Date.now()}`,
      ...addressData,
      isDefault: currentAddresses.length === 0 || Boolean(addressData.isDefault),
    };

    let updatedAddresses = currentAddresses;
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses = [...updatedAddresses, newAddress];

    updateProfile({ addresses: updatedAddresses }, { silent: true });
    customToast.authAddressAdded(newAddress.title || newAddress.label || 'New Address');
    return newAddress;
  };

  // Update existing saved delivery address
  const updateAddress = (addressId, addressData) => {
    if (!user) return null;
    const currentAddresses = user.addresses || [];
    const shouldBeDefault = Boolean(addressData.isDefault);

    const updatedAddresses = currentAddresses.map((addr) => {
      if (addr.id === addressId) {
        return {
          ...addr,
          ...addressData,
          isDefault: shouldBeDefault || addr.isDefault,
        };
      }
      return shouldBeDefault ? { ...addr, isDefault: false } : addr;
    });

    updateProfile({ addresses: updatedAddresses }, { silent: true });
    customToast.authAddressUpdated(addressData.title || addressData.label || 'Address');
    return updatedAddresses.find((a) => a.id === addressId);
  };

  // Set default delivery address
  const setDefaultAddress = (addressId) => {
    if (!user) return;
    const currentAddresses = user.addresses || [];
    const target = currentAddresses.find((a) => a.id === addressId);
    if (!target) return;

    const updatedAddresses = currentAddresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));

    updateProfile({ addresses: updatedAddresses }, { silent: true });
    customToast.success(
      'Default Address Updated 📍',
      `"${target.title || target.label || 'Address'}" is now your primary delivery address.`
    );
  };

  // Delete saved delivery address
  const removeAddress = (addressId) => {
    if (!user) return;
    const remaining = (user.addresses || []).filter((a) => a.id !== addressId);
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      remaining[0] = { ...remaining[0], isDefault: true };
    }
    updateProfile({ addresses: remaining }, { silent: true });
    customToast.authAddressRemoved();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        forgotPassword,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        setDefaultAddress,
        removeAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
