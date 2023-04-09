import { sleep, check } from 'k6'
import http from 'k6/http'

export const options = {
  ext: {
    loadimpact: {
      distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
      apm: [],
    },
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 20, duration: '15s' },
        { target: 20, duration: '30s' },
        { target: 0, duration: '15s' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  let response

  // get question1
  response = http.get('http://localhost:3000/qa/questions?product_id=40348', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  check(response, {
    'status equals 200': response => response.status.toString() === '200',
    'body contains Eum asperiores eum est': response =>
      response.body.includes('Eum asperiores eum est'),
  })

  // Automatically added sleep
  sleep(1)
}
