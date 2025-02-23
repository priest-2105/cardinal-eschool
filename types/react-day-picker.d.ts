import "react-day-picker";

declare module "react-day-picker" {
  export interface CustomComponents {
    IconLeft?: React.FC;
    IconRight?: React.FC;
  }
}
