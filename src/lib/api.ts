import axios from "./axios";

export const getEventsByOrganizer = async (organizerId: number) => {
  try {
    console.log("organizerId:", organizerId);

    // const response = await axios.post('/dashboard/events', {
    const response = await axios.post('/dashboard/', {
      organizerId,
    });

    console.log("Response data:", response.data);

    return response.data;
  } catch (error: unknown) {
    console.error('Failed to fetch events:', error);
    throw new Error('Failed to fetch events');
  }
};

export const getEvents = async () => {
  try {

    const response = await axios.get('/events');

    console.log("Response data:", response.data);

    return response.data;
  } catch (error: unknown) {
    console.error('Failed to fetch events:', error);
    throw new Error('Failed to fetch events');
  }
};

