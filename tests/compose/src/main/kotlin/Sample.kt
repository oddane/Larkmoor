// Exercises the public Compose API the way an app would. Compiled in CI, never shipped.
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.material3.Text
import design.larkmoor.compose.LarkmoorAccordion
import design.larkmoor.compose.LarkmoorField
import design.larkmoor.compose.LarkmoorSegmentedControl
import design.larkmoor.compose.LarkmoorTheme

@Composable
fun Sample(highContrast: Boolean) {
    LarkmoorTheme(lightTheme = "harbor", darkTheme = "harbor-dark", highContrast = highContrast) {
        var email by remember { mutableStateOf("") }
        var view by remember { mutableStateOf("list") }
        Column {
            LarkmoorField(email, { email = it }, label = "Email", hint = "We only use it for receipts", error = if (email.isEmpty()) "Enter your email" else null)
            LarkmoorSegmentedControl("View", listOf("list" to "List", "grid" to "Grid"), view, { view = it })
            LarkmoorAccordion("Opening hours") { Text("9 to 5") }
        }
    }
}
