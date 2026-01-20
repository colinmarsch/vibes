import SwiftUI
import SwiftData

struct PeopleView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \Person.name) private var people: [Person]

    @State private var newName = ""
    @State private var newColor = "FFB703"

    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("People")) {
                    ForEach(people) { person in
                        HStack {
                            Circle()
                                .fill(person.color)
                                .frame(width: 12, height: 12)
                            Text(person.name)
                        }
                    }
                    .onDelete(perform: deletePeople)
                }

                Section(header: Text("Add person")) {
                    TextField("Name", text: $newName)
                    TextField("Hex color", text: $newColor)
                        .textInputAutocapitalization(.characters)
                    Button("Add") {
                        addPerson()
                    }
                    .disabled(newName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
            .navigationTitle("People")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }

    private func addPerson() {
        let trimmed = newName.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        let person = Person(name: trimmed, colorHex: newColor)
        modelContext.insert(person)
        try? modelContext.save()
        newName = ""
        newColor = "FFB703"
    }

    private func deletePeople(at offsets: IndexSet) {
        offsets.map { people[$0] }.forEach(modelContext.delete)
        try? modelContext.save()
    }
}

#Preview {
    PeopleView()
        .modelContainer(for: [Chore.self, Person.self], inMemory: true)
}
