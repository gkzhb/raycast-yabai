/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from "react";
import { Action, ActionPanel, Icon, Keyboard, List } from "@raycast/api";
import { useExec } from "@raycast/utils";

const yabai = "/opt/homebrew/bin/yabai";
export default function WindowList() {
  const [windowId, setWindowId] = useState(null);
  const { isLoading, data } = useExec(yabai, ["-m", "query", "--windows"], {
    env: { USER: "bytedance" },
  });

  useExec(yabai, windowId ? ["-m", "window", "--focus", windowId] : ["-v"], {
    env: { USER: "bytedance" },
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
          title={`${item.space} | ${item.app} | ${item.title || "-"}`}
          id={String(item.id)}
          accessories={[{ tag: item.id ?? "-", text: item.id }]}
          actions={
            <ActionPanel>
              <Action
                title="Focus window"
                shortcut={{ key: "enter", modifiers: ["ctrl"] }}
                onAction={() => {
                  console.log("trigger", item.id);
                  setWindowId(item.id);
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
