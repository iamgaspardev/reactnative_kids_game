import React, { useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const GameLevelCard = ({ level, onPress }) => {
    const imageSources = {
        1: require('../rsc/images/1.png'),
        2: require('../rsc/images/2.png'),
        3: require('../rsc/images/1.png'),
        4: require('../rsc/images/2.png'),
    };
    return (
        <TouchableOpacity onPress={onPress}>
            <ImageBackground source={imageSources[level]} style={styles.locks}>
                <Text style={styles.levelText}>Hatua {level}</Text>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const GameLevel = () => {
    const navigation = useNavigation();
    const progress = 40;

    const navigateToGameScreen = (level) => {
        navigation.navigate('GameScreen', { level });
      };
    const startVibrations = () => {
        let delay = 0;

        levelsData.forEach((item, index) => {
            setTimeout(() => {
                if (vibrationRefs[index]) {
                    vibrationRefs[index].swing(800);
                }
            }, delay);

            delay += 1000;
        },);
    };

    useEffect(() => {
        startVibrations();
        Orientation.lockToLandscape();
      }, []);

    const levelsData = [1, 2, 3, 4];

    const vibrationRefs = levelsData.map(() => React.createRef());

    return (
        <ImageBackground
            source={require('../rsc/images/App-bg-1.png')}
            style={styles.backgroundImage}
        >
            <TouchableOpacity style={styles.backButton} onPress={() => {}}>
                <Icon name="caret-back-outline" size={24} color="#F20EB2" />
            </TouchableOpacity>
            <AnimatedCircularProgress
        size={40} 
        width={7}
        fill={progress}
        tintColor="#7918F0"
        onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor="#FFFFFF"
        style={styles.marks}
      >
        {(fill) => (
          <View>
            <Text style={{ fontSize: 10, color: '#FFFFFF' }}>{`${Math.round(fill)}%`}</Text>
          </View>
        )}
      </AnimatedCircularProgress>
            <View style={styles.container}>
                <Text style={styles.guessText}>Chagua Hatua ili Kucheza</Text>

                <FlatList
                    data={levelsData}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item, index }) => (
                        <Animatable.View
                            iterationCount="infinite"
                            ref={(ref) => (vibrationRefs[index] = ref)}
                            style={styles.cardContainer}
                        >
                            <GameLevelCard
                                level={item}
                                onPress={() => navigateToGameScreen(item)}
                            />
                        </Animatable.View>
                    )}
                    ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                />
            </View>
        </ImageBackground>

    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    locks: {
        width: 150,
        height: 200
    },
    guessText: {
        fontSize: 20,
        color: "#fff",
        fontWeight: '900'
    },
    levelText: {
        fontSize: 20,
        color: '#fff',
        position: 'absolute',
        fontWeight: '900',
        left: 0,
        right: 0,
        top: 30,
        bottom: 0,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontStyle: 'italic',
    },
    container: {
        flex: 1,
        paddingTop: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: 150,
        height: 200,
        margin: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    circularProgress: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#ffffff',
        borderRadius: 50,
        padding: 10,
    },
    marks: {
        position: 'absolute',
        top: 20,
        right: 20,
        borderRadius: 50,
    },
},
);

export default GameLevel;
