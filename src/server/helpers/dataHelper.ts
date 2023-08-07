export const checkIfValueExistsInJSONObject = (
  json: string,
  new_object: string
) => {
  const jsonObject = JSON.parse(json);
  const target_value = JSON.parse(new_object);

  const exists: boolean = jsonObject.some(
    (obj: { id: number; name: string }) =>
      obj.id === target_value.id && obj.name === target_value.name
  );

  return exists;
};

const deleteBottomRecordFromJSON = (json: string) => {
  const jsonObject = JSON.parse(json);
  jsonObject.pop();

  const upatedJsonObject = JSON.stringify(jsonObject);
  return upatedJsonObject;
};

const addRecordToJSON = (json: any, new_object: any) => {
  const jsonObject = JSON.parse(json);
  const new_object_json = JSON.parse(new_object);
  jsonObject.unshift(new_object_json);

  const updatedJsonObject = JSON.stringify(jsonObject);
  return updatedJsonObject;
};

export const checkLengthOfJSON = (json: string) => {
  const jsonObject = JSON.parse(json);
  return jsonObject.length;
};

export const udpatedRecentlyViewedJson = (json: string, new_object: string) => {
  if (checkLengthOfJSON(json) < 3) {
    let updated_json = addRecordToJSON(json, new_object);
    return updated_json;
  } else if (!checkIfValueExistsInJSONObject(json, new_object)) {
    let updated_json = deleteBottomRecordFromJSON(json);
    updated_json = addRecordToJSON(updated_json, new_object);

    return updated_json;
  } else {
    return json;
  }
};

export const convertJSONtoArray = (jsonString: string, key: string): any[] => {
  let parsedObject: any;

  try {
    parsedObject = JSON.parse(jsonString);
  } catch (error) {
    throw new Error("Invalid JSON string provided.");
  }

  if (!Array.isArray(parsedObject)) {
    throw new Error("Parsed JSON is not an array.");
  }

  return parsedObject.map((obj) => {
    if (obj.hasOwnProperty(key)) {
      return obj[key];
    } else {
      throw new Error(`Key "${key}" not found in one or more objects.`);
    }
  });
};
