"use client"

import type React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Animated,
  Vibration,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "expo-router"

const { width, height } = Dimensions.get("window")
const ICON_SIZE = 65
const APPS_PER_ROW = 4

interface AppIconProps {
  name: string
  icon: string
  color: string
  onPress?: () => void
  style?: any
}

const AppIcon: React.FC<AppIconProps> = ({ name, icon, color, onPress, style }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current
  const [isPressed, setIsPressed] = useState(false)

  const handlePressIn = () => {
    setIsPressed(true)
    Vibration.vibrate(50)
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    setIsPressed(false)
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  const handlePress = () => {
    Alert.alert(`Opening ${name}`, `Launching ${name} application...`, [
      { text: "Cancel", style: "cancel" },
      { text: "Open", onPress: () => onPress?.() },
    ])
  }

  return (
    <Animated.View style={[styles.appContainer, style, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress} activeOpacity={0.8}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon as any} size={32} color="white" />
          {isPressed && <View style={styles.pressOverlay} />}
        </View>
        <Text style={styles.appName}>{name}</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const apps = [
  { name: "Phone", icon: "call", color: "#34C759" },
  { name: "Messages", icon: "chatbubble", color: "#007AFF" },
  { name: "Camera", icon: "camera", color: "#8E8E93" },
  { name: "Music", icon: "musical-notes", color: "#FF3B30" },
  { name: "Mail", icon: "mail", color: "#007AFF" },
  { name: "Gallery", icon: "images", color: "#5856D6" }, // Menambahkan ikon Galeri
  { name: "Settings", icon: "settings", color: "#8E8E93" },
  { name: "Maps", icon: "location", color: "#34C759" },
  { name: "Shopping", icon: "bag", color: "#FF9500" },
  { name: "Clock", icon: "time", color: "#000000" },
  { name: "Calculator", icon: "calculator", color: "#FF9500" },
  { name: "Photos", icon: "images", color: "#FF3B30" }, // Ini mungkin duplikat dengan Gallery, bisa dihapus jika Gallery menggantikan Photos
  { name: "Videos", icon: "videocam", color: "#5856D6" },
  { name: "Spotify", icon: "headset", color: "#1DB954" },
  { name: "Safari", icon: "globe", color: "#007AFF" },
  { name: "Notes", icon: "document-text", color: "#FFCC02" },
  { name: "Weather", icon: "partly-sunny", color: "#32D74B" },
  { name: "Fitness", icon: "fitness", color: "#FF2D92" },
  { name: "Wallet", icon: "wallet", color: "#000000" },
  { name: "News", icon: "newspaper", color: "#FF3B30" },
]

export default function HomeScreen() {
  const [currentPage, setCurrentPage] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const scrollViewRef = useRef<ScrollView>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const router = useRouter()

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const handleAppPress = (appName: string) => {
    console.log(`Opening ${appName}`)
    Vibration.vibrate(100)
    if (appName === "Music" || appName === "Spotify") {
      router.push("/music")
    } else if (appName === "Calculator") {
      router.push("/calculator")
    } else if (appName === "Gallery" || appName === "Photos") {
      // Menambahkan navigasi untuk Gallery
      router.push("/gallery")
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    Vibration.vibrate(50)
    scrollViewRef.current?.scrollTo({ x: page * width, animated: true })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.statusBarGradient}>
        <View style={styles.statusBar}>
          <Text style={styles.time}>{formatTime(currentTime)}</Text>
          <View style={styles.statusIcons}>
            <Ionicons name="cellular" size={16} color="white" />
            <Ionicons name="wifi" size={16} color="white" />
            <Ionicons name="battery-full" size={16} color="white" />
          </View>
        </View>
      </View>

      <ImageBackground source={require("../../assets/waguri.jpg")} style={styles.wallpaper} resizeMode="cover">
        <View style={styles.overlay}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const page = Math.round(event.nativeEvent.contentOffset.x / width)
                setCurrentPage(page)
              }}
              style={styles.pagerView}
              decelerationRate="fast"
            >
              {/* Slide 1 - Main Apps */}
              <View style={[styles.slideContainer, { width }]}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  <View style={styles.appsGrid}>
                    {apps.slice(0, 16).map((app, index) => (
                      <AppIcon
                        key={index}
                        name={app.name}
                        icon={app.icon}
                        color={app.color}
                        onPress={() => handleAppPress(app.name)}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Slide 2 - More Apps */}
              <View style={[styles.slideContainer, { width }]}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  <View style={styles.appsGrid}>
                    {apps.slice(16).map((app, index) => (
                      <AppIcon
                        key={index + 16}
                        name={app.name}
                        icon={app.icon}
                        color={app.color}
                        onPress={() => handleAppPress(app.name)}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Slide 3 - Enhanced Widgets */}
              <View style={[styles.slideContainer, { width }]}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  <View style={styles.widgetsContainer}>
                    {/* Greeting Widget */}
                    <View style={styles.greetingWidget}>
                      <Text style={styles.greetingText}>{getGreeting()}</Text>
                      <Text style={styles.userName}>Welcome back!</Text>
                    </View>

                    {/* Enhanced Clock Widget */}
                    <View style={styles.clockWidget}>
                      <Text style={styles.clockTime}>{formatTime(currentTime)}</Text>
                      <Text style={styles.clockDate}>{formatDate(currentTime)}</Text>
                      <View style={styles.clockDivider} />
                      <View style={styles.clockDetails}>
                        <Ionicons name="location" size={16} color="white" />
                        <Text style={styles.clockLocation}>Jakarta, Indonesia</Text>
                      </View>
                    </View>

                    {/* Enhanced Weather Widget */}
                    <View style={styles.weatherWidget}>
                      <View style={styles.weatherHeader}>
                        <Ionicons name="sunny" size={50} color="#FFD700" />
                        <View style={styles.weatherInfo}>
                          <Text style={styles.weatherTemp}>28°C</Text>
                          <Text style={styles.weatherCondition}>Sunny</Text>
                        </View>
                      </View>
                      <View style={styles.weatherDetails}>
                        <View style={styles.weatherDetail}>
                          <Ionicons name="water" size={16} color="white" />
                          <Text style={styles.weatherDetailText}>65%</Text>
                        </View>
                        <View style={styles.weatherDetail}>
                          <Ionicons name="eye" size={16} color="white" />
                          <Text style={styles.weatherDetailText}>10km</Text>
                        </View>
                        <View style={styles.weatherDetail}>
                          <Ionicons name="speedometer" size={16} color="white" />
                          <Text style={styles.weatherDetailText}>15km/h</Text>
                        </View>
                      </View>
                    </View>

                    {/* Enhanced Quick Apps Widget */}
                    <View style={styles.quickAppsWidget}>
                      <Text style={styles.widgetTitle}>Quick Access</Text>
                      <View style={styles.quickAppsRow}>
                        <AppIcon
                          name="Camera"
                          icon="camera"
                          color="#8E8E93"
                          onPress={() => handleAppPress("Camera")}
                          style={styles.quickAppIcon}
                        />
                        <AppIcon
                          name="Music"
                          icon="musical-notes"
                          color="#FF3B30"
                          onPress={() => handleAppPress("Music")}
                          style={styles.quickAppIcon}
                        />
                        <AppIcon
                          name="Settings"
                          icon="settings"
                          color="#8E8E93"
                          onPress={() => handleAppPress("Settings")}
                          style={styles.quickAppIcon}
                        />
                        <AppIcon
                          name="Maps"
                          icon="location"
                          color="#34C759"
                          onPress={() => handleAppPress("Maps")}
                          style={styles.quickAppIcon}
                        />
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </ScrollView>

            {/* Enhanced Page Indicators */}
            <View style={styles.pageIndicators}>
              {[0, 1, 2].map((page) => (
                <TouchableOpacity
                  key={page}
                  style={[styles.indicator, currentPage === page && styles.activeIndicator]}
                  onPress={() => handlePageChange(page)}
                >
                  {currentPage === page && <View style={styles.indicatorGlow} />}
                </TouchableOpacity>
              ))}
            </View>

            {/* Enhanced Dock */}
            <View style={styles.dock}>
              <AppIcon name="Phone" icon="call" color="#34C759" onPress={() => handleAppPress("Phone")} />
              <AppIcon name="Messages" icon="chatbubble" color="#007AFF" onPress={() => handleAppPress("Messages")} />
              <AppIcon name="Camera" icon="camera" color="#8E8E93" onPress={() => handleAppPress("Camera")} />
              <AppIcon name="Music" icon="musical-notes" color="#FF3B30" onPress={() => handleAppPress("Music")} />
            </View>
          </Animated.View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  statusBarGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  time: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  wallpaper: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  content: {
    flex: 1,
    paddingTop: 80,
  },
  pagerView: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 120,
  },
  appsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  appContainer: {
    width: (width - 40) / APPS_PER_ROW,
    alignItems: "center",
    marginBottom: 35,
  },
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  pressOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
  },
  appName: {
    color: "white",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  widgetsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 20,
  },
  greetingWidget: {
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  userName: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
    marginTop: 5,
  },
  clockWidget: {
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  clockTime: {
    fontSize: 56,
    fontWeight: "300",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  clockDate: {
    fontSize: 18,
    color: "white",
    opacity: 0.9,
    marginTop: 8,
    fontWeight: "500",
  },
  clockDivider: {
    width: 60,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: 15,
    borderRadius: 1,
  },
  clockDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clockLocation: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
  weatherWidget: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  weatherHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  weatherInfo: {
    marginLeft: 15,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
  },
  weatherCondition: {
    fontSize: 16,
    color: "white",
    opacity: 0.8,
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  weatherDetail: {
    alignItems: "center",
    gap: 5,
  },
  weatherDetailText: {
    fontSize: 12,
    color: "white",
    opacity: 0.8,
  },
  quickAppsWidget: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  widgetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  quickAppsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  quickAppIcon: {
    marginBottom: 0,
  },
  pageIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    gap: 12,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    position: "relative",
  },
  activeIndicator: {
    backgroundColor: "white",
    width: 24,
    height: 10,
    borderRadius: 5,
  },
  indicatorGlow: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 7,
  },
  dock: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 18,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
})
