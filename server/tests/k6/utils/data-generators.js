// tests/k6/utils/data-generators.js
// Test data generation utilities for k6 load tests

import { randomIntBetween, randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Property types from schema
const propertyTypes = ['Rooms', 'Tinyhouse', 'Apartment', 'Villa', 'Townhouse', 'Cottage'];

// Amenities from schema
const amenities = [
  'WasherDryer', 'AirConditioning', 'Dishwasher', 'HighSpeedInternet',
  'HardwoodFloors', 'WalkInClosets', 'Microwave', 'Refrigerator',
  'Pool', 'Gym', 'Parking', 'PetsAllowed', 'WiFi'
];

export function generatePropertyQueryParams() {
  // Randomly select which filters to include
  const params = {};
  
  // Price filters
  if (Math.random() > 0.3) {
    params.priceMin = randomIntBetween(500, 1500);
    params.priceMax = randomIntBetween(2000, 5000);
  }
  
  // Beds filter
  if (Math.random() > 0.3) {
    params.beds = randomIntBetween(1, 4);
  }
  
  // Baths filter
  if (Math.random() > 0.5) {
    params.baths = randomIntBetween(1, 3);
  }
  
  // Property type filter
  if (Math.random() > 0.5) {
    params.propertyType = propertyTypes[randomIntBetween(0, propertyTypes.length - 1)];
  }
  
  // Square feet filters
  if (Math.random() > 0.6) {
    params.squareFeetMin = randomIntBetween(500, 1000);
    params.squareFeetMax = randomIntBetween(1500, 3000);
  }
  
  // Amenities filter (random selection of 1-3 amenities)
  if (Math.random() > 0.6) {
    const numAmenities = randomIntBetween(1, 3);
    const selectedAmenities = [];
    for (let i = 0; i < numAmenities; i++) {
      const amenity = amenities[randomIntBetween(0, amenities.length - 1)];
      if (!selectedAmenities.includes(amenity)) {
        selectedAmenities.push(amenity);
      }
    }
    params.amenities = selectedAmenities.join(',');
  }
  
  // Location filter (hardcoded to Bengaluru coordinates)
  if (Math.random() > 0.7) {
    params.latitude = '12.9716';
    params.longitude = '77.5946';
  }
  
  return params;
}

export function generateApplicationData(propertyId, tenantCognitoId) {
  return {
    applicationDate: new Date().toISOString(),
    status: 'Pending',
    propertyId,
    tenantCognitoId,
    name: `Test User ${randomString(5)}`,
    email: `test${randomString(5)}@example.com`,
    phoneNumber: `555-${randomIntBetween(1000, 9999)}`,
    message: 'Test application message',
  };
}

export function getRandomPropertyId(propertyIds) {
  return propertyIds[randomIntBetween(0, propertyIds.length - 1)];
}

export function getRandomItem(items) {
  return items[randomIntBetween(0, items.length - 1)];
}
