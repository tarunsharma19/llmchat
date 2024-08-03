import { useScrollToBottom } from "@/hooks";
import { ArrowDown02Icon } from "@hugeicons/react";
import { motion } from "framer-motion";
import { FC } from "react";
import { Button } from "../ui/button";

export type TScrollToBottomButton = {
  show: boolean;
};

export const ScrollToBottomButton: FC<TScrollToBottomButton> = ({ show }) => {
  const { scrollToBottom, showButton } = useScrollToBottom();

  if (!showButton || !show) return null;

  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <Button
        onClick={scrollToBottom}
        size="iconSm"
        variant="outlined"
        rounded="full"
      >
        <ArrowDown02Icon size={16} strokeWidth="2" />
      </Button>
    </motion.span>
  );
};