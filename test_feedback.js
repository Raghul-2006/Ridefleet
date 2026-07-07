import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testFeedbackAggregation() {
  try {
    console.log('--- Feedback Aggregation Test ---');

    // 1. Login as admin
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@ridefleet.com',
      password: 'admin'
    });
    const token = loginRes.data.token;
    console.log('Login successful.');

    // 2. Get first vehicle
    const vehiclesRes = await axios.get(`${API_URL}/vehicles`);
    const vehicle = vehiclesRes.data[0];
    console.log(`Testing with vehicle: ${vehicle.name} (ID: ${vehicle._id})`);
    console.log(`Current Rating: ${vehicle.rating}, Reviews: ${vehicle.reviews}`);

    // 3. Create a booking for this vehicle
    console.log('Creating a booking...');
    const bookingRes = await axios.post(`${API_URL}/bookings`, {
      vehicle: vehicle._id,
      vehicleName: vehicle.name,
      image: vehicle.image,
      startDate: '2024-04-10',
      endDate: '2024-04-12',
      totalAmount: 5000,
      paymentMethod: 'UPI'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const bookingId = bookingRes.data._id;
    console.log(`Booking created: ${bookingId}`);

    // 4. Mark booking as completed (Admin only)
    console.log('Marking booking as completed...');
    await axios.patch(`${API_URL}/bookings/${bookingId}/status`, { status: 'completed' }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Status updated to completed.');

    // 5. Submit feedback
    console.log('Submitting feedback (Rating: 5)...');
    await axios.patch(`${API_URL}/bookings/${bookingId}/feedback`, {
      rating: 5,
      feedback: 'Excellent vehicle! Very smooth ride.'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Feedback submitted.');

    // 6. Check updated vehicle rating
    const updatedVehicleRes = await axios.get(`${API_URL}/vehicles`);
    const updatedVehicle = updatedVehicleRes.data.find(v => v._id === vehicle._id);
    console.log(`New Rating: ${updatedVehicle.rating}, New Reviews: ${updatedVehicle.reviews}`);

    // 7. Check vehicle reviews endpoint
    console.log('Fetching vehicle reviews...');
    const reviewsRes = await axios.get(`${API_URL}/vehicles/${vehicle._id}/reviews`);
    console.log(`Reviews count: ${reviewsRes.data.length}`);
    console.log('First review comment:', reviewsRes.data[0].feedback);

    console.log('--- Test Finished Successfully ---');

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testFeedbackAggregation();
