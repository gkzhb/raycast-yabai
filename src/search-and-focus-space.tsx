/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Action, ActionPanel, Color, List, useNavigation } from "@raycast/api";
import { useExec } from "@raycast/utils";
import { defaultEnv, yabai } from "./constants";

// order labeled spaces and spaces that contains windows to the front
const getSortOrder = (item: any) => (item.label || item.windows.length ? 1 : 0);

export default function SpaceList() {
  const [windowId, setWindowId] = useState(null);
  const { pop } = useNavigation();
  const { isLoading, data } = useExec(yabai(), ["-m", "query", "--spaces"], {
    env: defaultEnv,
  });

  useExec(yabai(), windowId ? ["-m", "window", "--focus", windowId] : ["-v"], {
    env: defaultEnv,
  });

  const spaces = useMemo(() => {
    let ret: null | any[] = null;
    if (!data) {
      return ret;
    }
    try {
      ret = JSON.parse(data);
    } catch {}
    if (ret && Array.isArray(ret)) {
      ret.sort((a, b) => getSortOrder(b) - getSortOrder(a));
    }
    return ret;
  }, [data]);

  return (
    <List isLoading={isLoading}>
      {spaces?.map((item) => (
        <List.Item
          key={item.id}
          title={`${item.index}:\t${item.label || "-"}`}
          id={String(item.id)}
          accessories={[
            {
              text: {
                value: `${item.windows.length} windows`,
                color: item.windows.length ? Color.Green : Color.Orange,
              },
            },
          ]}
          actions={
            item.windows.length ? (
              <ActionPanel>
                <Action
                  title="Focus space"
                  shortcut={{ key: "enter", modifiers: ["ctrl"] }}
                  onAction={() => {
                    setWindowId(item.windows[0] ?? null);
                    pop();
                  }}
                />
              </ActionPanel>
            ) : undefined
          }
        />
      ))}
    </List>
  );
}
