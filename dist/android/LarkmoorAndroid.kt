// Larkmoor helpers that need the Android SDK (not Compose). Hand-written; ships in dist/android.
package design.larkmoor.android

import android.app.UiModeManager
import android.content.Context
import android.os.Build

/**
 * True when the person has asked Android for more contrast: Settings → Accessibility → Colour and motion →
 * Contrast level set to Medium or High (Android 14, API 34+). Returns false on older versions.
 *
 * Compose: LarkmoorTheme(highContrast = LocalContext.current.prefersHighContrast()) { App() }
 * The value is read once per call; read it again in onResume or with addContrastChangeListener to follow changes.
 */
fun Context.prefersHighContrast(threshold: Float = 0.5f): Boolean {
    if (Build.VERSION.SDK_INT < 34) return false
    val uiMode = getSystemService(Context.UI_MODE_SERVICE) as? UiModeManager ?: return false
    return uiMode.contrast >= threshold
}
