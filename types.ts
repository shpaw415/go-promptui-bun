export type TextProps = {
  label: string;
  default?: string;
  allow_edit?: boolean;
  hide_entered?: boolean;
  is_confirm?: boolean;
  is_vim_mode?: boolean;
  validate?: (input: string) => string | null;
};

export type SelectProps = {
  label: string;
  items: string[];
  default_index?: number;
  is_vim_mode?: boolean;
};
