export type ResultType<T> =
  | {
      result: T;
      error?: undefined;
    }
  | {
      error: string;
      result?: undefined;
    };

export enum rune {
  CharLineStart = 1,
  CharBackward = 2,
  CharInterrupt = 3,
  CharDelete = 4,
  CharLineEnd = 5,
  CharForward = 6,
  CharBell = 7,
  CharCtrlH = 8,
  CharTab = 9,
  CharCtrlJ = 10,
  CharKill = 11,
  CharCtrlL = 12,
  CharEnter = 13,
  CharNext = 14,
  CharPrev = 16,
  CharBckSearch = 18,
  CharFwdSearch = 19,
  CharTranspose = 20,
  CharCtrlU = 21,
  CharCtrlW = 23,
  CharCtrlY = 25,
  CharCtrlZ = 26,
  CharEsc = 27,
  CharEscapeEx = 91,
  CharBackspace = 127,
}
