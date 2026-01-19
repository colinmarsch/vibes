import SwiftUI
import SwiftData

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \Chore.createdAt) private var chores: [Chore]
    @Query(sort: \Person.name) private var people: [Person]

    @State private var showNewChore = false
    @State private var showPeople = false

    private var orderedChores: [Chore] {
        chores.sorted {
            let left = $0.nextDueDate ?? Date.distantFuture
            let right = $1.nextDueDate ?? Date.distantFuture
            if left == right {
                return $0.title < $1.title
            }
            return left < right
        }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                LinearGradient(
                    colors: [Color(hex: "F6F6FF"), Color(hex: "EEF2FF")],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        header

                        if orderedChores.isEmpty {
                            emptyState
                        } else {
                            VStack(spacing: 12) {
                                ForEach(orderedChores) { chore in
                                    NavigationLink {
                                        ChoreDetailView(chore: chore)
                                    } label: {
                                        ChoreRow(chore: chore)
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 24)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("People") {
                        showPeople = true
                    }
                    .font(.subheadline.weight(.semibold))
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showNewChore = true
                    } label: {
                        Image(systemName: "plus")
                            .font(.headline.weight(.bold))
                            .foregroundStyle(.white)
                            .padding(10)
                            .background(Circle().fill(Color(hex: "5A5BFF")))
                            .shadow(color: Color.black.opacity(0.12), radius: 6, x: 0, y: 4)
                    }
                }
            }
            .sheet(isPresented: $showNewChore) {
                NewChoreView(people: people)
            }
            .sheet(isPresented: $showPeople) {
                PeopleView()
            }
            .onAppear(perform: seedPeopleIfNeeded)
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("ChoreShare")
                .font(.largeTitle.weight(.bold))
                .foregroundStyle(Color(hex: "1E1E32"))

            Text("Stay effortlessly on top of what needs doing together.")
                .font(.callout)
                .foregroundStyle(Color(hex: "5B5B7A"))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.top, 8)
    }

    private var emptyState: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Start by adding your first chore.")
                .font(.title3.weight(.semibold))
                .foregroundStyle(Color(hex: "1E1E32"))

            Text("Track recurring tasks, assign them to a person, and see the latest completion date at a glance.")
                .font(.body)
                .foregroundStyle(Color(hex: "5B5B7A"))

            Button {
                showNewChore = true
            } label: {
                Text("Add a chore")
                    .font(.headline)
                    .foregroundStyle(.white)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 12)
                    .background(RoundedRectangle(cornerRadius: 16).fill(Color(hex: "5A5BFF")))
            }
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(Color.white)
                .shadow(color: Color.black.opacity(0.08), radius: 12, x: 0, y: 8)
        )
    }

    private func seedPeopleIfNeeded() {
        guard people.isEmpty else { return }
        let defaults = [
            Person(name: "You", colorHex: "FFB703"),
            Person(name: "Partner", colorHex: "8ECAE6")
        ]
        defaults.forEach { modelContext.insert($0) }
    }
}

#Preview {
    ContentView()
        .modelContainer(for: [Chore.self, Person.self], inMemory: true)
}
