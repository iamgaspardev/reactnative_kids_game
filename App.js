import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal'; 

const fruitsData = [
  { name: 'Apple', image: require('./rsc/images/apple.png'), points: 10 },
  { name: 'Banana', image: require('./rsc/images/banana.png'), points: 5 },
  // Add more fruit data here
];

const App = () => {
  const [fruits, setFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [userGuess, setUserGuess] = useState(null);
  const [correctGuess, setCorrectGuess] = useState(null);
  const [options, setOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Function to generate random number of fruits
  const generateRandomFruits = () => {
    const numFruits = Math.floor(Math.random() * 10) + 1; // Generate between 1 and 10 fruits
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

  // Function to handle user's guess
  const handleGuess = (guess) => {
    if (guess === fruits.length) {
      setCorrectGuess(fruits.length);
      setScore(score + 1); 
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        generateRandomFruits(); 
      }, 3000); 
    }
  };

  useEffect(() => {
    generateRandomFruits();
  }, []);

  // Custom component for Congratulations message
  const CongratulationsMessage = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalTextContainer}>
        <Text style={styles.modalText}>Hongera!</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Marks: {score}</Text>
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
              { backgroundColor: option === correctGuess ? '#87171a' : '#87171a' },
              styles.largeButton, 
            ]}
          >
            <Text style={styles.guessButtonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* <Modal isVisible={showModal} backdropOpacity={0} animationIn="fadeIn" animationOut="fadeOut">
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Hongera!</Text>
        </View>
      </Modal> */}
    </View>
  );
};




const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'transparent', 
    alignItems: 'center',
  },
  modalText: {
    fontSize: 24,
    color: 'green',
    textAlign: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 24,
    marginBottom: 20,
  },
  fruitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fruitItem: {
    margin: 10,
  },
  fruitImage: {
    width: 60,
    height: 60,
  },
  guessText: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  guessButton: {
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
    fontSize: 18,
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
    width: 60, // Adjust button width as needed
    height: 60, // Adjust button height as needed
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    fontSize: 24,
    color: 'green',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },

});

export default App;
