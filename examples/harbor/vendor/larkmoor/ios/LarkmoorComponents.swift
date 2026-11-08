// Larkmoor components for SwiftUI (iOS 16+, macOS 13+). Hand-written; ships next to the generated Larkmoor.swift.
// Each component reads the theme from \.larkmoor, so .larkmoorTheme(...) switches Dark Mode and Increase Contrast.
import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

/// Posts a VoiceOver announcement (used for new error messages).
func larkmoorAnnounce(_ message: String) {
  if #available(iOS 17, macOS 14, *) {
    AccessibilityNotification.Announcement(message).post()
  } else {
    #if canImport(UIKit)
    UIAccessibility.post(notification: .announcement, argument: message)
    #endif
  }
}

// MARK: - Field

/// A labelled text field with an optional hint and error. The label is always visible above the input;
/// VoiceOver reads it as the field's label, then the error and hint. A new error is announced once.
public struct LarkmoorField: View {
  let label: String
  let hint: String?
  let error: String?
  let optional: Bool
  let secure: Bool
  let prompt: String?
  @Binding var text: String
  @FocusState private var focused: Bool
  @Environment(\.larkmoor) private var theme

  public init(_ label: String, text: Binding<String>, hint: String? = nil, error: String? = nil,
              optional: Bool = false, secure: Bool = false, prompt: String? = nil) {
    self.label = label; self._text = text; self.hint = hint; self.error = error
    self.optional = optional; self.secure = secure; self.prompt = prompt
  }

  public var body: some View {
    let c = theme.colors
    VStack(alignment: .leading, spacing: Larkmoor.Space.s2) {
      (Text(label).foregroundColor(c.text) + Text(optional ? " (optional)" : "").foregroundColor(c.textMuted))
        .larkmoorText(theme.caption)
        .fontWeight(.medium)
        .accessibilityHidden(true)
      if let hint {
        Text(hint).larkmoorText(theme.caption).foregroundStyle(c.textSecondary).accessibilityHidden(true)
      }
      input
        .larkmoorText(theme.body)
        .foregroundStyle(c.text)
        .padding(.horizontal, Larkmoor.Space.s4)
        .frame(minHeight: max(Larkmoor.Size.control, Larkmoor.Size.target))
        .background(RoundedRectangle(cornerRadius: Larkmoor.Radius.md).fill(c.surface))
        .overlay(
          RoundedRectangle(cornerRadius: Larkmoor.Radius.md)
            .strokeBorder(error != nil ? c.danger : focused ? c.focus : c.borderStrong, lineWidth: error != nil || focused ? 2 : 1)
        )
        .focused($focused)
        .accessibilityLabel(optional ? "\(label), optional" : label)
        .accessibilityHint([error.map { "Error: \($0)" }, hint].compactMap { $0 }.joined(separator: ". "))
      if let error {
        HStack(alignment: .firstTextBaseline, spacing: Larkmoor.Space.s2) {
          Image(systemName: "exclamationmark.circle.fill")
          Text(error)
        }
        .larkmoorText(theme.caption)
        .foregroundStyle(c.danger)
        .accessibilityHidden(true)
      }
    }
    .onChange(of: error) { newValue in
      if let newValue { larkmoorAnnounce(newValue) }
    }
  }

  @ViewBuilder private var input: some View {
    if secure {
      SecureField(label, text: $text, prompt: prompt.map { Text($0) })
    } else {
      TextField(label, text: $text, prompt: prompt.map { Text($0) })
    }
  }
}

// MARK: - Segmented control

/// Two to five options that switch a view immediately. Each segment is a button with the Selected trait,
/// and VoiceOver reads "Name, Selected, 1 of 3". Every segment is at least 44pt tall.
public struct LarkmoorSegmentedControl<Value: Hashable>: View {
  public struct Option {
    public let value: Value
    public let label: String
    public init(_ value: Value, _ label: String) { self.value = value; self.label = label }
  }

