import { useState } from "react";
import { Action, ActionPanel, List, useNavigation } from "@raycast/api";
import { useExec } from "@raycast/utils";
import { yabai } from "./constants";

export default function RenameSpace() {
  const [input, setInput] = useState("");
  const [rename, setRename] = useState<{ name: string } | null>(null);
  const { pop } = useNavigation();

  useExec(yabai, rename ? ["-m", "space", "--label", rename.name] : ["-v"], {
    env: { USER: "bytedance" },
  });

  return (
    <List
      onSearchTextChange={(text) => setInput(text)}
      actions={
        <ActionPanel>
          <Action
            title={"Rename"}
            onAction={() => {
              setRename({ name: input });
              pop();
            }}
          />
        </ActionPanel>
      }
    ></List>
  );
}
