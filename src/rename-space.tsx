/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Action, ActionPanel, List, showHUD } from "@raycast/api";
import { runAppleScript, useExec } from "@raycast/utils";
import { defaultEnv, yabai } from "./constants";

const savedLabelPath = `/Users/${defaultEnv.USER}/.yabai-labels.json`;

export default function RenameSpace() {
  const [input, setInput] = useState("");
  // new label for the current space
  const [rename, setRename] = useState<{ name: string } | null>(null);
  // control when to persist space labels to file
  const [saveLabels, setSaveLabels] = useState(false);
  // json content to persist space labels
  const [savedJson, setSavedJson] = useState("");

  // rename space label
  useExec(yabai(), ["-m", "space", "--label", rename?.name ?? ""], {
    env: defaultEnv,
    execute: Boolean(rename),
    onData: () => {
      setSaveLabels(true);
      runAppleScript(`do shell script "open -gj 'swiftbar://refreshplugin?name=yabai'"`);
    },
    onError: () => {
      showHUD("Rename yabai space's label error");
    },
  });

  // query latest space labels
  const {
    data: spacesJson,
    error,
    isLoading,
  } = useExec(yabai(), ["-m", "query", "--spaces"], {
    env: defaultEnv,
    execute: saveLabels,
    onError: () => {
      showHUD("Query yabai spaces error");
    },
  });

  // persist labels to json file
  useExec("cat", [">", savedLabelPath], {
    input: savedJson,
    shell: true,
    execute: Boolean(savedJson),
    onData: () => {
      showHUD("Space renamed");
    },
    onError: () => {
      showHUD("Save yabai spaces' labels error");
    },
  });

  useEffect(() => {
    if (!saveLabels || error || !spacesJson || isLoading) {
      return;
    }
    try {
      // parse and filter spaces with non-empty labels
      const spaces = JSON.parse(spacesJson);
      const labeledSpaces = spaces
        .filter((item: Record<string, any>) => item.label?.length)
        .map((item: Record<string, any>) => ({
          index: item.index,
          label: item.label,
        }));

      setSavedJson(JSON.stringify(labeledSpaces));
    } catch {}
  }, [spacesJson, error, saveLabels, isLoading]);

  return (
    <List
      searchBarPlaceholder="Rename yabai space label"
      onSearchTextChange={(text) => setInput(text)}
      actions={
        <ActionPanel>
          <Action
            title="Rename Space Label"
            shortcut={{ key: "enter", modifiers: ["ctrl"] }}
            onAction={() => {
              setRename({ name: input });
            }}
          />
        </ActionPanel>
      }
    ></List>
  );
}
