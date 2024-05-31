import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Linking,
  Pressable,
} from 'react-native';
import supabase from './src/lib/supabase';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Markdown from 'react-native-markdown-display';

export default function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);

  const runPrompt = async () => {
    setMessages((current) => [{ message: query, isUser: true }, ...current]);
    setQuery('');
    const { data, error } = await supabase.functions.invoke('prompt', {
      body: { query },
    });
    if (error) {
      console.log('Failed');
      console.log(error);
    }
    setMessages((current) => [{ ...data }, ...current]);
  };

  console.log(messages);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        inverted
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              { marginLeft: item.isUser ? 50 : 0 },
            ]}
          >
            <Markdown>{item.message}</Markdown>

            {item.docs && (
              <Text
                style={{ fontWeight: 'bold', marginTop: 20, color: 'dimgray' }}
              >
                Read more:
              </Text>
            )}
            {item.docs?.map((doc) => (
              <Pressable
                style={styles.linkContainer}
                onPress={() => Linking.openURL(doc.url)}
              >
                <Text style={styles.link}>{doc.title}</Text>
                <Feather name="external-link" size={18} color="royalblue" />
              </Pressable>
            ))}
          </View>
        )}
      />

      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <TextInput
          placeholder="prompt"
          value={query}
          onChangeText={setQuery}
          style={{
            marginVertical: 15,
            padding: 15,
            borderColor: 'gainsboro',
            borderWidth: 1,
            borderRadius: 50,
            flex: 1,
          }}
        />
        <FontAwesome5
          onPress={runPrompt}
          name="arrow-circle-up"
          size={30}
          color="gray"
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  messageContainer: {
    backgroundColor: '#F7F7F7',
    padding: 10,
    borderRadius: 5,
  },
  linkContainer: {
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    fontWeight: '600',
    color: 'royalblue',
  },
});
