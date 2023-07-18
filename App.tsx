import React, { useState } from 'react';
import {ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNTextDetector from 'rn-text-detector';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ToastAndroid,
} from 'react-native';

type State = {
  loading: boolean;
  image: string | null;
  toast: {
    message: string;
    isVisible: boolean;
  };
  textRecognition: { text: string }[] | null;
};
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    button: {
      padding: 10,
      marginHorizontal: 10,
      backgroundColor: '#DDDDDD',
    },
    shadow: {
      elevation: 2,
    },
    imageContainer: {
      alignItems: 'center',
    },
    imageWrapper: {
      borderWidth: 1,
      borderColor: '#000000',
      padding: 10,
      marginBottom: 20,
    },
    image: {
      width: 200,
      height: 200,
    },
    textRecognition: {
      marginBottom: 10,
    },
  });
const App = () => {
  const [state, setState] = useState<State>({
    loading: false,
    image: null,
    textRecognition: null,
    toast: {
      message: '',
      isVisible: false,
    },
    
  });



  const onPress = async (type: 'capture' | 'library') => {
    setState({ ...state, loading: true });
    type === 'capture'
      ? launchCamera({ mediaType: 'photo' }, onImageSelect)
      : launchImageLibrary({ mediaType: 'photo' }, onImageSelect);
  };

  const onImageSelect = async (media: ImagePickerResponse) => {
    if (!media || !media.assets || media.assets.length === 0) {
      setState({ ...state, loading: false });
      return;
    }
    const file = media.assets[0].uri;
    const textRecognition = await RNTextDetector.detectFromUri(file);
    const INFLIGHT_IT = 'Inflight IT';
    const matchText = textRecognition.findIndex(
      (item: { text: string }) => item.text.match(INFLIGHT_IT)
    );
  

    setState({
      ...state,
      textRecognition,
      image: file as string | null, // Type assertion added here
      toast: {
        message: matchText > -1 ? 'Ohhh I love this company!!' : '',
        isVisible: matchText > -1,
      },
      loading: false,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>RN OCR SAMPLE</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.shadow]}
            onPress={() => onPress('capture')}
          >
            <Text>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.shadow]}
            onPress={() => onPress('library')}
          >
            <Text>Pick a Photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            {state.image && (
              <Image style={styles.image} source={{ uri: state.image }} />
            )}
          </View>
          {state.textRecognition &&
            state.textRecognition.map((item, i) => (
              <Text key={i} style={styles.textRecognition}>
                {item.text}
              </Text>
            ))}
        </View>
        
      </View>
      
     
    </SafeAreaView>
  );
};

export default App;
