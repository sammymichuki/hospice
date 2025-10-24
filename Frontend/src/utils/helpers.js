// Format date to readable string
export const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Format time to readable string
  export const formatTime = (time) => {
    if (!time) return 'N/A';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Format currency
  export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Get status badge color
  export const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      suspended: 'bg-red-100 text-red-700',
      scheduled: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      in_stock: 'bg-green-100 text-green-700',
      low_stock: 'bg-orange-100 text-orange-700',
      out_of_stock: 'bg-red-100 text-red-700',
      expired: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };
  
  // Capitalize first letter
  export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  // Format role
  export const formatRole = (role) => {
    if (!role) return '';
    return role
      .split('_')
      .map((word) => capitalize(word))
      .join(' ');
  };
  
  // Validate email
  export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // Validate phone
  export const isValidPhone = (phone) => {
    const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return regex.test(phone);
  };
  
  // Calculate age from date of birth
  export const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  // Debounce function
  export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  // Format status text
  export const formatStatus = (status) => {
    if (!status) return '';
    return status
      .split('_')
      .map((word) => capitalize(word))
      .join(' ');
  };
  
  // Get greeting based on time
  export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  // Check if date is today
  export const isToday = (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  };
  
  // Get days difference
  export const getDaysDifference = (date1, date2) => {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Truncate text
  export const truncateText = (text, length = 50) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };
  
  export default {
    formatDate,
    formatTime,
    formatCurrency,
    getStatusColor,
    capitalize,
    formatRole,
    isValidEmail,
    isValidPhone,
    calculateAge,
    debounce,
    formatStatus,
    getGreeting,
    isToday,
    getDaysDifference,
    truncateText,
  };