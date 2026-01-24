import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  SongDetail: { id: string };
  SongAdd: undefined;
  PracticeDetail: { id: string };
  PracticeAdd: { date?: string } | undefined;
  LiveDetail: { id: string };
  LiveAdd: undefined;
  SetlistEdit: { id: string };
  ChecklistTemplates: undefined;
  LogDetail: { id: string };
  LogAdd: { practiceId?: string; liveId?: string } | undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Songs: undefined;
  Schedule: undefined;
  Live: undefined;
  Log: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
