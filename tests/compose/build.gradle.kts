plugins {
    kotlin("jvm") version "2.1.0"
    kotlin("plugin.compose") version "2.1.0"
    id("org.jetbrains.compose") version "1.7.3"
}
kotlin { jvmToolchain(17) }
sourceSets { main { kotlin.srcDir("../../dist/android"); kotlin.exclude("**/LarkmoorAndroid.kt") } }  // LarkmoorAndroid.kt needs android.jar: CI compiles it separately
dependencies {
    implementation(compose.desktop.currentOs)
    implementation(compose.material3)
}
