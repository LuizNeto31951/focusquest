package expo.modules.appblocker

import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AppBlockerModule : Module() {

  override fun definition() = ModuleDefinition {
    Name("AppBlocker")

    AsyncFunction("hasUsageAccessPermission") {
      hasUsageAccessPermission()
    }

    AsyncFunction("requestUsageAccessPermission") {
      val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
      }
      currentContext().startActivity(intent)
    }

    AsyncFunction("hasOverlayPermission") {
      hasOverlayPermission()
    }

    AsyncFunction("requestOverlayPermission") {
      val ctx = currentContext()
      val intent = Intent(
        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:" + ctx.packageName),
      ).apply { flags = Intent.FLAG_ACTIVITY_NEW_TASK }
      ctx.startActivity(intent)
    }

    AsyncFunction("listInstalledApps") {
      InstalledAppsHelper.listLaunchableApps(currentContext()).map { app ->
        mapOf(
          "packageName" to app.packageName,
          "label" to app.label,
          "isSystem" to app.isSystem,
          "iconBase64" to app.iconBase64,
        )
      }
    }

    AsyncFunction("startBlocking") { packageNames: List<String> ->
      val ctx = currentContext()
      if (packageNames.isNotEmpty()) {
        if (!hasUsageAccessPermission()) {
          throw IllegalStateException("Permissão de acesso ao uso ausente")
        }
        if (!hasOverlayPermission()) {
          throw IllegalStateException("Permissão de sobreposição ausente")
        }
      }
      val intent = Intent(ctx, AppBlockerService::class.java).apply {
        putExtra(AppBlockerService.EXTRA_PACKAGES, packageNames.toTypedArray())
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        ctx.startForegroundService(intent)
      } else {
        ctx.startService(intent)
      }
    }

    AsyncFunction("stopBlocking") {
      val ctx = currentContext()
      val intent = Intent(ctx, AppBlockerService::class.java).apply {
        action = AppBlockerService.ACTION_STOP
      }
      ctx.startService(intent)
    }
  }

  private fun currentContext(): Context =
    appContext.reactContext ?: throw IllegalStateException("React context indisponível")

  private fun hasUsageAccessPermission(): Boolean {
    val ctx = currentContext()
    val appOps = ctx.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
    val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      appOps.unsafeCheckOpNoThrow(
        AppOpsManager.OPSTR_GET_USAGE_STATS,
        android.os.Process.myUid(),
        ctx.packageName,
      )
    } else {
      @Suppress("DEPRECATION")
      appOps.checkOpNoThrow(
        AppOpsManager.OPSTR_GET_USAGE_STATS,
        android.os.Process.myUid(),
        ctx.packageName,
      )
    }
    return mode == AppOpsManager.MODE_ALLOWED
  }

  private fun hasOverlayPermission(): Boolean {
    val ctx = currentContext()
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      Settings.canDrawOverlays(ctx)
    } else true
  }
}
