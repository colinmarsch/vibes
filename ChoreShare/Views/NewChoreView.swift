import SwiftUI
import SwiftData

struct NewChoreView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \Person.name) private var people: [Person]

    private let existingChore: Chore?

    @State private var title: String
    @State private var notes: String
    @State private var frequencyValue: Int
    @State private var frequencyUnit: FrequencyUnit
    @State private var selectedPerson: Person?

    init(people: [Person] = [], existingChore: Chore? = nil) {
        self.existingChore = existingChore
        _title = State(initialValue: existingChore?.title ?? "")
        _notes = State(initialValue: existingChore?.notes ?? "")
        _frequencyValue = State(initialValue: existingChore?.frequencyValue ?? 1)
        _frequencyUnit = State(initialValue: existingChore?.frequencyUnit ?? .week)
        _selectedPerson = State(initialValue: existingChore?.assignee)
    }

    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("Chore")) {
                    TextField("Title", text: $title)
                    TextField("Notes", text: $notes, axis: .vertical)
                }

                Section(header: Text("Schedule")) {
                    HStack {
                        Stepper(value: $frequencyValue, in: 1...12) {
                            Text("Every \(frequencyValue)")
                        }
                        Spacer()
                        Picker("Unit", selection: $frequencyUnit) {
                            ForEach(FrequencyUnit.allCases, id: \.self) { unit in
                                Text(unit.label).tag(unit)
                            }
                        }
                        .pickerStyle(.menu)
                    }
                }

                Section(header: Text("Assigned to")) {
                    Picker("Person", selection: $selectedPerson) {
                        Text("Unassigned").tag(Person?.none)
                        ForEach(people) { person in
                            HStack {
                                Circle()
                                    .fill(person.color)
                                    .frame(width: 10, height: 10)
                                Text(person.name)
                            }
                            .tag(Optional(person))
                        }
                    }
                }
            }
            .navigationTitle(existingChore == nil ? "New chore" : "Edit chore")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        saveChore()
                    }
                    .disabled(title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
    }

    private func saveChore() {
        let trimmedTitle = title.trimmingCharacters(in: .whitespacesAndNewlines)
        if let chore = existingChore {
            chore.title = trimmedTitle
            chore.notes = notes
            chore.frequencyValue = frequencyValue
            chore.frequencyUnit = frequencyUnit
            chore.assignee = selectedPerson
        } else {
            let chore = Chore(
                title: trimmedTitle,
                notes: notes,
                frequencyValue: frequencyValue,
                frequencyUnit: frequencyUnit,
                assignee: selectedPerson
            )
            modelContext.insert(chore)
        }
        try? modelContext.save()
        dismiss()
    }
}

#Preview {
    NewChoreView()
        .modelContainer(for: [Chore.self, Person.self], inMemory: true)
}
