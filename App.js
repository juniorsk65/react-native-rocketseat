import React from 'react';
import { 
  StyleSheet, 
  ScrollView,
  Text, 
  View,
  Platform,
  StatusBar,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';

import Repo from './componentes/Repo';

import NewRepoModal from './componentes/NewRepoModal';


export default class App extends React.Component {
  state = {
    modalVisible: false,
    repos:[],
  };

  async componentDidMount() {
    const repos = JSON.parse(await AsyncStorage.getItem('@GitRepo:repositories')) || [];
    
    this.setState({ repos });
  }


  _addRepository = async (newRepoText) => { //Requisição assincrona na API GitHub ES6
    const repoCall = await fetch(`https://api.github.com/repos/${newRepoText}`);
  const response = await repoCall.json();
  
  const repository = {
    id: response.id,
    thumbnail: response.owner.avatar_url,
    tittle: response.name,
    author: response.owner.login,
  };

  this.setState({
    modalVisible: false,
    repos: [
      ...this.state.repos,
      repository,
    ],
  });

  //Não pode salvar um objeto primitivo(array por exemplo), é necessario salvar string por isso JSON
  await AsyncStorage.setItem('@GitRepo:repositories', JSON.stringify(this.state.repos));
  };
 

  render() {
    return (
      <View style={styles.container}>
         <View style={styles.header}>
              <Text style={styles.headerText}> </Text> 
              <Text style={styles.headerText}>SisEnex!</Text>
                <TouchableOpacity onPress={() => this.setState({modalVisible: true}) }>
                  <Text style={styles.headerButton}>+</Text>
                </TouchableOpacity>
            </View>
          <ScrollView contentContainerStyle={styles.repoList}>
            {this.state.repos.map(repo => <Repo key={repo.id} data={repo} />) }
          </ScrollView>
           <NewRepoModal onCancel={() => this.setState({modalVisible: false})} 
                                onAdd={this._addRepository}
                                visible={this.state.modalVisible}/>
      </View>
    );  
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#303030',
  },

  
  header: {
    height: (Platform.OS === 'ios') ? 100 : 80,
    paddingTop: (Platform.OS === 'ios') ? 0 : 20,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  headerButton:{
    fontSize: 30,
    fontWeight: 'bold',
  },

  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  repoList: {
    padding: 20,  
  },

});
