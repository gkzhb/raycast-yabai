/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Action, ActionPanel, List, useNavigation } from "@raycast/api";
import { useExec } from "@raycast/utils";
import { defaultEnv, yabai } from "./constants";

export default function WindowList() {
  const [windowId, setWindowId] = useState(null);
  const { pop } = useNavigation();
  const { isLoading, data } = useExec(yabai, ["-m", "query", "--windows"], {
    env: defaultEnv,
  });

  useExec(yabai, windowId ? ["-m", "window", "--focus", windowId] : ["-v"], {
    env: defaultEnv,
  });

  const windows = useMemo(() => {
    let ret: null | any[] = null;
    if (!data) {
      return ret;
    }
    try {
      ret = JSON.parse(data);
    } catch {}
    return ret;
  }, [data]);

  return (
    <List isLoading={isLoading}>
      {windows?.map((item) => (
        <List.Item
          key={item.id}
          title={`${item.app} | ${item.title || "-"}`}
          keywords={[String(item.space)]}
          id={String(item.id)}
          accessories={[{ text: String(item.space) }]}
          actions={
            <ActionPanel>
              <Action
                title="Focus window"
                shortcut={{ key: "enter", modifiers: ["ctrl"] }}
                onAction={() => {
                  setWindowId(item.id);
                  pop();
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
