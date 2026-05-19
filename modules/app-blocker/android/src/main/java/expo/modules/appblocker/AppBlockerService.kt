package expo.modules.appblocker

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.graphics.Color
import android.graphics.PixelFormat
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.app.NotificationCompat

class AppBlockerService : Service() {

  private val handler = Handler(Looper.getMainLooper())
  private var blockedPackages: Set<String> = emptySet()
  private var running = false

  private var overlayView: View? = null
  private var overlayLabel: TextView? = null
  private var currentlyBlockedPackage: String? = null

  private val pollTask = object : Runnable {
    override fun run() {
      if (!running) return
      try {
        val foreground = currentForegroundPackage()
        val ownPkg = packageName
        when {
          foreground == null -> Unit
          foreground == ownPkg -> {
            // Usuário voltou ao FocusQuest — esconde overlay e libera nova detecção.
            hideOverlay()
            currentlyBlockedPackage = null
          }
          foreground in blockedPackages -> {
            if (overlayView == null) {
              showOverlay(foreground)
              sendUserHome()
            } else {
              // Overlay já visível — atualiza o pacote exibido se mudou.
              overlayLabel?.text = overlayMessage(foreground)
            }
            currentlyBlockedPackage = foreground
          }
          else -> {
            // Launcher ou qualquer outro app não-bloqueado: NÃO esconder a overlay.
            // Ela só some quando o usuário toca em um botão ou volta ao FocusQuest.
          }
        }
      } catch (_: Throwable) {
        // ignora — pode acontecer se permissão for revogada
      }
      handler.postDelayed(this, POLL_INTERVAL_MS)
    }
  }

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onCreate() {
    super.onCreate()
    createNotificationChannel()
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    when (intent?.action) {
      ACTION_STOP -> {
        stopBlocking()
        return START_NOT_STICKY
      }
      ACTION_UPDATE_NOTIFICATION -> {
        val title = intent.getStringExtra(EXTRA_NOTIF_TITLE)
        val text = intent.getStringExtra(EXTRA_NOTIF_TEXT)
        if (title != null && text != null) updateNotification(title, text)
        return START_STICKY
      }
      else -> {
        val pkgs = intent?.getStringArrayExtra(EXTRA_PACKAGES) ?: emptyArray()
        blockedPackages = pkgs.toSet()
        currentlyBlockedPackage = null
        startForegroundIfNeeded()
        if (blockedPackages.isNotEmpty() && !running) {
          running = true
          handler.post(pollTask)
        } else if (blockedPackages.isEmpty()) {
          // Modo foco sem bloqueio — só notificação, sem poll.
          running = false
          handler.removeCallbacks(pollTask)
          hideOverlay()
        }
      }
    }
    return START_STICKY
  }

  override fun onDestroy() {
    stopBlocking()
    super.onDestroy()
  }

