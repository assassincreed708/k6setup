import { Httpx } from "https://jslib.k6.io/httpx/0.0.6/index.js";
import {
  randomIntBetween,
  randomItem,
} from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import * as logHelper from "../../lib/log.helpers";

export function registerUser(_url: string, session: Httpx) {
  const payload: String = JSON.stringify({
    password: "test1234",
    phone: `+233${randomIntBetween(1000000000, 9999999999)}`,
  });

  const res = session.post(_url, payload as {}, {
    tags: { name: "Register" },
  });

  logHelper.verifyAndLogFailedRequests(res, 201, "Register");

  return res;
}

export function confirmUserThroughSMSCode(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "SMS confirmation" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "SMS confirmation");

  return res;
}

export function userLogin(_url: string, session: Httpx, user, password) {
  const payload: String = JSON.stringify({
    password: password,
    username: `${user}`,
    deviceId: "30d7f38d-8666-4f2c-8ad4-30f8dba9c0f6",
  });

  const res = session.post(_url, payload as {}, {
    tags: { name: "Login" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Login");

  return res;
}

export function randomUserLogin(_url: string, session: Httpx, env_data) {
  const payload: String = JSON.stringify({
    password: env_data.registered_users.password,
    username: `+${env_data.registered_users.country_code}${randomIntBetween(
      env_data.registered_users.from,
      env_data.registered_users.to
    )}`,
    deviceId: "30d7f38d-8666-4f2c-8ad4-30f8dba9c0f6",
  });

  const res = session.post(_url, payload as {}, {
    tags: { name: "Login" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Login");

  return res;
}

export function logout(_url: string, session: Httpx) {
  const res = session.post(_url, null, {
    tags: { name: "Logout" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Logout");

  return res;
}

export function refreshToken(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Refresh Token" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Refresh Token");

  return res;
}
