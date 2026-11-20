import AsyncStorage from "@react-native-async-storage/async-storage";

const key = (id: string) => `booking-note:${id}`;

export const loadNote = async (id: string) =>
  (await AsyncStorage.getItem(key(id))) ?? "";
export const saveNote = (id: string, text: string) =>
  AsyncStorage.setItem(key(id), text);
