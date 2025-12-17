import { Field } from "@/components/fields/Field";
import { Css } from "fluxio";
import { useProp } from "./BField";
import { Button, ButtonProps } from "@/components/common/Button";
import { useBEditController } from "../useBEditController";
import { MediaIcon, PlayerIcon, TextIcon, WebIcon, ZoneIcon } from '../../BController';

const c = Css('BFieldType', {});

const BTypeButton = ({ value, ...props }: { value: string } & ButtonProps) => {
  const [type, setType] = useProp('t');

  const selected = type === value;

  const handle = () => {
    if (selected) return;
    setType(value);
  }

  return (
    <Button {...props} selected={selected} onClick={handle} />
  )
}

export const BFieldType = () => {
  const controller = useBEditController();
  const entries = Object.entries(controller.registry||{}).filter(e => e[0] !== 'root');
  const types = entries.map(([type, config]) => [type, config.icon] as [string, any]);

  return (
    <Field {...c('')} name="type">
      <BTypeButton value="zone" icon={ZoneIcon} />
      <BTypeButton value="player" icon={PlayerIcon} />
      <BTypeButton value="media" icon={MediaIcon} />
      <BTypeButton value="text" icon={TextIcon} />
      <BTypeButton value="web" icon={WebIcon} />
    </Field>
  )
}
