import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, Switch, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Check, ShieldCheck, ShieldOff } from 'lucide-react-native';
import {
  Button,
  Card,
  EmptyState,
  Icon,
  Input,
  Screen,
  Typography,
} from '@/presentation/components';
import { useTheme } from '@/presentation/providers';
import type { FocusStackParamList } from '@/presentation/navigation/types';
import { useBlockedAppsScreen } from './useBlockedAppsScreen';
import { createStyles } from './BlockedAppsScreen.styles';

export function BlockedAppsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation =
    useNavigation<NativeStackNavigationProp<FocusStackParamList>>();
  const vm = useBlockedAppsScreen();

  if (!vm.supported) {
    return (
      <Screen scroll>
        <EmptyState
          icon={ShieldOff}
          title="Indisponível"
          description="O bloqueio só funciona em builds nativos do Android. Faça um dev build com `expo run:android` ou via EAS."
        />
      </Screen>
    );
  }

  const permissionsOk = vm.hasUsageAccess && vm.hasOverlay;

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Typography variant="h2">Bloqueio de apps</Typography>
        <Typography variant="body" color="secondary">
          Escolha apps que serão bloqueados durante o modo foco. {vm.selectedCount} selecionados.
        </Typography>
      </View>

      {permissionsOk ? (
        <View style={styles.permissionsGranted}>
          <Icon name={ShieldCheck} size={20} color={theme.colors.success} />
          <Typography variant="bodyEmphasis" color="success">
            Permissões concedidas
          </Typography>
        </View>
      ) : (
        <Card style={styles.permissionsCard}>
          <Typography variant="label" color="secondary">
            Permissões
          </Typography>
          <View style={styles.permissionRow}>
            <View style={styles.permissionInfo}>
              <Typography variant="bodyEmphasis">Acesso ao uso</Typography>
              <Typography variant="caption" color="secondary">
                {vm.hasUsageAccess
                  ? 'Concedida'
                  : 'Necessária para detectar qual app está aberto'}
              </Typography>
            </View>
            {vm.hasUsageAccess ? (
              <Icon name={Check} size={18} color={theme.colors.success} />
            ) : (
              <Button
                label="Conceder"
                size="sm"
                onPress={async () => {
                  await vm.onRequestUsageAccess();
                }}
              />
            )}
          </View>
          <View style={styles.permissionRow}>
            <View style={styles.permissionInfo}>
              <Typography variant="bodyEmphasis">Sobreposição</Typography>
              <Typography variant="caption" color="secondary">
                {vm.hasOverlay
                  ? 'Concedida'
                  : 'Necessária para mostrar a tela de bloqueio'}
              </Typography>
            </View>
            {vm.hasOverlay ? (
              <Icon name={Check} size={18} color={theme.colors.success} />
            ) : (
              <Button
                label="Conceder"
                size="sm"
                onPress={async () => {
                  await vm.onRequestOverlay();
                }}
              />
            )}
          </View>
          <Button
            label="Verificar novamente"
            variant="ghost"
            size="sm"
            onPress={vm.refreshPermissions}
          />
        </Card>
      )}

      {permissionsOk ? (
        <>
          <View style={styles.searchRow}>
            <Input
              label="Buscar app"
              value={vm.search}
              onChangeText={vm.setSearch}
              placeholder="Nome ou package"
            />
          </View>

          <View style={styles.filtersRow}>
            <Typography variant="caption" color="secondary">
              Mostrar apps do sistema
            </Typography>
            <Switch value={vm.showSystem} onValueChange={vm.setShowSystem} />
          </View>

          {vm.loading && vm.apps.length === 0 ? (
            <Typography variant="body" color="secondary">
              Carregando lista de apps...
            </Typography>
          ) : null}

          {vm.error ? (
            <Typography
              variant="caption"
              color="danger"
              style={styles.inlineError}
            >
              {vm.error.message}
            </Typography>
          ) : null}

          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={styles.list}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
            {vm.apps.map((app) => {
              const selected = vm.selectedSet.has(app.packageName);
              return (
                <Pressable
                  key={app.packageName}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={app.label}
                  onPress={() => vm.togglePackage(app.packageName)}
                  style={[styles.appRow, selected && styles.appRowSelected]}
                >
                  {app.iconBase64 ? (
                    <Image
                      source={{ uri: `data:image/png;base64,${app.iconBase64}` }}
                      style={styles.appIcon}
                    />
                  ) : (
                    <View style={[styles.appIcon, styles.appIconPlaceholder]} />
                  )}
                  <View style={styles.appInfo}>
                    <Typography variant="bodyEmphasis" numberOfLines={1}>
                      {app.label}
                    </Typography>
                    <Typography variant="caption" color="secondary" numberOfLines={1}>
                      {app.packageName}
                    </Typography>
                  </View>
                  {selected ? (
                    <Icon name={Check} size={20} color={theme.colors.accent} />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Button
              label="Confirmar seleção"
              fullWidth
              onPress={() => navigation.goBack()}
            />
            <Button
              label="Limpar tudo"
              variant="ghost"
              fullWidth
              onPress={vm.clear}
            />
          </View>
        </>
      ) : (
        <Typography variant="body" color="secondary">
          Conceda as duas permissões acima para escolher os apps.
        </Typography>
      )}
    </Screen>
  );
}