  let label: String
  let options: [Option]
  @Binding var selection: Value
  @Environment(\.larkmoor) private var theme
  @Environment(\.accessibilityReduceMotion) private var reduceMotion
  @Namespace private var thumb

  public init(_ label: String, options: [Option], selection: Binding<Value>) {
    self.label = label; self.options = options; self._selection = selection
  }

  public var body: some View {
    let c = theme.colors
    HStack(spacing: 0) {
      ForEach(Array(options.enumerated()), id: \.offset) { index, option in
        let selected = option.value == selection
        Button {
          withAnimation(reduceMotion ? nil : Larkmoor.Motion.standard) { selection = option.value }
        } label: {
          Text(option.label)
            .larkmoorText(theme.caption)
            .fontWeight(.medium)
            .lineLimit(1)
            .minimumScaleFactor(0.85)
            .foregroundStyle(selected ? c.onAction : c.text)
            .padding(.horizontal, Larkmoor.Space.s2)
            .frame(maxWidth: .infinity, minHeight: Larkmoor.Size.target)
            .background {
              if selected { Capsule().fill(c.action).matchedGeometryEffect(id: "thumb", in: thumb) }
            }
            .contentShape(Capsule())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(option.label)
        .accessibilityValue("\(index + 1) of \(options.count)")
        .accessibilityAddTraits(selected ? .isSelected : [])
      }
    }
    .padding(Larkmoor.Space.s1)
    .background(Capsule().fill(c.controlTrack))
    .overlay(Capsule().strokeBorder(c.border, lineWidth: 1))
    .accessibilityElement(children: .contain)
    .accessibilityLabel(label)
  }
}

// MARK: - Accordion

/// Optional detail people can skip. The header is a button whose value is "Expanded" or "Collapsed";
/// the content appears below it. Pass isExpanded to control it, or leave it out to let it manage itself.
public struct LarkmoorAccordion<Content: View>: View {
  let title: String
  let external: Binding<Bool>?
  let content: Content
  @State private var internalExpanded: Bool
  @Environment(\.larkmoor) private var theme
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(_ title: String, isExpanded: Binding<Bool>? = nil, initiallyExpanded: Bool = false, @ViewBuilder content: () -> Content) {
    self.title = title; self.external = isExpanded; self.content = content()
    self._internalExpanded = State(initialValue: initiallyExpanded)
  }

  private var expanded: Bool { external?.wrappedValue ?? internalExpanded }

  private func toggle() {
    withAnimation(reduceMotion ? nil : Larkmoor.Motion.standard) {
      if let external { external.wrappedValue.toggle() } else { internalExpanded.toggle() }
    }
  }

  public var body: some View {
    let c = theme.colors
    VStack(alignment: .leading, spacing: 0) {
      Button(action: toggle) {
        HStack(alignment: .firstTextBaseline, spacing: Larkmoor.Space.s5) {
          Text(title)
            .larkmoorText(theme.body)
            .fontWeight(.medium)
            .foregroundStyle(c.text)
            .multilineTextAlignment(.leading)
            .frame(maxWidth: .infinity, alignment: .leading)
          Image(systemName: "plus")
            .foregroundStyle(c.textMuted)
            .rotationEffect(.degrees(expanded ? 45 : 0))
            .accessibilityHidden(true)
        }
        .padding(.vertical, Larkmoor.Space.s4)
        .frame(minHeight: Larkmoor.Size.target)
        .contentShape(Rectangle())
      }
      .buttonStyle(.plain)
      .accessibilityValue(expanded ? "Expanded" : "Collapsed")
      if expanded {
        content
          .padding(.bottom, Larkmoor.Space.s5)
          .transition(.opacity)
      }
    }
    .overlay(alignment: .bottom) { Rectangle().fill(c.borderStrong).frame(height: 1).accessibilityHidden(true) }
  }
}
