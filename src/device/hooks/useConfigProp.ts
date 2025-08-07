import { useAsyncEffect } from "@common/hooks";
import { m4k, M4kConfig } from "@common/m4k";
import { useState } from "react";

export const useConfigProp = <K extends keyof M4kConfig, V extends M4kConfig[K]>(prop: K): [V|undefined, (value: V) => Promise<void>] => {
  const [value, setValue] = useState<V|undefined>(undefined);
  
  useAsyncEffect(async () => {
    setValue(await m4k.get(prop));
  }, [prop]);

  const set = async (next: V) => {
    setValue(next);
    await m4k.set(prop, next);
    setValue(await m4k.get(prop));
  }

  return [ value, set ];
}
