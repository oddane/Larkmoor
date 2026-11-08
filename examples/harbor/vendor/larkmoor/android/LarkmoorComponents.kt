// Larkmoor components for Jetpack Compose. Hand-written; ships next to the generated LarkmoorTokens.kt and LarkmoorTheme.kt.
// Each component reads LocalLarkmoor, so LarkmoorTheme(...) switches dark mode and high contrast.
package design.larkmoor.compose

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.collapse
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.expand
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import design.larkmoor.LarkmoorTokens
import kotlin.math.max

// ---------------- Field ----------------

/**
 * A labelled text field with an optional hint and error. The label stays visible above the input.
 * TalkBack reads the label (and hint) as the field's description, reports the error with the field,
 * and announces a new error once through a polite live region.
 */
@Composable
fun LarkmoorField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    hint: String? = null,
    error: String? = null,
    optional: Boolean = false,
    singleLine: Boolean = true,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
) {
    val t = LocalLarkmoor.current
    val c = t.colors
    var focused by remember { mutableStateOf(false) }
    val borderColor = when {
        error != null -> Color(c.danger)
        focused -> Color(c.focus)
        else -> Color(c.borderStrong)
    }
    val shape = RoundedCornerShape(LarkmoorTokens.RADIUS_MD.dp)
    val description = buildString {
        append(label)
        if (optional) append(", optional")
        if (hint != null) append(". ").append(hint)
    }
    Column(modifier, verticalArrangement = Arrangement.spacedBy(LarkmoorTokens.SPACE_2.dp)) {
        Text(
            buildAnnotatedString {
                append(label)
                if (optional) withStyle(SpanStyle(color = Color(c.textMuted), fontWeight = FontWeight.Normal)) { append(" (optional)") }
            },
            style = t.textStyle("caption").copy(fontWeight = FontWeight.Medium),
            color = Color(c.text),
            modifier = Modifier.clearAndSetSemantics { },
        )
        if (hint != null) {
            Text(hint, style = t.textStyle("caption"), color = Color(c.textSecondary), modifier = Modifier.clearAndSetSemantics { })
        }
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            singleLine = singleLine,
            textStyle = t.textStyle("body").copy(color = Color(c.text)),
            cursorBrush = SolidColor(Color(c.text)),
            visualTransformation = visualTransformation,
            keyboardOptions = keyboardOptions,
            modifier = Modifier
                .fillMaxWidth()
                .onFocusChanged { focused = it.isFocused }
                .semantics {
                    contentDescription = description
                    if (error != null) error(error)
                },
            decorationBox = { inner ->
                Box(
                    Modifier
                        .fillMaxWidth()
                        .heightIn(min = max(LarkmoorTokens.CONTROL, LarkmoorTokens.TARGET).dp)
                        .background(Color(c.surface), shape)
                        .border(if (error != null || focused) 2.dp else 1.dp, borderColor, shape)
                        .padding(horizontal = LarkmoorTokens.SPACE_4.dp),
                    contentAlignment = Alignment.CenterStart,
                ) { inner() }
            },
        )
        if (error != null) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(LarkmoorTokens.SPACE_2.dp),
                verticalAlignment = Alignment.Top,
                modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
            ) {
                Box(
                    Modifier.padding(top = 2.dp).size(16.dp).background(Color(c.danger), CircleShape).clearAndSetSemantics { },
                    contentAlignment = Alignment.Center,
                ) { Text("!", color = Color(c.surface), style = t.textStyle("label").copy(fontWeight = FontWeight.Bold)) }
                Text(error, style = t.textStyle("caption"), color = Color(c.danger))
            }
        }
    }
}

// ---------------- Segmented control ----------------

/**
 * Two to five options that switch a view immediately. A radio group to TalkBack ("Name, radio button,
 * selected"); every segment is at least 48dp tall.
 */
@Composable
fun <T> LarkmoorSegmentedControl(
    label: String,
    options: List<Pair<T, String>>,
    selected: T,
    onSelect: (T) -> Unit,
    modifier: Modifier = Modifier,
) {
    val t = LocalLarkmoor.current
    val c = t.colors
    val pill = RoundedCornerShape(percent = 50)
    Row(
        modifier
            .fillMaxWidth()
            .clip(pill)
            .background(Color(c.controlTrack))
            .border(1.dp, Color(c.border), pill)
            .padding(LarkmoorTokens.SPACE_1.dp)
            .semantics { contentDescription = label }
            .selectableGroup(),
    ) {
        options.forEach { (value, text) ->
            val isSelected = value == selected
            val fill by animateColorAsState(if (isSelected) Color(c.action) else Color.Transparent, label = "segment")
            Box(
                Modifier
                    .weight(1f)
                    .heightIn(min = LarkmoorTokens.TARGET.dp)
                    .clip(pill)
                    .background(fill)
                    .selectable(selected = isSelected, role = Role.RadioButton, onClick = { onSelect(value) })
                    .padding(horizontal = LarkmoorTokens.SPACE_2.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text,
                    style = t.textStyle("caption").copy(fontWeight = FontWeight.Medium),
                    color = if (isSelected) Color(c.onAction) else Color(c.text),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
}

// ---------------- Accordion ----------------

/**
 * Optional detail people can skip. The header is a button with an "Expanded"/"Collapsed" state and
 * TalkBack expand/collapse actions; the content appears below it.
 */
@Composable
fun LarkmoorAccordion(
    title: String,
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val t = LocalLarkmoor.current
    val c = t.colors
    val line = Color(c.borderStrong)
    Column(
        modifier
            .fillMaxWidth()
            .drawBehind { drawLine(line, Offset(0f, size.height - 0.5f), Offset(size.width, size.height - 0.5f), strokeWidth = 1.dp.toPx()) },
    ) {
        Row(
            Modifier
                .fillMaxWidth()
                .heightIn(min = LarkmoorTokens.TARGET.dp)
                .clickable(role = Role.Button, onClickLabel = if (expanded) "Collapse" else "Expand") { onExpandedChange(!expanded) }
                .semantics {
                    stateDescription = if (expanded) "Expanded" else "Collapsed"
                    if (expanded) collapse { onExpandedChange(false); true } else expand { onExpandedChange(true); true }
                }
                .padding(vertical = LarkmoorTokens.SPACE_4.dp),
            horizontalArrangement = Arrangement.spacedBy(LarkmoorTokens.SPACE_5.dp),
            verticalAlignment = Alignment.Top,
        ) {
            Text(title, Modifier.weight(1f), style = t.textStyle("body").copy(fontWeight = FontWeight.Medium), color = Color(c.text))
            Text("+", Modifier.rotate(if (expanded) 45f else 0f).clearAndSetSemantics { }, style = t.textStyle("body"), color = Color(c.textMuted))
        }
        AnimatedVisibility(visible = expanded, enter = fadeIn() + expandVertically(), exit = fadeOut() + shrinkVertically()) {
            Box(Modifier.padding(bottom = LarkmoorTokens.SPACE_5.dp)) { content() }
        }
    }
}

/** Accordion that manages its own expanded state (kept across configuration changes). */
@Composable
fun LarkmoorAccordion(title: String, modifier: Modifier = Modifier, initiallyExpanded: Boolean = false, content: @Composable () -> Unit) {
    var expanded by rememberSaveable { mutableStateOf(initiallyExpanded) }
    LarkmoorAccordion(title, expanded, { expanded = it }, modifier, content)
}
