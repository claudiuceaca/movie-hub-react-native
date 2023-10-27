import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { fallbackMoviePoster, image185, searchMovies } from '../api/MovieDB';
import Loading from '../components/Loading';
import { Results } from '../types/types';
import { backgroundColor, lightGray, secondaryTextColor, whiteTextColor } from '../commonStyle';

var { width, height } = Dimensions.get('window');

const SearchScreen = ({ navigation }: any) => {
  const [loading, setLoading] = React.useState(false)
  const [results, setResults] = React.useState<Results[]>([]);

  const handleSearch = (value: string) => {
    if (value && value.length > 2) {
      setLoading(true);
      searchMovies({
        query: value,
        include_adult: 'false',
        language: 'en-US',
        page: '1'
      }).then(data => {
        setLoading(false);
        setResults(data.results)
      })
    } else {
      setLoading(false);
      setResults([])
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder='Search Movie'
          onChangeText={handleSearch}
          placeholderTextColor={'lightgray'}
          style={styles.searchInput}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeScreen')}
          style={styles.closeButton}
        >
          <Image
            style={styles.closeButtonIcon}
            source={require('../assets/close.png')} />
        </TouchableOpacity>
      </View>

      {
        loading ?
          (
            <Loading />
          )
          : (
            results.length > 0 ?
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.resultsContainer}>
                <Text
                  style={styles.resultsText}>
                  Result ({results.length})
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',

                  }}>
                  {
                    results.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => navigation.push('Movie', item)}
                        >
                          <View style={styles.resultItem}>
                            <Image
                              style={styles.resultImage}
                              source={{ uri: image185(item?.poster_path) || fallbackMoviePoster }} />
                            <Text
                              style={styles.resultTitle}>
                              {
                                item?.title.length > 22 ? item?.title.slice(0, 21) + '...' : item?.title}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )
                    })
                  }
                </View>
              </ScrollView>
              : <View>
                <Image
                  style={styles.noResultsImage}
                  source={require("../assets/images/movieTime.png")} />
              </View>
          )
      }
    </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    paddingTop: StatusBar.currentHeight,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: secondaryTextColor,
    borderRadius: 100,
    marginHorizontal: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    padding: 4,
    paddingLeft: 24,
    color: whiteTextColor,
  },
  closeButton: {
    padding: 12,
    margin: 4,
    backgroundColor: lightGray,
    borderRadius: 25,
  },
  closeButtonIcon: {
    width: 23,
    height: 23,
  },
  resultsContainer: {
    paddingHorizontal: 15,
    marginTop: 12,
  },
  resultsText: {
    color: whiteTextColor,
    fontWeight: '600',
  },
  resultItem: {
    marginVertical: 8,
  },
  resultImage: {
    width: width * 0.44,
    height: height * 0.3,
    borderRadius: 20,
  },
  resultTitle: {
    color: lightGray,
    marginLeft: 4,
  },
  noResultsImage: {
    width: width,
    height: 400,
  },
});
