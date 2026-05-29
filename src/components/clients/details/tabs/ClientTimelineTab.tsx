"use client";

import React from "react";
import { motion } from "framer-motion";
import { RelationshipTimeline } from "../RelationshipTimeline";

export const ClientTimelineTab: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* We reuse the RelationshipTimeline but it could be expanded in the future */}
      <RelationshipTimeline />
    </motion.div>
  );
};
