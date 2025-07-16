import { Tabs } from "expo-router"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }, // Hide tab bar for home screen effect
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="music"
        options={{
          title: "Music Player",
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: "Calculator",
        }}
      />
      <Tabs.Screen
        name="gallery" // Menambahkan layar galeri baru
        options={{
          title: "Gallery",
        }}
      />
    </Tabs>
  )
}
