export interface ConstraintsErrosData {
  [key: string]: {
    message: string;
    regexFilterParam?: string;
  };
}

export interface MessageModel {
  [key: Uppercase<string>]: Capitalize<string>;
}
