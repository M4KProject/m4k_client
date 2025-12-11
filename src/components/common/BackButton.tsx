import { ArrowLeftIcon } from 'lucide-react';
import { Button, ButtonProps } from './Button';

export const BackButton = (props: ButtonProps) => (
  <Button title="Back" icon={ArrowLeftIcon} color="secondary" {...props} />
);
