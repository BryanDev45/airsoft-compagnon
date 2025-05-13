import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const ActionType = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type Action =
  | { type: typeof ActionType.ADD_TOAST; toast: ToasterToast }
  | { type: typeof ActionType.UPDATE_TOAST; toast: Partial<ToasterToast> & { id: string } }
  | { type: typeof ActionType.DISMISS_TOAST; toastId?: string }
  | { type: typeof ActionType.REMOVE_TOAST; toastId?: string };

interface State {
  toasts: ToasterToast[];
}

let memoryState: State = { toasts: [] };
const listeners: Array<(state: State) => void> = [];
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

let count = 0;
const genId = () => (++count % Number.MAX_SAFE_INTEGER).toString();

// --- Reducer ---
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case ActionType.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case ActionType.DISMISS_TOAST: {
      const toastId = action.toastId;
      if (toastId) {
        queueToastRemoval(toastId);
      } else {
        state.toasts.forEach((t) => queueToastRemoval(t.id));
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          !toastId || t.id === toastId ? { ...t, open: false } : t
        ),
      };
    }

    case ActionType.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// --- Dispatch ---
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

// --- Helpers ---
function queueToastRemoval(toastId: string) {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: ActionType.REMOVE_TOAST, toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

// --- Toast API ---
type Toast = Omit<ToasterToast, "id">;

function toast(props: Toast) {
  const id = genId();

  const dismiss = () => dispatch({ type: ActionType.DISMISS_TOAST, toastId: id });

  dispatch({
    type: ActionType.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => !open && dismiss(),
    },
  });

  const update = (updatedProps: Partial<ToasterToast>) =>
    dispatch({
      type: ActionType.UPDATE_TOAST,
      toast: { ...updatedProps, id },
    });

  return { id, dismiss, update };
}

// --- Hook ---
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  const dismiss = (toastId?: string) =>
    dispatch({ type: ActionType.DISMISS_TOAST, toastId });

  return {
    ...state,
    toast,
    dismiss,
  };
}

export { useToast, toast };
