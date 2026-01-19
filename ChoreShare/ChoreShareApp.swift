import SwiftUI
import SwiftData

@main
struct ChoreShareApp: App {
    private var sharedModelContainer: ModelContainer = {
        let schema = Schema([Chore.self, Person.self])
        let configuration = ModelConfiguration(
            schema: schema,
            cloudKitDatabase: .public("iCloud.com.example.ChoreShare")
        )

        return try! ModelContainer(for: schema, configurations: [configuration])
    }()

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(sharedModelContainer)
    }
}
