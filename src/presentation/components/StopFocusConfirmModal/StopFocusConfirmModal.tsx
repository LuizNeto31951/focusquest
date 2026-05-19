import React, { useMemo } from 'react';
import { Modal, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Button, Icon, Typography } from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import { createStyles } from './StopFocusConfirmModal.styles';

interface Props {
  visible: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function StopFocusConfirmModal({ visible, loading, onCancel, onConfirm }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <Icon name={AlertTriangle} size={36} color={theme.colors.danger} />
          </View>

          <Typography variant="h2" align="center">
            Encerrar o foco?
          </Typography>

          <Typography variant="body" color="secondary" align="center">
            Para sair antes do tempo, você precisará assistir um anúncio completo.
            Só será liberado ao receber a recompensa — use com consciência.
          </Typography>

          <View style={styles.actions}>
            <Button
              label="Continuar focando"
              variant="secondary"
              fullWidth
              disabled={loading}
              onPress={onCancel}
            />
            <Button
              label="Assistir anúncio e encerrar"
              variant="danger"
              fullWidth
              loading={loading}
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
