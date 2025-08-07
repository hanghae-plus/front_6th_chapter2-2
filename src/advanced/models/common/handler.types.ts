export interface InputChangeHandler {
  (e: React.ChangeEvent<HTMLInputElement>): void;
}

export interface SelectChangeHandler {
  (e: React.ChangeEvent<HTMLSelectElement>): void;
}

export interface FormSubmitHandler {
  (e: React.FormEvent): void;
}

export interface BlurHandler {
  (e: React.ChangeEvent<HTMLInputElement>): void;
}

export interface ClickHandler {
  (e: React.MouseEvent<HTMLButtonElement>): void;
}
