import React from "react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";

interface PulserProps {
  value: number | string;
  keyName: string;
  className?: string;
}

export const Pulser: React.FC<PulserProps> = observer(
  ({ value, keyName, className }) => {
    return (
      <motion.span
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 0.5, times: [0, 0.3, 1] }}
        key={keyName}
        className={className}
      >
        {value}
      </motion.span>
    );
  }
);
