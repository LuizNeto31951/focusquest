export interface DateTimeFieldProps {
  label?: string;
  value?: string;
  onChange: (iso: string | undefined) => void;
  helperText?: string;
  errorText?: string;
  mode?: 'date' | 'time' | 'datetime';
  placeholder?: string;
}
