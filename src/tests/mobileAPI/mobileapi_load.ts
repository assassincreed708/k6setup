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
import * as coreActions from "../../actions/mobileAPI/core.actions";
import * as rxpActions from "../../actions/mobileAPI/rxp.actions";

const env_data = require(`../../data/${__ENV.env}.json`);
const vUsers: number = __ENV.vusers ? parseInt(__ENV.vusers) : 1;  // If env variable is not set we will set it vUsers as 1 
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
    //To get metrics for each request
    "http_req_duration{name:Login}": ["max>=0"],
    "http_req_duration{name:App Version}": ["max>=0"],
    "http_req_duration{name:Public Key}": ["max>=0"],
    "http_req_duration{name:Get Address}": ["max>=0"],
    "http_req_duration{name:Get Phone Book}": ["max>=0"],
    "http_req_duration{name:Get Profile}": ["max>=0"],
    "http_req_duration{name:Get Wallet}": ["max>=0"],
    "http_req_duration{name:Create Address}": ["max>=0"],
    "http_req_duration{name:Delete Address}": ["max>=0"],
    "http_req_duration{name:Merchant Search}": ["max>=0"],
    "http_req_duration{name:Get Categories}": ["max>=0"],
    "http_req_duration{name:Open Category}": ["max>=0"],
    "http_req_duration{name:Get Products}": ["max>=0"],
    "http_req_duration{name:Open Product}": ["max>=0"],
    "http_req_duration{name:Add Product to cart}": ["max>=0"],
    "http_req_duration{name:Open Cart}": ["max>=0"],
    "http_req_duration{name:Option call}": ["max>=0"],
    "http_req_duration{name:Checkout call}": ["max>=0"],
    "http_req_duration{name:Buy call}": ["max>=0"],
    "http_req_duration{name:Get Orders}": ["max>=0"],
    "http_req_duration{name:Auth0 login}": ["max>=0"],
    "http_req_duration{name:Get Geo-locations}": ["max>=0"],
    "http_req_duration{name:Open Engagement}": ["max>=0"],
    "http_req_duration{name:Open Act}": ["max>=0"],
    "http_req_duration{name:Submit Act}": ["max>=0"],
    "http_req_duration{name:Get Submitted Acts}": ["max>=0"],
    "http_req_duration{name:Logout}": ["max>=0"],
  },
};

export function setup() {}

