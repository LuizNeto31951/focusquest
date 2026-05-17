package expo.modules.appblocker

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import java.io.ByteArrayOutputStream

data class InstalledApp(
  val packageName: String,
  val label: String,
  val isSystem: Boolean,
  val iconBase64: String?,
)

object InstalledAppsHelper {

  private const val ICON_SIZE_PX = 96
  private const val ICON_QUALITY = 90

  fun listLaunchableApps(context: Context): List<InstalledApp> {
    val pm = context.packageManager
    val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
      addCategory(Intent.CATEGORY_LAUNCHER)
    }

    val resolveInfos = pm.queryIntentActivities(mainIntent, PackageManager.MATCH_ALL)
    val ownPackage = context.packageName

    return resolveInfos
      .asSequence()
      .map { it.activityInfo }
      .filter { it.packageName != ownPackage }
      .distinctBy { it.packageName }
      .map { ai ->
        val appInfo = ai.applicationInfo
        val systemFlag = appInfo.flags and android.content.pm.ApplicationInfo.FLAG_SYSTEM
        val updatedSystemFlag = appInfo.flags and android.content.pm.ApplicationInfo.FLAG_UPDATED_SYSTEM_APP
        val isPureSystem = systemFlag != 0 && updatedSystemFlag == 0
        val label = try {
          pm.getApplicationLabel(appInfo).toString()
        } catch (_: PackageManager.NameNotFoundException) {
          ai.packageName
        }
        val icon = runCatching { pm.getApplicationIcon(appInfo) }.getOrNull()
        InstalledApp(
          packageName = ai.packageName,
          label = label,
          isSystem = isPureSystem,
          iconBase64 = icon?.let(::encodeDrawable),
        )
      }
      .sortedBy { it.label.lowercase() }
      .toList()
  }

  private fun encodeDrawable(drawable: Drawable): String? {
    return try {
      val bitmap = drawableToBitmap(drawable)
      val out = ByteArrayOutputStream()
      bitmap.compress(Bitmap.CompressFormat.PNG, ICON_QUALITY, out)
      bitmap.recycle()
      Base64.encodeToString(out.toByteArray(), Base64.NO_WRAP)
    } catch (_: Throwable) {
      null
    }
  }

  private fun drawableToBitmap(drawable: Drawable): Bitmap {
    if (drawable is BitmapDrawable) {
      val bmp = drawable.bitmap
      if (bmp != null) {
        return Bitmap.createScaledBitmap(bmp, ICON_SIZE_PX, ICON_SIZE_PX, true)
      }
    }
    val w = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else ICON_SIZE_PX
    val h = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else ICON_SIZE_PX
    val bitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(bitmap)
    drawable.setBounds(0, 0, canvas.width, canvas.height)
    drawable.draw(canvas)
    return if (w == ICON_SIZE_PX && h == ICON_SIZE_PX) {
      bitmap
    } else {
      val scaled = Bitmap.createScaledBitmap(bitmap, ICON_SIZE_PX, ICON_SIZE_PX, true)
      if (scaled != bitmap) bitmap.recycle()
      scaled
    }
  }
}
