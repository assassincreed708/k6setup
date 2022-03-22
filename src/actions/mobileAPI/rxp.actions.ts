import { Httpx } from "https://jslib.k6.io/httpx/0.0.6/index.js";
import {
  randomIntBetween,
  randomString,
  randomUUID,
} from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

import * as logHelper from "../../lib/log.helpers";

export function auth0Login(_url: string, session: Httpx, env_data) {
  const payload: String = JSON.stringify({
    clientId: env_data.auth0_data.clientId,
    clientSecret: env_data.auth0_data.clientSecret,
    apiAudience: env_data.auth0_data.apiAudience,
  });

  const res = session.post(_url, payload as {}, {
    tags: { name: "Auth0 login" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Auth0 login");

  return res;
}

export function getGeoLocationEngagements(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Get Geo-locations" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Get Geo-locations");

  return res;
}

export function getEngagement(_url: string, session: Httpx) {
  const payload: String = JSON.stringify({
    userId: "Guest",
    entityId: "",
    os: "Android",
    osVersion: "10 (SDK 29)",
    phoneManufacturer: "Xiaomi",
    phoneModel: "Mi A2",
    app: "fup.rezolve.app.development",
    appVersion: "6719-develop-6fae277-fd",
    lat: 15.843884,
    long: 74.528209,
  });

  const res = session.post(_url, payload as {}, {
    tags: { name: "Open Engagement" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Open Engagement");

  return res;
}

export function submitAct(
  _url: string,
  session: Httpx,
  act_data,
  user_id,
  phone,
  entity_id
) {
  let answers = [];
  let blocks = act_data.rezolveCustomPayload.act.act.pageBuildingBlocks;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type == "TextField") {
      answers.push({ question_id: blocks[i].id, answer: randomString(10) });
    }
    if (blocks[i].type == "DateField") {
      answers.push({ question_id: blocks[i].id, answer: "01/04/2023 16:00" });
    }
    if (blocks[i].type == "Select") {
      answers.push({ question_id: blocks[i].id, answer: "1" });
    }
  }
  const payload: String = JSON.stringify({
    userId: user_id,
    userName: phone,
    entityId: entity_id,
    scanId: randomUUID,
    answers: answers,
    personTitle: "Mr",
    firstName: "Load",
    lastName: "Test",
    email: phone + "@mailinator.com",
    phone: phone,
    latitude: 15.8440805,
    longitude: 74.5282825,
  });

  const res = session.post(_url, payload as {}, {
    tags: { name: "Submit Act" },
  });

  logHelper.verifyAndLogFailedRequests(res, 201, "Submit Act");

  return res;
}

export function getSubmittedActs(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Get Submitted Acts" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Get Submitted Acts");

  return res;
}
