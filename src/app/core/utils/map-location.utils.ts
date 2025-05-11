// src/core/utils/api.utils.ts
import axios from 'axios';
import API_URL from '../config/config';

export const MapLocationutils = {
  async getCustomerLocation(id: string) {
    try {
      const response = await axios.get(`${API_URL}/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer location:', error);
      throw error;
    }
  },
  
  async getCustomers() {
    try {
      const response = await axios.get(`${API_URL}/customers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }
};