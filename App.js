import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Animated,
} from "react-native";
import { Cell } from "./components/Cell";

function App() {
  const { width } = Dimensions.get("screen");
  const player = useRef("X");
  const appScale = useRef(new Animated.Value(0)).current;
  const endScale = useRef(new Animated.Value(0)).current;

  const [board, setBoard] = useState(Array(9).fill(null));
  const cBoard = useRef(Array(9).fill(null));
  const [isGameEnd, setGameEnd] = useState(false);
  const [scores, setScores] = useState([0, 0]);
  const [endText, setEndText] = useState("-"); // X Win , O Win

  useEffect(() => {
    if (isGameEnd) {
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      sleep(250).then(() => {
        Animated.timing(appScale, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
        Animated.timing(endScale, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    } else {
      Animated.timing(appScale, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
      Animated.timing(endScale, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isGameEnd]);
  const move = async index => {
    if (board[index] === null && !isGameEnd) {
      const newBoard = [...board];
      newBoard[index] = player.current;
      setBoard(newBoard);
      cBoard.current = newBoard;
      player.current = player.current === "X" ? "O" : "X";
      gameCheck(cBoard.current);
    }
  };
  const gameCheck = board => {
    const endIndices = [
      // Horizontal win patterns
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Vertical win patterns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonal win patterns
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of endIndices) {
      const [a, b, c] = pattern;
      if (board[a] != null && board[a] === board[b] && board[a] === board[c]) {
        if (board[a] === "X") {
          setEndText("X Win");
          setScores([++scores[0], scores[1]]);
        }
        if (board[a] === "O") {
          setEndText("O Win");
          setScores([scores[0], ++scores[1]]);
        }
        setGameEnd(true);
        return;
      }
    }

    const isBoardFull = board.every(cell => cell !== null);
    if (isBoardFull) {
      setEndText("Draw");
      setGameEnd(true);
      return;
    }
  };

  const restartGame = () => {
    player.current = "X";
    setBoard(Array(9).fill(null));
    cBoard.current = Array(9).fill(null);
    setGameEnd(false);
    setScores([0, 0]);
    setEndText("-");
  };
  const playGame = () => {
    player.current = "X";
    setBoard(Array(9).fill(null));
    cBoard.current = Array(9).fill(null);
    setGameEnd(false);
    setEndText("-");
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.appContainer,
          {
            display: isGameEnd ? "none" : "flex",
            width: width * 0.9,
            height: width * 0.9,
            transform: [{ scale: appScale }],
          },
        ]}>
        <View style={styles.row}>
          <Pressable
            onPress={() => {
              move(0);
            }}
            style={[styles.col, { borderTopLeftRadius: 8 }]}>
            <Cell value={board[0]} />
          </Pressable>
          <Pressable
            onPress={() => {
              move(1);
            }}
            style={styles.col}>
            <Cell value={board[1]} />
          </Pressable>
          <Pressable
            onPress={() => {
              move(2);
            }}
            style={[styles.col, { borderTopRightRadius: 8 }]}>
            <Cell value={board[2]} />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            onPress={() => {
              move(3);
            }}
            style={styles.col}>
            <Cell value={board[3]} />
          </Pressable>
          <Pressable
            onPress={() => {
              move(4);
            }}
            style={styles.col}>
            <Cell value={board[4]} />
          </Pressable>
          <Pressable
            onPress={() => {
              move(5);
            }}
            style={styles.col}>
            <Cell value={board[5]} />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            onPress={() => {
              move(6);
            }}
            style={[styles.col, { borderBottomLeftRadius: 8 }]}>
            <Cell value={board[6]} />
          </Pressable>
          <Pressable
            onPress={() => {
              move(7);
            }}
            style={styles.col}>
            <Cell value={board[7]} />
          </Pressable>
          <Pressable
            onPress={() => {
              move(8);
            }}
            style={[styles.col, { borderBottomRightRadius: 8 }]}>
            <Cell value={board[8]} />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.endContainer,
          {
            display: isGameEnd ? "flex" : "none",
            width: width * 0.9,
            height: width * 0.9,
            transform: [{ scale: endScale }],
          },
        ]}>
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "space-around",
          }}>
          <View style={styles.textContainer}>
            <Text style={{ fontSize: 64, color: "white" }}>{endText}</Text>
          </View>
          <View style={styles.infoContainer}>
            <View>
              <Text style={{ fontSize: 50, color: "white" }}>X</Text>
              <Text style={{ fontSize: 50, color: "white" }}>{scores[0]}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 50, color: "white" }}>-</Text>
            </View>
            <View>
              <Text style={{ fontSize: 50, color: "white" }}>O</Text>
              <Text style={{ fontSize: 50, color: "white" }}>{scores[1]}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
              onPress={() => {
                playGame();
              }}>
              <Text style={{ fontSize: 24, color: "white" }}>Yeni Oyun</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                restartGame();
              }}>
              <Text style={{ fontSize: 24, color: "white" }}>Tekrar</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  endContainer: {
    alignSelf: "center",
    backgroundColor: "black",
    flexDirection: "col",
    borderRadius: 15,
    borderColor: "white",
    borderWidth: 1,
  },
  infoContainer: {
    width: "100%",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  button: {
    borderWidth: 1.75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderColor: "white",
    width: 150,
    height: 50,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  appContainer: {
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 9,
    backgroundColor: "black",
    justifyContent: "space-between",
    gap: 1,
    zIndex: 2,
  },
  row: {
    borderColor: "black",
    gap: 1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  col: {
    width: "100%",
    backgroundColor: "white",
    borderColor: "black",
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 60,
    color: "black",
  },
});

export default App;
