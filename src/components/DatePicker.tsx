import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';

interface BasicDatePickerProps {
  label: string;
  color?: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}

export default function BasicDatePicker({ label, color, value, onChange }: BasicDatePickerProps) {
  const demoColor = (color: string) => {
    switch (color) {
      case 'success':
        return '#2e7d32';
      default:
        return 'primary.main';
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          sx={{
            '.css-vycme6-MuiPickersInputBase-root-MuiPickersOutlinedInput-root.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline': {
              borderColor: `${demoColor(color || 'primary')} !important`,
            },
            '.css-113d811-MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
              color: demoColor(color || 'primary'),
            },
            'label, input': {
              color: 'var(--foreground)',
            },
            'fieldset': {
              borderColor: 'var(--foreground)',
            },
            '.MuiInputBase-formControl:hover .MuiOutlinedInput-notchedOutline:hover': {
              borderColor: 'var(--foreground-transparent)',
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
