import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  Alert, Modal, Pressable
} from 'react-native';
import Orientation from 'react-native-orientation-locker'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import ConfettiCannon from 'react-native-confetti-cannon';
import { ScrollView } from 'react-native-gesture-handler';
import service from './database/service';

const fruitsData = [
  { name: 'Apple', image: require('../rsc/images/apple.png'), points: 10 },
  { name: 'Banana', image: require('../rsc/images/banana.png'), points: 5 },
];

const GameScreen = ({ route }) => {
    const {level} = route.params ?? {};
const navigation = useNavigation();
const progress = 40;
  const [fruits, setFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [userGuess, setUserGuess] = useState(null);
  const [correctGuess, setCorrectGuess] = useState(null);
  const [options, setOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const generateRandomFruits = (level) => {
    let min, max;

  switch (level) {
    case 1:
      min = 1;
      max = 10;
      break;
    case 2:
      min = 11;
      max = 50;
      break;
    case 3:
      min = 51;
      max = 100;
      break;
    default:
      min = 1;
      max = 10;
  }
    const numFruits = Math.floor(Math.random() * (max - min + 1)) + min;
    const newFruits = [];
    for (let i = 0; i < numFruits; i++) {
      const randomIndex = Math.floor(Math.random() * fruitsData.length);
      newFruits.push(fruitsData[randomIndex]);
    }
    setFruits(newFruits);
    setOptions(generateOptions(newFruits.length));
    setCorrectGuess(null); // Reset correct guess
    setUserGuess(null); // Reset user's guess
  };

  // Function to generate three options, one of them is correct
  const generateOptions = (correctValue) => {
    const optionsArray = [];
    for (let i = 1; i <= 3; i++) {
      optionsArray.push(i === 1 ? correctValue : randomOption(correctValue));
    }
    return shuffle(optionsArray);
  };

  // Function to generate a random incorrect option
  const randomOption = (correctValue) => {
    let randomOption;
    do {
      randomOption = Math.floor(Math.random() * 10) + 1; 
    } while (randomOption === correctValue);
    return randomOption;
  };

  // Function to shuffle the options array
  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex,
      tempValue;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      tempValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = tempValue;
    }

    return array;
  };

  const handleGuess = async (guess) => {
    if (guess === fruits.length) {
      setCorrectGuess(fruits.length);
      const newScore = score + 10;

      setScore(newScore);
      setShowModal(true);
      try {
        await service.saveHighScore(level, newScore);
      } catch (error) {
        console.error('Error saving high score:', error);
      }
      setTimeout(() => {
        setShowModal(false);
        generateRandomFruits();
      }, 7000);
    }
  };
//fetch last highscore 
const fetchLastScore = async () => {
  try {
    if (!service.db) {
      console.error('Database not properly initialized.');
      return;
    }

    const lastScore = await service.getHighestScore(level);
    setScore(lastScore);
    setLastScore(lastScore);
  } catch (error) {
    console.error('Error fetching last score:', error);
  }
};
  useEffect(() => {
    generateRandomFruits(level);
    Orientation.lockToLandscape();
    fetchLastScore();
  }, [])
  

  // Custom component for Congratulations message
  const CongratulationsMessage = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalTextContainer}>
        <Text style={styles.modalText}>Hongera!</Text>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../rsc/images/App-bg-1.png')} 
      style={styles.backgroundImage}
    >
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="caret-back-outline" size={24} color="#F20EB2" />
      </TouchableOpacity>
      <AnimatedCircularProgress
        size={40} 
        width={7}
        fill={score}
        tintColor="#7918F0"
        onAnimationComplete={() => {}}
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
      <Text style={styles.score}>Chagua Idadi sahihi ya matunda</Text>
      <View style={styles.fruitCont}>
      <ScrollView>
      <View style={styles.fruitContainer}>
        {fruits.map((fruit, index) => (
          <TouchableOpacity key={index} style={styles.fruitItem}>
            <Image
              source={fruit.image}
              style={styles.fruitImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>
      </ScrollView>
      </View>
      <Text style={styles.guessText}>Chagua idadi sahihi:</Text>
      <View style={styles.buttonContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setUserGuess(option);
              handleGuess(option);
            }}
            style={[
              styles.guessButton,
              userGuess === option ? styles.selectedGuess : null,
              { backgroundColor:  '#F7B80A' },
              styles.largeButton, 
            ]}
          >
            <Text style={styles.guessButtonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {showModal&& <ConfettiCannon explosionSpeed={500} count={200} origin={{x: -10, y: 0}} style={styles.confett} />}
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
            <Text style={styles.modalText}>Hongera sana</Text>
            <Text style={styles.modalDesc}>Umechagua kwa Usahihi, Kuna matunda {correctGuess} </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setShowModal(!showModal)}>
              <Text style={styles.textStyle}>Endelea</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
    </View>
    </ImageBackground>
    
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  modalContainer: {
    backgroundColor: 'transparent', 
    alignItems: 'center',
  },
  modalTextContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  largeButton: {
    width: 100,
    height: 60, 
  },
  container: {
    flex: 1,
    paddingTop:30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 24,
    marginBottom: 20,
    color:"#fff",
    fontWeight:'900'
  },
  fruitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems:'center',
  },
  fruitCont:{
    height:150,
  },
  fruitItem: {
    margin: 10,
  },
  fruitImage: {
    width: 60,
    height: 60,
  },
  guessText: {
    fontSize: 20,
    color:"#fff",
    fontWeight:'900'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  guessButton: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'blue',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  selectedGuess: {
    backgroundColor: 'green',
  },
  guessButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight:'900',
  },
  equation: {
    fontSize: 24,
    marginTop: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  congratulations: {
    fontSize: 24,
    color: 'green',
    marginTop: 10,
  },
  largeButton: {
    width: 60,
    height: 60, 
  },
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
confett:{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000, 
}
});

export default GameScreen;
