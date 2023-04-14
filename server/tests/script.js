import { sleep, check } from 'k6'
import http from 'k6/http'

export const options = {
  // ext: {
  //   loadimpact: {
  //     distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
  //     apm: [],
  //   },
  // },
  // thresholds: {},
  // scenarios: {
  //   Scenario_1: {
  //     executor: 'ramping-vus',
  //     gracefulStop: '30s',
  //     stages: [
  //       { target: 5, duration: '30s' },
  //       { target: 10, duration: '2m' },
  //       { target: 0, duration: '30s' },
  //     ],
  //     gracefulRampDown: '30s',
  //     exec: 'scenario_1',
  //   },
  // },
  vus: 100,
  duration: '30s',
}

export default function() {
  // http.get('http://localhost:3001/qa/questions/100011');
  const sc1Question = http.get('http://localhost:3001/qa/questions/1000010');
  check(sc1Question, {
    'status equals 200': (res) => res.status.toString() === '200',
  });
}

// export function scenario_1() {
//   // questions
//   const sc1Question = http.get('http://localhost:3000/qa/questions/1000010');
//   check(sc1Question, {
//     'status equals 200': (res) => res.status.toString() === '200',
//   });

//   // answers
//   // const sc1Answer = http.get('http://localhost:3000/qa/questions/1000010/3518961');
//   // check(sc1Answer, {
//   //   'status equals 200': (res) => res.status.toString() === '200',
//   // });

//   // sleep
//   // sleep(1);
// }
