import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity , Text, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';



const App = () => {
    const [recording, setRecording] = useState(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            setRecording(recording);
        } catch (error) {
            console.error('Failed to start recording', error);
        }
    };

    const stopRecording = async () => {
        if (!recording) return;
        try {
            await recording.stopAndUnloadAsync();
        } catch (error) {
            console.error('Failed to stop recording', error);
        }
    };

    const playSound = async () => {
        if (!recording) return;
        const { sound } = await recording.createNewLoadedSoundAsync();
        setSound(sound);
        setIsPlaying(true);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate(status => {
            if (status.didJustFinish) {
                setIsPlaying(false);
            }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.topWrapper}>
                <Image source={require('./assets/talkinSht.png')}  />
            </View>
            <TouchableOpacity onPress={playSound} onLongPress={startRecording} onPressOut={stopRecording}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('./assets/poop1.gif')}
                        style={styles.gif}
                    />
                    {isPlaying && (
                        <Image
                            source={require('./assets/poop_talking.gif')}
                            style={styles.secondGif}
                        />
                    )}
                </View>
            </TouchableOpacity>
            <Text style={styles.instructions}>
                Tap and hold to record.{'\n'}Tap to play recording.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    imageContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    gif: {
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    secondGif: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 2,
    },
    topWrapper: {
        flex: .3,
        width: '100%',
    },
    topStartImage: {
        borderWidth: 2,
        borderColor: 'black',
        width: '100%',
        height: '100%',
        resizeMode: "contain",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        alignContent: "flex-start",
        position: 'absolute',
        zIndex: 2,
    },
});

export default App;
