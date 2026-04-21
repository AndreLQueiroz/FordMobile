import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'racingData';
const CURRENT_USER_KEY = 'currentUser';
const CURRENT_LAP_KEY = 'currentLap';

const emptyData = {
  users: [],
  laps: [],
};

export const loadFromStorage = async () => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY);

    if (storedData) {
      return JSON.parse(storedData);
    }

    return emptyData;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return emptyData;
  }
};

export const saveToStorage = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
};

export const saveOrUpdateUser = async (userData) => {
  const data = await loadFromStorage();

  const existingUser = data.users.find((u) => u.email === userData.email);

  if (existingUser) {
    if (existingUser.points === undefined) existingUser.points = 0;
    await saveToStorage(data);
    return existingUser;
  }

  const newUser = {
    id: generateUserId(),
    name: userData.name,
    email: userData.email,
    points: 0,
  };

  data.users.push(newUser);
  await saveToStorage(data);
  return newUser;
};

export const addPointsToUser = async (email, pointsToAdd) => {
  const data = await loadFromStorage();
  const userIndex = data.users.findIndex((u) => u.email === email);

  if (userIndex !== -1) {
    const currentPoints = data.users[userIndex].points || 0;
    data.users[userIndex].points = currentPoints + pointsToAdd;

    await saveToStorage(data);

    const currentUserStr = await AsyncStorage.getItem(CURRENT_USER_KEY);

    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);

      if (currentUser.email === email) {
        currentUser.points = data.users[userIndex].points;
        await AsyncStorage.setItem(
          CURRENT_USER_KEY,
          JSON.stringify(currentUser)
        );
      }
    }
  }
};

export const saveLap = async (lap) => {
  const data = await loadFromStorage();
  data.laps.push(lap);
  await saveToStorage(data);
};

export const getRankedLaps = async () => {
  const data = await loadFromStorage();

  return data.laps
    .filter((lap) => lap.completed)
    .sort((a, b) => a.time - b.time);
};

export const getGlobalRanking = async () => {
  const data = await loadFromStorage();

  return [...data.users].sort((a, b) => (b.points || 0) - (a.points || 0));
};

export const generateUserId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const saveCurrentUser = async (user) => {
  try {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Erro ao salvar usuário atual:', error);
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erro ao carregar usuário atual:', error);
    return null;
  }
};

export const removeCurrentUser = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Erro ao remover usuário atual:', error);
  }
};

export const saveCurrentLap = async (lap) => {
  try {
    await AsyncStorage.setItem(CURRENT_LAP_KEY, JSON.stringify(lap));
  } catch (error) {
    console.error('Erro ao salvar volta atual:', error);
  }
};

export const getCurrentLap = async () => {
  try {
    const lap = await AsyncStorage.getItem(CURRENT_LAP_KEY);
    return lap ? JSON.parse(lap) : null;
  } catch (error) {
    console.error('Erro ao carregar volta atual:', error);
    return null;
  }
};

export const removeCurrentLap = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_LAP_KEY);
  } catch (error) {
    console.error('Erro ao remover volta atual:', error);
  }
};