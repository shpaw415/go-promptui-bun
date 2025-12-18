export type TextProps = {
  Label: string;
  Default?: string;
  AllowEdit?: boolean;
  HideEntered?: boolean;
  IsConfirm?: boolean;
  IsVimMode?: boolean;
  validate?: (input: string) => string | null;
};
