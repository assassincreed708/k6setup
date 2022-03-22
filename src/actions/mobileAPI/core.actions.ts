import { Httpx } from "https://jslib.k6.io/httpx/0.0.6/index.js";
import {
  randomIntBetween,
  randomString,
} from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

import * as logHelper from "../../lib/log.helpers";

export function appVersion(_url: string, session: Httpx, env_data: any) {
  const payload: String = JSON.stringify({
    platform: "android",
    package_name: env_data.package_name.android,
    manufacturer_code: "google play",
    device_id: "2cd1d840-a330-40cc-8047-125340f655a6",
  });

  const res = session.post(_url, payload as {}, {
    tags: { name: "App Version" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "App Version");

  return res;
}

export function publicKey(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Public Key" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Public Key");

  return res;
}

export function getAddress(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Get Address" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Get Address");

  return res;
}

export function getPhoneBook(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Get Phone Book" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Get Phone Book");

  return res;
}

export function getProfile(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Get Profile" },
  });
  logHelper.verifyAndLogFailedRequests(res, 200, "Get Profile");

  return res;
}

export function getWallet(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Get Wallet" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Get Wallet");

  return res;
}

export function createAddress(
  _url: string,
  session: Httpx,
  env_data: any,
  phone_id: String
) {
  const payload: String = JSON.stringify({
    short_name: randomString(6),
    line_1: `${randomIntBetween(10, 100)} ${randomString(4)}`,
    line_2: `${randomString(4)}`,
    city: `${randomString(8)}`,
    state: env_data.address.state,
    zip: `${randomString(4)}`,
    country: env_data.address.country_code,
    full_name: `${randomString(6)} ${randomString(4)}`,
    phone_id: phone_id,
  });

  const res = session.post(_url, payload as {}, {
    tags: { name: "Create Address" },
  });

  logHelper.verifyAndLogFailedRequests(res, 201, "Create Address");

  return res;
}

export function deleteAddress(_url: string, session: Httpx) {
  const res = session.delete(_url, null, {
    tags: { name: "Delete Address" },
  });

  logHelper.verifyAndLogFailedRequests(res, 204, "Delete Address");

  return res;
}

export function merchnatSearch(_url: string, session: Httpx) {
  const payload: String = JSON.stringify({
    order_by: "location",
    order: "asc",
    device_info:
      "Xiaomi|Android|10|Mi A2|Rezolve China Dev|6719-develop-6fae277-fd",
    location: {
      longitude: 74.528209,
      latitude: 15.843883,
    },
  });

  const res = session.post(_url, payload as {}, {
    tags: { name: "Merchant Search" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Merchant Search");

  return res;
}

export function getCategories(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Get Categories" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Get Categories");

  return res;
}

export function openCategory(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Open Category" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Open Category");

  return res;
}

export function openProducts(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Get Products" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Get Products");

  return res;
}

export function getProducts(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Open Product" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Open Product");

  return res;
}

export function addProductToCart(_url: string, session: Httpx, product_id) {
  const payload: String = JSON.stringify({
    product: {
      id: `${product_id}`,
      qty: 1,
      configurable_options: [],
      custom_options: [],
    },
  });

  const res = session.post(_url, payload as {}, {
    tags: { name: "Add Product to cart" },
  });

  logHelper.verifyAndLogFailedRequests(res, 201, "Add Product to cart");

  return res;
}

export function getCart(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Open Cart" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Open Cart");

  return res;
}

export function optionCall(_url: string, session: Httpx, product_id) {
  const payload: String = JSON.stringify({
    id: `${product_id}`,
    qty: 1,
    configurable_options: [],
    custom_options: [],
  });

  const res = session.post(_url, payload as {}, {
    tags: { name: "Option call" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Option call");

  return res;
}

export function checkoutCall(_url: string, session: Httpx, address_id) {
  const payload: String = JSON.stringify({
    payment_method: {
      type: "free",
    },
    shipping_method: {
      type: "flatrate",
      address_id: `${address_id}`,
    },
  });

  const res = session.post(_url, payload as {}, {
    tags: { name: "Checkout call" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Checkout call");

  return res;
}

export function buyCall(_url: string, session: Httpx, phone_id) {
  const payload: String = JSON.stringify({
    payment_method: {
      type: "free",
      phone_id: `${phone_id}`,
    },
    location: {
      longitude: 74.528209,
      latitude: 15.843883,
    },
  });

  const res = session.post(_url, payload as {}, {
    tags: { name: "Buy call" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Buy call");

  return res;
}

export function getOrders(_url: string, session: Httpx) {
  const res = session.get(_url, null, {
    tags: { name: "Get Orders" },
  });

  logHelper.verifyAndLogFailedRequests(res, 200, "Get Orders");

  return res;
}
