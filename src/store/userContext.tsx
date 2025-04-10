import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// 1. Define the context shape
interface DialogContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  clearUser: () => void;
}

// 2. Create the context with default undefined
const DialogContext = createContext<DialogContextType | undefined>(undefined);

// 3. Props type for the provider
interface ContextProviderProps {
  children: ReactNode;
}

// 4. Provider component
function ContextProvider({ children }: ContextProviderProps) {
  const getInitialUser = (): string | null => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  };

  const [user, setUser] = useState<string | null>(getInitialUser());

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const clearUser = () => {
    setUser(null);
  };

  return (
    <DialogContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </DialogContext.Provider>
  );
}

// 5. Custom hook to consume the context
const useDialogContext = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within a ContextProvider");
  }
  return context;
};

export { useDialogContext, ContextProvider };
