import { createContext, useContext } from "react";
import type { EditorContextType } from "./EditorProvider";

export const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditorContext = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("EditorContext not found");
  return ctx;
};
