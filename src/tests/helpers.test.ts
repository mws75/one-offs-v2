import {
  udpatedRecentlyViewedJson,
  checkIfValueExistsInJSONObject,
  checkLengthOfJSON,
  convertJSONtoArray,
} from "../server/helpers/dataHelper";

const sampleJSON = `[
        {"id": 6, "title": "post6"},
        {"id": 2, "title": "post2"},
        {"id": 3, "title": "post3"}
    ]
    `;

test("should return a json string that contains the newJsonObj", () => {
  const newJsonObj = `{"id":4,"title":"post4"}`;
  const updatedJson = udpatedRecentlyViewedJson(sampleJSON, newJsonObj);
  expect(updatedJson).toContain(newJsonObj);
});

test("should return false because json does not contain the newJsonObj", () => {
  const newJsonObj = `{"id": 4, "title": "post4"}`;
  const constains_Id = checkIfValueExistsInJSONObject(sampleJSON, newJsonObj);
  expect(constains_Id).toBeFalsy();
});

test("should return true because json contains the value", () => {
  const newJsonObj = `{"id": 3, "title": "post3"}`;
  const constains_Id = checkIfValueExistsInJSONObject(sampleJSON, newJsonObj);
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

test("should return array of integers", () => {
  const jsonString = '[{ "id": 0 }, { "id": 56 }, { "id": 20 }]';
  const myArray = convertJSONtoArray(jsonString, "id");
  expect(myArray).toEqual([0, 56, 20]);
});
