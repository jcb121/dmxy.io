import { ChannelSimpleFunction } from "./fixtures";

export type ProfileState = Record<ChannelSimpleFunction, number>;
// this is just one simple state...
// better to have a target value...
export type GenericProfile = {
  name: string;
  id: string;
  state: Partial<ProfileState>;
  // value: Record<ChannelSimpleFunction, string>;
  globals: Partial<Record<ChannelSimpleFunction, string>>;
};

export type New_GenericProfile = {
  state: Partial<ProfileState>;
  targetFunction?: string;
  // value: Record<ChannelSimpleFunction, string>;
  globals: Partial<Record<ChannelSimpleFunction, string>>; // this is useless
};