  private fun stopBlocking() {
    running = false
    handler.removeCallbacks(pollTask)
    blockedPackages = emptySet()
    currentlyBlockedPackage = null
    hideOverlay()
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      stopForeground(STOP_FOREGROUND_REMOVE)
    } else {
      @Suppress("DEPRECATION")
      stopForeground(true)
    }
    stopSelf()
  }

  private fun updateNotification(title: String, text: String) {
    val openAppIntent = packageManager.getLaunchIntentForPackage(packageName)?.apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
    }
    val contentPi = openAppIntent?.let {
      PendingIntent.getActivity(
        this, 0, it,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
      )
    }
    val stopIntent = Intent(this, AppBlockerService::class.java).apply { action = ACTION_STOP }
    val stopPi = PendingIntent.getService(
      this, 1, stopIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
    val notification = NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle(title)
      .setContentText(text)
      .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .setCategory(NotificationCompat.CATEGORY_SERVICE)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .addAction(0, "Encerrar foco", stopPi)
      .apply { if (contentPi != null) setContentIntent(contentPi) }
      .build()
    val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    nm.notify(NOTIFICATION_ID, notification)
  }

  private fun startForegroundIfNeeded() {
    val contentText = if (blockedPackages.isEmpty()) {
      "Sessão de foco em andamento. Toque para voltar ao FocusQuest."
    } else {
      "Bloqueando ${blockedPackages.size} app(s). Toque para voltar ao FocusQuest."
    }

    val openAppIntent = packageManager.getLaunchIntentForPackage(packageName)?.apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
    }
    val contentPi = openAppIntent?.let {
      PendingIntent.getActivity(
        this,
        0,
        it,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
      )
    }

    val stopIntent = Intent(this, AppBlockerService::class.java).apply {
      action = ACTION_STOP
    }
    val stopPi = PendingIntent.getService(
      this,
      1,
      stopIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

    val builder = NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle("Modo foco ativo")
      .setContentText(contentText)
      .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .setCategory(NotificationCompat.CATEGORY_SERVICE)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .addAction(0, "Encerrar foco", stopPi)

    if (contentPi != null) builder.setContentIntent(contentPi)

    val notification = builder.build()

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
      startForeground(
        NOTIFICATION_ID,
        notification,
        ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE,
      )
    } else {
      startForeground(NOTIFICATION_ID, notification)
    }
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    if (manager.getNotificationChannel(CHANNEL_ID) != null) return
    val channel = NotificationChannel(
      CHANNEL_ID,
      "Modo foco",
      NotificationManager.IMPORTANCE_DEFAULT,
    ).apply {
      description = "Mantém o modo foco visível enquanto a sessão estiver ativa."
      setShowBadge(true)
      setSound(null, null)
      enableVibration(false)
    }
    manager.createNotificationChannel(channel)
  }

  private fun currentForegroundPackage(): String? {
    val usm = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    val now = System.currentTimeMillis()
    val events = usm.queryEvents(now - LOOKBACK_MS, now)
    val event = UsageEvents.Event()
    var lastPackage: String? = null
    while (events.hasNextEvent()) {
      events.getNextEvent(event)
      if (event.eventType == UsageEvents.Event.ACTIVITY_RESUMED) {
        lastPackage = event.packageName
      }
    }
    return lastPackage
  }

  private fun showOverlay(blockedPackage: String) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
      !android.provider.Settings.canDrawOverlays(this)
    ) {
      return
    }

    if (overlayView != null) {
      overlayLabel?.text = overlayMessage(blockedPackage)
      return
    }

    val wm = getSystemService(Context.WINDOW_SERVICE) as WindowManager

    val root = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
      setBackgroundColor(Color.parseColor("#F00F172A"))
      setPadding(64, 64, 64, 64)
    }

    val title = TextView(this).apply {
      text = "Modo foco ativo"
      setTextColor(Color.WHITE)
      textSize = 26f
      gravity = Gravity.CENTER
    }

    val label = TextView(this).apply {
      text = overlayMessage(blockedPackage)
      setTextColor(Color.parseColor("#CBD5E1"))
      textSize = 15f
      gravity = Gravity.CENTER
      setPadding(0, 32, 0, 32)
    }
    overlayLabel = label

    val backToApp = Button(this).apply {
      text = "Voltar ao FocusQuest"
      setOnClickListener { openHostApp() }
    }

    val goHome = Button(this).apply {
      text = "Ir para a tela inicial"
      setOnClickListener {
        hideOverlay()
        sendUserHome()
      }
    }

    root.addView(title)
    root.addView(label)
    root.addView(backToApp)
    root.addView(
      View(this).apply {
        layoutParams = LinearLayout.LayoutParams(0, 16)
      },
    )
    root.addView(goHome)

    val type = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
    } else {
      @Suppress("DEPRECATION")
      WindowManager.LayoutParams.TYPE_SYSTEM_ERROR
    }

    val params = WindowManager.LayoutParams(
      WindowManager.LayoutParams.MATCH_PARENT,
      WindowManager.LayoutParams.MATCH_PARENT,
      type,
      WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
        WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
      PixelFormat.TRANSLUCENT,
    ).apply {
      gravity = Gravity.TOP or Gravity.START
    }

    try {
      wm.addView(root, params)
      overlayView = root
    } catch (_: Throwable) {
      overlayView = null
      overlayLabel = null
    }
  }

  private fun hideOverlay() {
    val view = overlayView ?: return
    overlayView = null
    overlayLabel = null
    try {
      val wm = getSystemService(Context.WINDOW_SERVICE) as WindowManager
      wm.removeView(view)
    } catch (_: Throwable) {
      // ignora se já tiver sido removida
    }
  }

  private fun overlayMessage(blockedPackage: String): String = buildString {
    append("Este app está bloqueado durante o seu modo foco.")
    append("\n\n(")
    append(blockedPackage)
    append(")")
    append("\n\nContinue se dedicando, Você consegue!")
  }

  private fun sendUserHome() {
    try {
      val home = Intent(Intent.ACTION_MAIN).apply {
        addCategory(Intent.CATEGORY_HOME)
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
      }
      startActivity(home)
    } catch (_: Throwable) {
      // ignora
    }
  }

  private fun openHostApp() {
    try {
      val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
      if (launchIntent != null) {
        launchIntent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        val pi = PendingIntent.getActivity(
          this,
          0,
          launchIntent,
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        pi.send()
      }
    } catch (_: Throwable) {
      // ignora
    } finally {
      hideOverlay()
    }
  }

  companion object {
    const val CHANNEL_ID = "focus_blocker_channel_v2"
    const val NOTIFICATION_ID = 9101
    const val EXTRA_PACKAGES = "extra_packages"
    const val EXTRA_NOTIF_TITLE = "extra_notif_title"
    const val EXTRA_NOTIF_TEXT = "extra_notif_text"
    const val ACTION_STOP = "expo.modules.appblocker.STOP"
    const val ACTION_UPDATE_NOTIFICATION = "expo.modules.appblocker.UPDATE_NOTIFICATION"
    private const val POLL_INTERVAL_MS = 800L
    private const val LOOKBACK_MS = 5000L
  }
}
