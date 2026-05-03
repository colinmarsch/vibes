import SwiftUI
import Security

struct Goal: Codable, Identifiable {
    let id: UUID
    let title: String
    let summary: String
    let context: String

    init(id: UUID = UUID(), title: String, summary: String, context: String) {
        self.id = id
        self.title = title
        self.summary = summary
        self.context = context
    }
}

struct ContentView: View {
    @State private var apiKey: String = ""
    @State private var statusMessage: String = ""
    @State private var hasAuthenticated = false

    @State private var goals: [Goal] = []
    @State private var showingCreateGoalSheet = false
    @State private var newGoalTitle = ""
    @State private var newGoalSummary = ""
    @State private var newGoalContext = ""

    var body: some View {
        Group {
            if hasAuthenticated {
                goalsView
            } else {
                authView
            }
        }
        .padding()
        .onAppear {
            if let existingKey = KeychainHelper.shared.readApiKey(), !existingKey.isEmpty {
                apiKey = existingKey
                statusMessage = "Existing API key loaded."
                hasAuthenticated = true
            }

            loadGoals()
        }
        .sheet(isPresented: $showingCreateGoalSheet) {
            NavigationStack {
                Form {
                    Section("Goal details") {
                        TextField("Goal title", text: $newGoalTitle)
                        TextField("Brief summary", text: $newGoalSummary)
                    }

                    Section("Context") {
                        TextField(
                            "Context (files, images, notes, etc.)",
                            text: $newGoalContext,
                            axis: .vertical
                        )
                        .lineLimit(3...8)
                    }
                }
                .navigationTitle("Create goal")
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Cancel") {
                            clearDraftGoal()
                            showingCreateGoalSheet = false
                        }
                    }

                    ToolbarItem(placement: .confirmationAction) {
                        Button("Save") {
                            saveGoalFromDraft()
                        }
                        .disabled(newGoalTitle.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                    }
                }
            }
        }
    }

    private var authView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Enter your OpenAI API key")
                .font(.title2)
                .fontWeight(.bold)

            SecureField("sk-...", text: $apiKey)
                .textFieldStyle(.roundedBorder)

            Button("Save key") {
                let trimmed = apiKey.trimmingCharacters(in: .whitespacesAndNewlines)
                guard !trimmed.isEmpty else {
                    statusMessage = "Please enter an API key."
                    return
                }

                let success = KeychainHelper.shared.saveApiKey(trimmed)
                if success {
                    statusMessage = "API key saved securely."
                    hasAuthenticated = true
                } else {
                    statusMessage = "Unable to save API key."
                }
            }
            .buttonStyle(.borderedProminent)

            if !statusMessage.isEmpty {
                Text(statusMessage)
                    .foregroundStyle(.secondary)
            }

            Spacer()
        }
    }

    private var goalsView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Your goals")
                .font(.title2)
                .fontWeight(.bold)

            if goals.isEmpty {
                Text("No goals yet. Create your first goal to get started.")
                    .foregroundStyle(.secondary)
            } else {
                List(goals) { goal in
                    VStack(alignment: .leading, spacing: 6) {
                        Text(goal.title)
                            .font(.headline)
                        if !goal.summary.isEmpty {
                            Text(goal.summary)
                                .font(.subheadline)
                        }
                        if !goal.context.isEmpty {
                            Text(goal.context)
                                .font(.footnote)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.vertical, 4)
                }
                .listStyle(.plain)
            }

            Button("Create new goal") {
                showingCreateGoalSheet = true
            }
            .buttonStyle(.borderedProminent)
        }
    }

    private func saveGoalFromDraft() {
        let title = newGoalTitle.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !title.isEmpty else {
            return
        }

        goals.append(
            Goal(
                title: title,
                summary: newGoalSummary.trimmingCharacters(in: .whitespacesAndNewlines),
                context: newGoalContext.trimmingCharacters(in: .whitespacesAndNewlines)
            )
        )
        persistGoals()
        clearDraftGoal()
        showingCreateGoalSheet = false
    }

    private func clearDraftGoal() {
        newGoalTitle = ""
        newGoalSummary = ""
        newGoalContext = ""
    }

    private func persistGoals() {
        guard let data = try? JSONEncoder().encode(goals) else {
            return
        }
        UserDefaults.standard.set(data, forKey: "saved_goals")
    }

    private func loadGoals() {
        guard let data = UserDefaults.standard.data(forKey: "saved_goals"),
              let decoded = try? JSONDecoder().decode([Goal].self, from: data) else {
            goals = []
            return
        }
        goals = decoded
    }
}

private final class KeychainHelper {
    static let shared = KeychainHelper()
    private let service = "com.example.planapp"
    private let account = "openai_api_key"

    func saveApiKey(_ apiKey: String) -> Bool {
        guard let data = apiKey.data(using: .utf8) else {
            return false
        }

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account
        ]

        SecItemDelete(query as CFDictionary)

        let attributes: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        ]

        return SecItemAdd(attributes as CFDictionary, nil) == errSecSuccess
    }

    func readApiKey() -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecReturnData as String: kCFBooleanTrue as Any,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        guard status == errSecSuccess,
              let data = item as? Data,
              let apiKey = String(data: data, encoding: .utf8) else {
            return nil
        }

        return apiKey
    }
}
