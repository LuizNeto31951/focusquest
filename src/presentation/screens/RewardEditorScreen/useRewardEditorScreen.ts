import { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { UniqueId } from '@/shared/types';
import {
  useCreateReward,
  useDeleteReward,
  useRewards,
  useUpdateReward,
} from '@/presentation/hooks';
import { REWARD_ICON_OPTIONS } from '@/presentation/components';

export const REWARD_COLORS: readonly string[] = [
  '#6366F1',
  '#0D9488',
  '#16A34A',
  '#D97706',
  '#DB2777',
  '#EF4444',
  '#0EA5E9',
  '#7C3AED',
  '#A16207',
  '#64748B',
];

export const REWARD_CATEGORIES: readonly string[] = [
  'Geral',
  'Lazer',
  'Comida',
  'Compras',
  'Bem-estar',
  'Estudo',
];

export function useRewardEditorScreen(rewardIdParam?: string) {
  const rewardId = rewardIdParam ? UniqueId.from(rewardIdParam) : undefined;
  const isEdit = Boolean(rewardId);
  const { rewards } = useRewards();
  const create = useCreateReward();
  const update = useUpdateReward();
  const remove = useDeleteReward();

  const existing = isEdit ? rewards.find((r) => r.id === rewardId) : undefined;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconKey, setIconKey] = useState<string>(REWARD_ICON_OPTIONS[0]!);
  const [color, setColor] = useState<string>(REWARD_COLORS[0]!);
  const [category, setCategory] = useState<string>(REWARD_CATEGORIES[0]!);
  const [costText, setCostText] = useState('20');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [pickingImage, setPickingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setDescription(existing.description);
      setIconKey(existing.iconKey);
      setColor(existing.color);
      setCategory(existing.category);
      setCostText(String(existing.cost));
      setImageUri(existing.imageUri);
    }
  }, [existing]);

  const cost = parseInt(costText, 10);
  const nameError =
    submitAttempted && !name.trim() ? 'Nome obrigatório' : undefined;
  const costError =
    submitAttempted && (Number.isNaN(cost) || cost < 1)
      ? 'Use um número >= 1'
      : undefined;
  const isValid = name.trim().length > 0 && !Number.isNaN(cost) && cost >= 1;

  const pickImage = useCallback(async () => {
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
      const destDir = `${FileSystem.documentDirectory}rewards/`;
      await FileSystem.makeDirectoryAsync(destDir, {
        intermediates: true,
      }).catch(() => undefined);
      const extension = asset.uri.split('.').pop()?.split('?')[0] ?? 'jpg';
      const destPath = `${destDir}reward-${Date.now()}.${extension}`;
      await FileSystem.copyAsync({ from: asset.uri, to: destPath });
      setImageUri(destPath);
    } catch (err) {
      setImageError((err as Error).message);
    } finally {
      setPickingImage(false);
    }
  }, []);

  const removeImage = useCallback(() => setImageUri(undefined), []);

  const submit = useCallback(async () => {
    setSubmitAttempted(true);
    if (!isValid) {
      throw new Error('Preencha os campos corretamente');
    }
    if (isEdit && rewardId) {
      await update.run({
        id: rewardId,
        name,
        description,
        iconKey,
        color,
        category,
        cost,
        imageUri: imageUri === undefined ? null : imageUri,
      });
    } else {
      await create.run({
        name,
        description,
        iconKey,
        color,
        category,
        cost,
        imageUri,
      });
    }
  }, [
    isEdit,
    rewardId,
    isValid,
    name,
    description,
    iconKey,
    color,
    category,
    cost,
    imageUri,
    create,
    update,
  ]);

  const deleteReward = useCallback(async () => {
    if (!rewardId) return;
    await remove.run({ id: rewardId });
  }, [rewardId, remove]);

  return {
    isEdit,
    existing,
    name,
    setName,
    description,
    setDescription,
    iconKey,
    setIconKey,
    color,
    setColor,
    category,
    setCategory,
    costText,
    setCostText,
    imageUri,
    pickImage,
    removeImage,
    pickingImage,
    imageError,
    nameError,
    costError,
    isValid,
    submitAttempted,
    submit,
    submitting: create.loading || update.loading,
    submitError: create.error ?? update.error,
    deleteReward,
    deleting: remove.loading,
  };
}
