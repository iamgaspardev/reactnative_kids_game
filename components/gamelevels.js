import React, { useEffect ,useState} from 'react';
import Orientation from 'react-native-orientation-locker';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground, Alert, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import service from './database/service';
// import Service from './database/service';

const GameLevelCard = ({ level, onPress }) => {
  
    const imageSources = {
        1: require('../rsc/images/open1.png'),
        2: require('../rsc/images/2.png'),
        3: require('../rsc/images/1.png'),
        4: require('../rsc/images/2.png'),
    };
    const openImage = {
        1: require('../rsc/images/open1.png'),
        2: require('../rsc/images/open2.png'),
        3: require('../rsc/images/open1.png'),
        4: require('../rsc/images/open2.png'),
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
    const [lastScore, setLastScore] = useState(0);
    const [showModal, setShowModal] = useState(false);
    // const navigateToGameScreen = (level) => {
    //     navigation.navigate('GameScreen', { level });
    //   };
    const navigateToGameScreen = async (level) => {
        try {
          const canPlay = await service.canPlayLevel(level);
    
          if (canPlay) {
            navigation.navigate('GameScreen', { level });
          } else {
            setShowModal(true);
            console.log('Cannot play this level. Highest score not reached.');
          }
        } catch (error) {
          console.error('Error checking if level can be played:', error);
        }
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

    const initializeDatabaseAndFetchLastScore = async () => {
      try {
        await service.initializeDatabase();
        const lastScoreValue = await service.getLastHighestScore();
        setLastScore(lastScoreValue);
      } catch (error) {
        console.error('Error initializing database and fetching last score:', error);
      }
    };
  
    useEffect(() => {
      startVibrations();
      Orientation.lockToLandscape();
      initializeDatabaseAndFetchLastScore();
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
        fill={lastScore}
        tintColor="#7918F0"
        onAnimationComplete={() => { }}
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
                <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setShowModal(!showModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Polee</Text>
            <Text style={styles.modalDesc}>Hujafikisha alama za kuweza kucheza Hatua hii! </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setShowModal(!showModal)}>
              <Text style={styles.textStyle}>Funga</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
            </View>
        </ImageBackground>

    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      button: {
        borderRadius: 20,
        padding: 15,
        elevation: 2,
      },
      buttonOpen: {
        backgroundColor: '#F194FF',
      },
      buttonClose: {
        backgroundColor: '#FBC511',
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        fontSize: 28,
        marginBottom: 10,
        textAlign: 'center',
      },
      modalDesc:{
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
      },
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
