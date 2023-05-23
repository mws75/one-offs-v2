const RecentlyViewedJson = "{post_id: 1, post_id: 2, post_id: 3}";

export const checkIfValueExistsInJSONObject = (
  json: string,
  key: string,
  value: any
) => {
  const jsonObject = JSON.parse(json);
  const target_value = value;
  const value_exists = jsonObject.some(
    (obj: { [key: string]: number }) => obj[key] === target_value
  );

  return value_exists;
};

const deleteBottomRecordFromJSON = (json: string) => {
  const jsonObject = JSON.parse(json);
  jsonObject.pop();

  const upatedJsonObject = JSON.stringify(jsonObject);
  return upatedJsonObject;
};

const addRecordToJSON = (json: any, key: string, value: any) => {
  const jsonObject = JSON.parse(json);
  const newRecord = { [key]: value };
  jsonObject.unshift(newRecord);

  const updatedJsonObject = JSON.stringify(jsonObject);
  return updatedJsonObject;
};

export const checkLengthOfJSON = (json: string) => {
  const jsonObject = JSON.parse(json);
  return jsonObject.length;
};

export const udpatedRecentlyViewedJson = (
  json: string,
  key: string,
  new_value: number
) => {
  if (checkLengthOfJSON(json) < 3) {
    let updated_json = addRecordToJSON(json, "id", new_value);
    return updated_json;
  } else if (!checkIfValueExistsInJSONObject(json, key, new_value)) {
    let updated_json = deleteBottomRecordFromJSON(json);
    updated_json = addRecordToJSON(updated_json, "id", new_value);

    return updated_json;
  } else {
    return json;
  }
};
