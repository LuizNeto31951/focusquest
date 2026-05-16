import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Avatar,
  Button,
  Input,
  Screen,
  Typography,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { ProfileStackParamList } from '@/presentation/navigation/types';
import { useEditProfileScreen } from './useEditProfileScreen';
import { createStyles } from './EditProfileScreen.styles';

export function EditProfileScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const vm = useEditProfileScreen();

  async function handleSave() {
    try {
      await vm.save();
      navigation.goBack();
    } catch {
      // erro exibido via vm.submitError
    }
  }

  return (
    <Screen scroll>
      <View style={styles.avatarRow}>
        <Avatar name={vm.name || 'Você'} uri={vm.avatarUri} size={96} />
        <View style={styles.actionsRow}>
          <Button
            label={vm.avatarUri ? 'Trocar foto' : 'Escolher foto'}
            variant="secondary"
            size="sm"
            loading={vm.pickingImage}
            onPress={vm.pickAvatar}
          />
          {vm.avatarUri ? (
            <Button
              label="Remover"
              variant="ghost"
              size="sm"
              onPress={vm.removeAvatar}
            />
          ) : null}
        </View>
        {vm.imageError ? (
          <Typography variant="caption" color="danger">
            {vm.imageError}
          </Typography>
        ) : null}
      </View>

      <View style={styles.section}>
        <Input
          label="Nome"
          value={vm.name}
          onChangeText={vm.setName}
          placeholder="Como devemos te chamar?"
        />
      </View>

      {vm.submitError ? (
        <Typography variant="body" color="danger" style={styles.errorText}>
          {vm.submitError.message}
        </Typography>
      ) : null}

      <View style={styles.saveActions}>
        <Button
          label="Salvar"
          fullWidth
          loading={vm.submitting}
          onPress={handleSave}
        />
        <Button
          label="Cancelar"
          variant="ghost"
          fullWidth
          disabled={vm.submitting}
          onPress={() => navigation.goBack()}
        />
      </View>
    </Screen>
  );
}
