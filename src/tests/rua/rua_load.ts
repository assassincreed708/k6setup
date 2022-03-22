import { group } from "k6";
import { Options } from "k6/options";
import { Httpx } from "https://jslib.k6.io/httpx/0.0.6/index.js";
import {
  randomIntBetween,
  randomItem,
} from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

import { setSleep } from "../../lib/sleep.helpers";

import * as ruaActions from "../../actions/mobileAPI/rua.actions";

const env_data = require(`../../data/${__ENV.env}.json`);
const vUsers: number = __ENV.vusers ? parseInt(__ENV.vusers) : 1; // If env variable is not set we will set it vUsers as 1 
const results_path = __ENV.result ? __ENV.result : "/results/";

// To set delay after each request. Changes this as per required
const thinkTime1: number = 0.7;
const thinkTime2: number = 1;

export let options: Partial<Options> = {
  stages: [
    { target: vUsers, duration: "150s" },
    { target: vUsers, duration: "300s" },
    { target: 0, duration: "150s" },
  ],
  summaryTrendStats: [
    "avg",
    "min",
    "med",
    "max",
    "p(90)",
    "p(95)",
    "p(99)",
    "count",
  ],
  thresholds: {
    "http_req_duration{name:Register}": ["max>=0"],
    "http_req_duration{name:SMS confirmation}": ["max>=0"],
    "http_req_duration{name:Login}": ["max>=0"],
    "http_req_duration{name:Refresh Token}": ["max>=0"],
    "http_req_duration{name:Logout}": ["max>=0"],
  },
};

export function setup() {}

export default () => {
  let response;

  // Set Headers
  const rua_session = new Httpx({
    headers: {
      "x-rezolve-partner-apikey": env_data.api_key,
      "Content-Type": "application/json",
      "User-Agent": `qa-at-${new Date().getTime()}-${randomIntBetween(1, 99)}`,
    },
  });

  // Register a user
  response = ruaActions.registerUser(
    `${env_data.rua_host}/v2/credentials/register`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);
  //Store partner_id and user_id
  let partner_id = JSON.parse(response.body).partnerId;
  let entity_id = JSON.parse(response.body).sdkEntity;
  let username = JSON.parse(response.body).username;
  let password = "test1234";
  let userId = JSON.parse(response.body).id;

  // Confrim User throgh SMS
  ruaActions.confirmUserThroughSMSCode(
    `${env_data.rua_host}/v1/credentials/confirm/000000/${userId}`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);

  // Login
  response = ruaActions.userLogin(
    `${env_data.rua_host}/v2/credentials/login`,
    rua_session,
    username,
    password
  );
  setSleep(thinkTime1, thinkTime2);

  // Add token to header
  rua_session.addHeader("Authorization", response.headers.Authorization);

  // Refresh Token
  ruaActions.refreshToken(
    `${env_data.rua_host}/v2/credentials/ping`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);

  // // Logout
  //ruaActions.logout(`${env_data.rua_host}/v1/user/logout`, rua_session);
  //setSleep(thinkTime1, thinkTime2);
};

export function handleSummary(data) {
  let htm = results_path + "results.html";
  let summ = results_path + "summary.txt";
  let res = {
    [htm]: htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    [summ]: textSummary(data, { indent: " " }),
  };
  return res;
}
