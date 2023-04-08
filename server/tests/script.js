import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  // stages: [
  //   { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
  //   // { duration: '10m', target: 100 }, // stay at 100 users for 10 minutes
  //   { duration: '5m', target: 0 }, // ramp-down to 0 users
  // ],
  vus: 10,
  duration: '30s',
};

// const BASE_URL = 'http://localhost:3000';

export default () => {
  http.get(`http://localhost:3000/qa/questions/40348`);

  sleep(1);
};