export default () => {
  let response;

  // To create header/session
  const rua_session = new Httpx({
    headers: {
      "x-rezolve-partner-apikey": env_data.api_key,
      "Content-Type": "application/json",
      "User-Agent": `qa-at-${new Date().getTime()}-${randomIntBetween(1, 99)}`,
    },
  });

  // RUA Login
  response = ruaActions.randomUserLogin(
    `${env_data.rua_host}/v2/credentials/login`,
    rua_session,
    env_data
  );
  setSleep(thinkTime1, thinkTime2);

  rua_session.addHeader("Authorization", response.headers.Authorization);

  //Store partner_id and user_id
  let partner_id = JSON.parse(response.body).partnerId;
  let entity_id = JSON.parse(response.body).sdkEntity;
  let user_id = JSON.parse(response.body).id;
  let phone = JSON.parse(response.body).username;

  // App Version
  coreActions.appVersion(
    `${env_data.core_host}/api/v1/device/appversion`,
    rua_session,
    env_data
  );
  setSleep(thinkTime1, thinkTime2);
 
  // Get Public Key
  coreActions.publicKey(
    `${env_data.core_host}/api/v1/partner/${partner_id}/customer/${entity_id}/publickey`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);

  // Get Address
  response = coreActions.getAddress(
    `${env_data.core_host}/api/v1/partner/${partner_id}/customer/${entity_id}/addressbook`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);
  let addressId = randomItem(JSON.parse(response.body)).id;

  //Get PhoneBook
  response = coreActions.getPhoneBook(
    `${env_data.core_host}/api/v1/partner/${partner_id}/customer/${entity_id}/phonebook`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);
  let phoneId = randomItem(JSON.parse(response.body).phones).id;

  // Get Profile
  coreActions.getProfile(
    `${env_data.core_host}/api/v1/partner/${partner_id}/customer/${entity_id}/profile`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);

  // Get Wallet
  coreActions.getWallet(
    `${env_data.core_host}/api/v1/partner/${partner_id}/customer/${entity_id}/wallet`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);

  // Create Address
  response = coreActions.createAddress(
    `${env_data.core_host}/api/v1/partner/${partner_id}/customer/${entity_id}/addressbook`,
    rua_session,
    env_data,
    phoneId
  );
  setSleep(thinkTime1, thinkTime2);
  let delAddressId = JSON.parse(response.body).id;

  // Delete Address
  coreActions.deleteAddress(
    `${env_data.core_host}/api/v1/partner/${partner_id}/customer/${entity_id}/addressbook/${delAddressId}`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);

  // Merchant Search
  response = coreActions.merchnatSearch(
    `${env_data.core_host}/api/v1/search/merchants/${partner_id}/${entity_id}?page=1&limit=50`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);
  let merchant_id = randomItem(JSON.parse(response.body).merchants).id;

  // Get Categories
  coreActions.getCategories(
    `${env_data.core_host}/api/v2/partner/${partner_id}/customer/${entity_id}/merchant/${merchant_id}/category?category_sort_direction=ASC&category_items_per_page=30&category_page_number=1&product_sort_direction=ASC&product_items_per_page=30&product_page_number=1`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);

  // Open Category
  coreActions.openCategory(
    `${env_data.core_host}/api/v2/partner/${partner_id}/customer/${entity_id}/merchant/${merchant_id}/category/2?category_sort_direction=ASC&category_items_per_page=30&category_page_number=1&product_sort_direction=ASC&product_items_per_page=30&product_page_number=1`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);

  // Get Products
  coreActions.getProducts(
    `${env_data.core_host}/api/v1/partner/${partner_id}/customer/${entity_id}/merchant/${merchant_id}/category?category_sort_direction=ASC&category_items_per_page=30&category_page_number=1&product_sort_direction=ASC&product_items_per_page=30&product_page_number=1`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);

  // Open Product
  let random_product = randomItem(env_data.free_products);
  coreActions.openProducts(
    `${env_data.core_host}/api/v1/partner/${partner_id}/customer/${entity_id}/merchant/${random_product.merchant_id}/category/${random_product.category_id}/product/${random_product.product_id}?ad_id=browse&placement_id=browse`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);

  // Add product to cart
  coreActions.addProductToCart(
    `${env_data.core_host}/api/v1/partner/${partner_id}/customer/${entity_id}/merchant/${random_product.merchant_id}/cart`,
    rua_session,
    random_product.product_id
  );
  setSleep(thinkTime1, thinkTime2);

  // Get Cart
  response = coreActions.getCart(
    `${env_data.core_host}/api/v1/partner/${partner_id}/customer/${entity_id}/cart`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);

  // Option call
  response = coreActions.optionCall(
    `${env_data.core_host}/api/v4/partner/${partner_id}/customer/${entity_id}/merchant/${random_product.merchant_id}/cart/${random_product.merchant_id}/options`,
    rua_session,
    random_product.product_id
  );
  setSleep(thinkTime1, thinkTime2);
  let optionId = randomItem(JSON.parse(response.body)).id;

  // Checkout call
  response = coreActions.checkoutCall(
    `${env_data.core_host}/api/v3/partner/${partner_id}/customer/${entity_id}/merchant/${random_product.merchant_id}/cart/${random_product.merchant_id}/checkout/${optionId}`,
    rua_session,
    addressId
  );
  setSleep(thinkTime1, thinkTime2);
  let checkoutId = JSON.parse(response.body).id;

  // Buy Call
  coreActions.buyCall(
    `${env_data.core_host}/api/v3/partner/${partner_id}/customer/${entity_id}/merchant/${random_product.merchant_id}/buy/${checkoutId}`,
    rua_session,
    phoneId
  );
  setSleep(thinkTime1, thinkTime2);

  // Get Orders
  coreActions.getOrders(
    `${env_data.core_host}/api/v3/partner/${partner_id}/customer/${entity_id}/order?from=2021-09-01&to=2021-10-30`,
    rua_session
  );
  setSleep(thinkTime1, thinkTime2);

  // Auth0 session
  const oauth_session = new Httpx({
    headers: {
      "Content-Type": "application/json",
      authorization: "TheKeyForTheEnvironmentReplacingBearerToken",
    },
  });

  // Auth0 login
  response = rxpActions.auth0Login(
    `${env_data.auth0_host}/v1/OAuthProxy/token`,
    oauth_session,
    env_data
  );
  setSleep(thinkTime1, thinkTime2);
  // Add token to header
  oauth_session.addHeader(
    "authorization",
    `Bearer ${JSON.parse(response.body).bearerToken}`
  );

  //Get geo-location
  response = rxpActions.getGeoLocationEngagements(
    `${env_data.engagement_host}/v1/Engagements/geolocation/triggered?area.center.latitude=15.843883&area.center.longitude=74.528209&area.coordinatestype=BD09&area.radiusinmeters=20000&ResultCoordinateType=WGS84&MinutesFurther=40&limit=100`,
    oauth_session
  );
  setSleep(thinkTime1, thinkTime2);
  let engagementId = randomItem(JSON.parse(response.body).engagements.data).id;

  // Open engagement
  rxpActions.getEngagement(
    `${env_data.engagement_host}/v1/resolver/400/api/v2/payoffcpm/${engagementId}`,
    oauth_session
  );
  setSleep(thinkTime1, thinkTime2);

  // Open Act
  let actId = randomItem(env_data.acts);
  response = rxpActions.getEngagement(
    `${env_data.engagement_host}/v1/resolver/400/api/v2/payoffcpm/${actId}`,
    oauth_session
  );
  setSleep(thinkTime1, thinkTime2);
  let actTragetId = JSON.parse(response.body).rezolveCustomPayload.act.id;
  let act_data = JSON.parse(response.body);

  // Submit Act
  rxpActions.submitAct(
    `${env_data.act_host}/v1/submissions/act/${actTragetId}/answers`,
    oauth_session,
    act_data,
    user_id,
    phone,
    entity_id
  );
  setSleep(thinkTime1, thinkTime2);

  // Get Submitted Acts
  rxpActions.getSubmittedActs(
    `${env_data.act_host}/v1/submissions?entityId=${entity_id}`,
    oauth_session
  );
  setSleep(thinkTime1, thinkTime2);

  // logout
  ruaActions.logout(`${env_data.rua_host}/v1/user/logout`, rua_session);
  setSleep(thinkTime1, thinkTime2);
};

export function handleSummary(data: any) {
  let htm = results_path + "results.html";
  let summ = results_path + "summary.txt";
  let res = {
    [htm]: htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    [summ]: textSummary(data, { indent: " " }),
  };
  return res;
}
