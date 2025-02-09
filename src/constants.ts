import { getPreferenceValues } from "@raycast/api";
import { userInfo } from "os";

export const yabai = () => {
  const preferences = getPreferenceValues<Preferences>();
  const yabaiPath: string = preferences.yabaiPath;
  return yabaiPath;
};
export const defaultEnv = { USER: userInfo().username };
