const RecentlyViewedJson = "{post_id: 1, post_id: 2, post_id: 3}";

export const checkIfValueExistsInJSONObject = (
  json: string,
  key: string,
  value: any
) => {
  const jsonObject = JSON.parse(json);
  console.log(jsonObject);
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
  jsonObject.push(newRecord);

  const updatedJsonObject = JSON.stringify(jsonObject);

  console.log("updatedJsonObject");
  return updatedJsonObject;
};

export const udpatedRecentlyViewedJson = (
  json: string,
  key: string,
  new_value: number
) => {
  if (!checkIfValueExistsInJSONObject(json, key, new_value)) {
    let updated_json = deleteBottomRecordFromJSON(json);
    updated_json = addRecordToJSON(updated_json, "id", new_value);

    console.log(updated_json);

    return updated_json;
  } else {
    return json;
  }
};
