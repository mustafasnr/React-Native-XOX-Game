import React, { useEffect, useRef } from "react";
import { Text, Animated } from "react-native";

export const Cell = ({ value }) => {
  const cellScale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (value) {
      Animated.timing(cellScale, {
        toValue: 1,
        duration: 125,
        useNativeDriver: true,
      }).start();
    }
    if (value === null) {
      cellScale.resetAnimation();
    }
  }, [value]);
  return (
    <Animated.View
      style={[
        {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        {
          transform: [{ scale: cellScale }],
        },
      ]}>
      <Text style={{ fontSize: 60, color: "black" }}>{value}</Text>
    </Animated.View>
  );
};
