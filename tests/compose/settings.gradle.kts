// Compiles dist/android (tokens + Compose theme) on the JVM with Compose Multiplatform, which ships the same
// androidx.compose.* APIs as Android. CI only: proves the generated Kotlin compiles against real Compose.
pluginManagement { repositories { gradlePluginPortal(); google(); mavenCentral() } }
dependencyResolutionManagement { repositories { google(); mavenCentral() } }
rootProject.name = "larkmoor-compose-check"
