"use client";
import { useChatSessionQueries } from "@/services/sessions/queries";
import { createSessionsStore } from "@/store/sessions/store";
import {
  TChatMessage,
  TChatSession,
  TSessionsContext,
  TSessionsProvider,
} from "@/types";
import { usePathname, useRouter } from "next/navigation";
import {
  FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const SessionContext = createContext<TSessionsContext | undefined>(
  undefined,
);

export const SessionsProvider: FC<TSessionsProvider> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const store = useMemo(() => createSessionsStore(), []);
  const [sessions, setSessions] = useState<TChatSession[]>([]);
  const activeSessionId = store((state) => state.activeSessionId);
  const setActiveSessionId = store((state) => state.setActiveSessionId);
  const useChatSessionQueriesProps = useChatSessionQueries();
  const { sessionsQuery, createNewSessionMutation, addMessageMutation } =
    useChatSessionQueriesProps;

  useEffect(() => {
    if (sessionsQuery?.data) {
      setSessions(sessionsQuery.data);
    }
  }, [sessionsQuery?.data]);

  const createSession = async (props: { redirect?: boolean }) => {
    const { redirect } = props;
    try {
      const data = await createNewSessionMutation.mutateAsync(undefined);
      if (redirect && data) {
        setActiveSessionId(data.id);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  useEffect(() => {
    if (!activeSessionId && pathname === "/chat") {
      createSession({ redirect: true });
    }
  }, [activeSessionId, pathname]);

  const addMessage = async (parentId: string, message: TChatMessage) => {
    try {
      await addMessageMutation.mutateAsync({
        parentId,
        message,
      });
    } catch (error) {
      console.error("Failed to add message:", error);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        activeSessionId,
        setActiveSessionId,
        isAllSessionLoading: sessionsQuery.isLoading,
        createSession,
        refetchSessions: sessionsQuery.refetch,
        addMessage,
        ...useChatSessionQueriesProps,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessions = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessions must be used within a SessionsProvider");
  }
  return context;
};
