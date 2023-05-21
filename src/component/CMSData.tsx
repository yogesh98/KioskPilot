import { FC } from "react";

const mapToDBCollections = {
  kiosk: "kiosk",
  module: "module",
  assign: "kiosk_x_modules",
};

const CMSData: FC<{ type: string }> = ({ type }) => {
  return <div>{type}</div>;
};

export default CMSData;
