/* eslint-disable */
import axios from 'axios';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51JDZ8WEjD48kyMpDPC4a3V7zxsDnsKze1cIPzKE2U5GpEi9OifCPJulPJpnTcjpmHFsoeiqYHpjKR8rPrI99vzM000dQdiiWAp'
  );
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);
    //   2) Create checkout form + charge credit card
  } catch (err) {
    console.log(err);
  }
};
