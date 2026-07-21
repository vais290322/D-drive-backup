import { createContext, useContext } from "react";

export const AnnouncementContext = createContext(undefined);

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error(
      "useAnnouncements must be used within an AnnouncementProvider",
    );
  }
  return context;
};
