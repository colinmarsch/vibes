import SwiftUI
import Security

struct ContentView: View {
    @State private var apiKey: String = ""
    @State private var statusMessage: String = ""

    var body: some View {
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
                statusMessage = success ? "API key saved securely." : "Unable to save API key."
            }
            .buttonStyle(.borderedProminent)

            if !statusMessage.isEmpty {
                Text(statusMessage)
                    .foregroundStyle(.secondary)
            }

            Spacer()
        }
        .padding()
        .onAppear {
            if let existingKey = KeychainHelper.shared.readApiKey(), !existingKey.isEmpty {
                apiKey = existingKey
                statusMessage = "Existing API key loaded."
            }
        }
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
