// Test script for booking endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test login to get JWT token
async function login(email, password) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        return null;
    }
}

// Test booking endpoints
async function testBookingEndpoints() {
    console.log('🚀 Testing Booking Endpoints with User Profiles\n');

    // Login as admin
    console.log('1. Login as admin...');
    const adminToken = await login('admin@manali.com', 'password');
    if (!adminToken) {
        console.error('❌ Admin login failed');
        return;
    }
    console.log('✅ Admin login successful\n');

    // Test 1: Get all bookings (admin only)
    console.log('2. Testing GET /packages-booking/all-bookings (Admin only)...');
    try {
        const response = await axios.get(`${BASE_URL}/packages-booking/all-bookings`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ All bookings retrieved successfully');
        console.log(`📊 Found ${response.data.length} bookings`);
        
        // Show user profiles in bookings
        response.data.forEach((booking, index) => {
            console.log(`\n📝 Booking ${index + 1}:`);
            console.log(`   - ID: ${booking.id}`);
            console.log(`   - Customer: ${booking.name}`);
            console.log(`   - Email: ${booking.email}`);
            console.log(`   - Package: ${booking.package?.name || 'N/A'}`);
            
            if (booking.user) {
                console.log(`   - User Profile:`);
                console.log(`     * Name: ${booking.user.name}`);
                console.log(`     * Role: ${booking.user.role}`);
                console.log(`     * Provider: ${booking.user.provider}`);
            } else {
                console.log(`   - User Profile: Guest booking (no registered user)`);
            }
        });
    } catch (error) {
        console.error('❌ Failed to get all bookings:', error.response?.data || error.message);
    }

    // Test 2: Get booking by ID
    console.log('\n3. Testing GET /packages-booking/booking/1...');
    try {
        const response = await axios.get(`${BASE_URL}/packages-booking/booking/1`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Booking retrieved successfully');
        console.log(`📋 Booking Details:`);
        console.log(`   - Booking ID: ${response.data.id}`);
        console.log(`   - Customer: ${response.data.name}`);
        console.log(`   - Email: ${response.data.email}`);
        console.log(`   - Package: ${response.data.package?.name}`);
        console.log(`   - Start Date: ${response.data.startDate}`);
        console.log(`   - End Date: ${response.data.endDate}`);
        
        if (response.data.user) {
            console.log(`   - User Profile:`);
            console.log(`     * User ID: ${response.data.user.id}`);
            console.log(`     * Name: ${response.data.user.name}`);
            console.log(`     * Role: ${response.data.user.role}`);
            console.log(`     * Email: ${response.data.user.email}`);
        }
    } catch (error) {
        console.error('❌ Failed to get booking:', error.response?.data || error.message);
    }

    // Test 3: Get package bookings
    console.log('\n4. Testing GET /packages-booking/package/10001/bookings...');
    try {
        const response = await axios.get(`${BASE_URL}/packages-booking/package/10001/bookings`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Package bookings retrieved successfully');
        console.log(`📦 Found ${response.data.length} bookings for package 10001`);
    } catch (error) {
        console.error('❌ Failed to get package bookings:', error.response?.data || error.message);
    }

    // Test 4: Login as regular user and test my bookings
    console.log('\n5. Testing user bookings...');
    const userToken = await login('pabitraghara@gmail.com', 'password');
    if (userToken) {
        console.log('✅ User login successful');
        
        try {
            const response = await axios.get(`${BASE_URL}/packages-booking/my-bookings`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            console.log('✅ My bookings retrieved successfully');
            console.log(`📋 Found ${response.data.length} bookings for current user`);
        } catch (error) {
            console.error('❌ Failed to get my bookings:', error.response?.data || error.message);
        }
    }

    console.log('\n🎉 Booking endpoints testing completed!');
}

// Run the test
testBookingEndpoints().catch(console.error);