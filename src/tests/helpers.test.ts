import {
  udpatedRecentlyViewedJson,
  checkIfValueExistsInJSONObject,
  checkLengthOfJSON,
} from "../server/helpers/dataHelper";

const sampleJSON = `[{"id": 1}, {"id": 2}, {"id": 3}]`;

test("should return a json string that contains the newId", () => {
  const newId = 4;
  const newId_str = newId.toString();
  console.log(sampleJSON);

  const updatedJson = udpatedRecentlyViewedJson(sampleJSON, "id", newId);
  expect(updatedJson).toContain(newId_str);
});

test("should return false because json does not contain the value", () => {
  const newId = 4;
  const constains_Id = checkIfValueExistsInJSONObject(sampleJSON, "id", newId);
  expect(constains_Id).toBeFalsy();
});

test("should return true because json contains the value", () => {
  const newId = 3;
  const constains_Id = checkIfValueExistsInJSONObject(sampleJSON, "id", newId);
  expect(constains_Id).toBeTruthy();
});

test("should return 3", () => {
  const json_length = checkLengthOfJSON(sampleJSON);
  expect(json_length).toBe(3);
});

test("should return 0", () => {
  const empty_json_string = "[]";
  const json_length = checkLengthOfJSON(empty_json_string);
  expect(json_length).toBe(0);
});
