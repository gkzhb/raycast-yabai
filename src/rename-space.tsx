import { useState } from "react";
import { Action, ActionPanel, List, useNavigation } from "@raycast/api";
import { useExec } from "@raycast/utils";
import { defaultEnv, yabai } from "./constants";

export default function RenameSpace() {
  const [input, setInput] = useState("");
  const [rename, setRename] = useState<{ name: string } | null>(null);
  const { pop } = useNavigation();

  useExec(yabai, rename ? ["-m", "space", "--label", rename.name] : ["-v"], {
    env: defaultEnv,
  });

  return (
    <List
      searchBarPlaceholder="Rename yabai space label"
      onSearchTextChange={(text) => setInput(text)}
      actions={
        <ActionPanel>
          <Action
            title={"Rename space"}
            shortcut={{ key: "enter", modifiers: ["ctrl"] }}
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
