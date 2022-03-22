import { check, fail } from "k6";

export function verifyAndLogFailedRequests(
  response,
  expected_response: Number,
  req_name: String
) {
  let message = `${req_name} status is ${expected_response}`;
  if (check(response, { [message]: (r) => r.status === expected_response })) {
    //count.add(1);
  } else {
    console.log(
      `${new Date().toISOString()} ### URL: ${response.request.url} ### data ${
        response.request.body.length > 5000
          ? response.request.body.substring(0, 40)
          : response.request.body
      }  ### Response: ${response.status} ### Body ${JSON.stringify(
        response.body
      )}`
    );
    fail(
      `########## ${req_name} failed ### Response code: ${
        response.status
      } ### Response: ${JSON.stringify(response.body)}`
    );
  }
}