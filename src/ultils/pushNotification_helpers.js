import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFCMToken();
  }
}

async function getFCMToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('🚀 old fcmToken', fcmToken);

  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log('🚀 ~ getFCMToken ~ error', error);
    }
  }
}

const notificationListner = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('🚀background state  remoteMessage', remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          '🚀 Notification caused app to open quit state',
          remoteMessage,
        );
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log('foreground state  remoteMessage', remoteMessage);
  });
};

export {requestUserPermission, notificationListner};
