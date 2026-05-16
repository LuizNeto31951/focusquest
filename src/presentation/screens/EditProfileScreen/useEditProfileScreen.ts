import { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useCurrentUser, useUpdateUserProfile } from '@/presentation/hooks';

export function useEditProfileScreen() {
  const { user } = useCurrentUser();
  const updateProfile = useUpdateUserProfile();
  const [name, setName] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [pickingImage, setPickingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarUri(user.avatarUri);
    }
  }, [user]);

  const pickAvatar = useCallback(async () => {
    setImageError(null);
    setPickingImage(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setImageError('Permissão de acesso à galeria negada.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (result.canceled || result.assets.length === 0) return;
      const asset = result.assets[0]!;

      const destDir = `${FileSystem.documentDirectory}avatars/`;
      await FileSystem.makeDirectoryAsync(destDir, { intermediates: true }).catch(
        () => undefined,
      );
      const extension = asset.uri.split('.').pop()?.split('?')[0] ?? 'jpg';
      const destPath = `${destDir}user-${Date.now()}.${extension}`;
      await FileSystem.copyAsync({ from: asset.uri, to: destPath });
      setAvatarUri(destPath);
    } catch (err) {
      setImageError((err as Error).message);
    } finally {
      setPickingImage(false);
    }
  }, []);

  const removeAvatar = useCallback(() => {
    setAvatarUri(undefined);
  }, []);

  const save = useCallback(async () => {
    if (!user) throw new Error('Usuário não carregado');
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Nome obrigatório');
    }
    await updateProfile.run({
      userId: user.id,
      name: trimmedName,
      avatarUri: avatarUri === undefined ? null : avatarUri,
    });
  }, [user, name, avatarUri, updateProfile]);

  return {
    user,
    name,
    setName,
    avatarUri,
    pickAvatar,
    removeAvatar,
    pickingImage,
    imageError,
    save,
    submitting: updateProfile.loading,
    submitError: updateProfile.error,
  };
}
