import { ArrowLeft } from 'lucide-react';
import { Button, ButtonProps } from './Button';

export const BackButton = (props: ButtonProps) => (
  <Button title="Back" icon={<ArrowLeft />} color="secondary" {...props} />
);
