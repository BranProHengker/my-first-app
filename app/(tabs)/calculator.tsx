"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

export default function CalculatorScreen() {
  const router = useRouter()
  const [display, setDisplay] = useState("0")
  const [currentValue, setCurrentValue] = useState("")
  const [operator, setOperator] = useState<string | null>(null)
  const [previousValue, setPreviousValue] = useState<string | null>(null)
  const [isResult, setIsResult] = useState(false) // Flag to indicate if current display is a result

  const handlePress = (value: string) => {
    if (isResult && (value === "+" || value === "-" || value === "*" || value === "/")) {
      // If it's a result and an operator is pressed, use the result as the first operand
      setPreviousValue(display)
      setOperator(value)
      setCurrentValue("")
      setIsResult(false)
    } else if (isResult) {
      // If it's a result and a number is pressed, start a new calculation
      setDisplay(value)
      setCurrentValue(value)
      setOperator(null)
      setPreviousValue(null)
      setIsResult(false)
    } else if (value === "C") {
      setDisplay("0")
      setCurrentValue("")
      setOperator(null)
      setPreviousValue(null)
      setIsResult(false)
    } else if (value === "=") {
      if (previousValue !== null && operator !== null && currentValue !== "") {
        try {
          const expression = `${previousValue}${operator}${currentValue}`
          // Using eval() for simplicity, but be cautious in production apps due to security risks.
          // For a real app, consider a math expression parser library.
          const result = eval(expression).toString()
          setDisplay(result)
          setCurrentValue(result) // Set result as current value for chained operations
          setOperator(null)
          setPreviousValue(null)
          setIsResult(true)
        } catch (e) {
          setDisplay("Error")
          setCurrentValue("")
          setOperator(null)
          setPreviousValue(null)
          setIsResult(true)
        }
      }
    } else if (value === "+" || value === "-" || value === "*" || value === "/") {
      if (currentValue !== "") {
        if (previousValue === null) {
          setPreviousValue(currentValue)
        } else if (operator !== null) {
          // Chain operations: calculate previous result
          try {
            const expression = `${previousValue}${operator}${currentValue}`
            const intermediateResult = eval(expression).toString()
            setPreviousValue(intermediateResult)
            setDisplay(intermediateResult)
          } catch (e) {
            setDisplay("Error")
            setCurrentValue("")
            setOperator(null)
            setPreviousValue(null)
            setIsResult(true)
            return
          }
        }
        setOperator(value)
        setCurrentValue("")
        setIsResult(false)
      }
    } else if (value === ".") {
      if (!currentValue.includes(".")) {
        const newValue = currentValue === "" ? "0." : currentValue + value
        setCurrentValue(newValue)
        setDisplay(newValue)
      }
    } else {
      const newValue = currentValue === "0" ? value : currentValue + value
      setCurrentValue(newValue)
      setDisplay(newValue)
    }
  }

  const renderButton = (value: string, type: "number" | "operator" | "clear" | "equals") => {
    let buttonStyle = styles.button
    let textStyle = styles.buttonText

    if (type === "operator") {
      buttonStyle = { ...styles.button, ...styles.operatorButton }
      textStyle = styles.operatorButtonText
    } else if (type === "clear") {
      buttonStyle = { ...styles.button, ...styles.clearButton }
      textStyle = styles.clearButtonText
    } else if (type === "equals") {
      buttonStyle = { ...styles.button, ...styles.equalsButton }
      textStyle = styles.equalsButtonText
    } else if (value === "0") {
      buttonStyle = { ...styles.button, ...styles.zeroButton }
    }

    return (
      <TouchableOpacity key={value} style={buttonStyle} onPress={() => handlePress(value)}>
        <Text style={textStyle}>{value}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calculator</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.calculatorBody}>
        <View style={styles.displayContainer}>
          <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
            {display}
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.row}>
            {renderButton("C", "clear")}
            {renderButton("/", "operator")}
          </View>
          <View style={styles.row}>
            {renderButton("7", "number")}
            {renderButton("8", "number")}
            {renderButton("9", "number")}
            {renderButton("*", "operator")}
          </View>
          <View style={styles.row}>
            {renderButton("4", "number")}
            {renderButton("5", "number")}
            {renderButton("6", "number")}
            {renderButton("-", "operator")}
          </View>
          <View style={styles.row}>
            {renderButton("1", "number")}
            {renderButton("2", "number")}
            {renderButton("3", "number")}
            {renderButton("+", "operator")}
          </View>
          <View style={styles.row}>
            {renderButton("0", "number")}
            {renderButton(".", "number")}
            {renderButton("=", "equals")}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  calculatorBody: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
  displayContainer: {
    padding: 20,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    minHeight: 100,
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    marginBottom: 10,
  },
  displayText: {
    color: "white",
    fontSize: 60,
    fontWeight: "300",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "space-around",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333333",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 30,
  },
  operatorButton: {
    backgroundColor: "#FF9500", // Orange for operators
  },
  operatorButtonText: {
    color: "white",
  },
  clearButton: {
    backgroundColor: "#A5A5A5", // Light gray for clear
    width: "45%", // Make C button wider
    borderRadius: 35,
  },
  clearButtonText: {
    color: "black",
  },
  equalsButton: {
    backgroundColor: "#FF9500", // Orange for equals
    width: "45%", // Make equals button wider
    borderRadius: 35,
  },
  equalsButtonText: {
    color: "white",
  },
  zeroButton: {
    width: "45%", // Make 0 button wider
    borderRadius: 35,
  },
})
