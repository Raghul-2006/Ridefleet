import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testAddVehicle() {
  try {
    // 1. Login to get token
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@ridefleet.com',
      password: 'admin'
    });
    const token = loginRes.data.token;
    console.log('Login successful.');

    // 2. Try to add vehicle
    console.log('Adding vehicle...');
    const vehicleRes = await axios.post(`${API_URL}/vehicles`, {
      name: 'Test Vehicle',
      brand: 'Test Brand',
      type: 'Sedan',
      pricePerDay: 1000,
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      image: 'https://example.com/image.jpg'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Success:', vehicleRes.data);
    
    // 3. Clean up (Delete it)
    console.log('Cleaning up (Deleting)...');
    await axios.delete(`${API_URL}/vehicles/${vehicleRes.data._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Cleanup successful.');

  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    if (error.response && error.response.data) {
      console.error('Data:', error.response.data);
    }
  }
}

testAddVehicle();
