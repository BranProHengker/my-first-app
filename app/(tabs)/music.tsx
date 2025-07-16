"use client"
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, ImageBackground } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Audio } from "expo-av" // Menggunakan expo-av sesuai permintaan Anda

interface Song {
  id: string
  title: string
  artist: string
  albumArt: string // URL untuk gambar album art
  uri: any // Menggunakan 'any' karena require() mengembalikan number untuk file lokal
}

const songs: Song[] = [
  {
    id: "1",
    title: "About You x Multo",
    artist: "The 1975 x The Cup Of Joe",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273111161611111111111111111", // Placeholder image
    uri: require("../../assets/about-you-x-multo.mp3"), // File audio lokal
  },
  {
    id: "2",
    title: "SoundHelix Song 2",
    artist: "SoundHelix",
    albumArt: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Album2",
    uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // URL audio placeholder
  },
  {
    id: "3",
    title: "SoundHelix Song 3",
    artist: "SoundHelix",
    albumArt: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Album3",
    uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", // URL audio placeholder
  },
]

export default function MusicPlayerScreen() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const router = useRouter()
  const currentSong = songs[currentSongIndex]

  const loadAndPlaySound = async (uri: any) => {
    // Menggunakan 'any' untuk uri
    if (sound) {
      await sound.unloadAsync()
    }
    console.log("Loading Sound:", uri)
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(uri, { shouldPlay: true }, onPlaybackStatusUpdate)
      setSound(newSound)
      setIsPlaying(true)
    } catch (error) {
      console.error("Error loading sound:", error)
      setIsPlaying(false) // Pastikan UI mencerminkan tidak ada pemutaran
    }
  }

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying)
      if (status.didJustFinish) {
        playNext()
      }
    } else if (status.error) {
      console.error(`Playback error: ${status.error}`)
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    loadAndPlaySound(currentSong.uri)
    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [currentSongIndex]) // Muat ulang suara saat lagu berubah

  const playPause = async () => {
    if (sound) {
      if (isPlaying) {
        console.log("Pausing Sound")
        await sound.pauseAsync()
      } else {
        console.log("Playing Sound")
        await sound.playAsync()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const playNext = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length
    setCurrentSongIndex(nextIndex)
    // isPlaying akan diatur oleh useEffect setelah memuat lagu baru
  }

  const playPrevious = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length
    setCurrentSongIndex(prevIndex)
    // isPlaying akan diatur oleh useEffect setelah memuat lagu baru
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <ImageBackground source={require("../../assets/about-you.jpg")} style={styles.background} resizeMode="cover">
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Music</Text>
            <View style={styles.placeholder} />
          </View>
          <View style={styles.playerContainer}>
            <Image source={{ uri: currentSong.albumArt }} style={styles.albumArt} />
            <Text style={styles.songTitle}>{currentSong.title}</Text>
            <Text style={styles.artistName}>{currentSong.artist}</Text>

            <View style={styles.controls}>
              <TouchableOpacity onPress={playPrevious} style={styles.controlButton}>
                <Ionicons name="play-skip-back" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={playPause} style={styles.playPauseButton}>
                <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={80} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={playNext} style={styles.controlButton}>
                <Ionicons name="play-skip-forward" size={40} color="white" />
              </TouchableOpacity>
            </View>

            {/* Footer Icons */}
            <View style={styles.footerIcons}>
              <Ionicons name="shuffle" size={24} color="white" style={styles.footerIcon} />
              <Ionicons name="repeat" size={24} color="white" style={styles.footerIcon} />
              <Ionicons name="share" size={24} color="white" style={styles.footerIcon} />
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  playerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  albumArt: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
  },
  songTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  artistName: {
    fontSize: 18,
    color: "#BBBBBB",
    marginBottom: 40,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  controlButton: {
    padding: 10,
  },
  playPauseButton: {
    padding: 10,
  },
  footerIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
    alignSelf: "center",
    marginTop: 40,
  },
  footerIcon: {
    opacity: 0.7,
  },
})
