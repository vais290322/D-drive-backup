import axios from 'axios';
import { useEffect, useState } from 'react';

export function useCityData(selectedState) {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (!selectedState) return;
    
    const fetchCities = async () => {
      try {
        const {
          data: { data },
        } = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          {
            country: "India",
            state: selectedState,
          }
        );
        setCities(data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
    };
    
    fetchCities();
  }, [selectedState]);

  return cities;
}
