import SwiftUI
import SwiftData

struct ChoreDetailView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var showEdit = false

    let chore: Chore

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                detailHeader
                detailCard

                if !chore.notes.isEmpty {
                    Text(chore.notes)
                        .font(.body)
                        .foregroundStyle(Color(hex: "3E3E5B"))
                        .padding(.horizontal, 4)
                }

                Button {
                    chore.lastCompletedAt = Date()
                    try? modelContext.save()
                } label: {
                    HStack {
                        Image(systemName: "checkmark.circle.fill")
                        Text("Mark as completed")
                    }
                    .font(.headline)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(RoundedRectangle(cornerRadius: 18).fill(Color(hex: "5A5BFF")))
                }
            }
            .padding(20)
        }
        .background(Color(hex: "F6F6FF"))
        .navigationTitle("Chore details")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Edit") {
                    showEdit = true
                }
            }
        }
        .sheet(isPresented: $showEdit) {
            NewChoreView(existingChore: chore)
        }
    }

    private var detailHeader: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(chore.title)
                .font(.largeTitle.weight(.bold))
                .foregroundStyle(Color(hex: "1E1E32"))

            if let assignee = chore.assignee {
                HStack(spacing: 8) {
                    Circle()
                        .fill(assignee.color)
                        .frame(width: 10, height: 10)
                    Text("Assigned to \(assignee.name)")
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(Color(hex: "5B5B7A"))
                }
            }
        }
    }

    private var detailCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            detailRow(label: "Frequency", value: chore.frequencyDescription)
            detailRow(label: "Last completed", value: chore.lastCompletedAt.map { $0.formatted(date: .abbreviated, time: .omitted) } ?? "Not yet")
            detailRow(label: "Next due", value: chore.nextDueDate.map { $0.formatted(date: .abbreviated, time: .omitted) } ?? "Not scheduled")
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 22)
                .fill(Color.white)
                .shadow(color: Color.black.opacity(0.08), radius: 12, x: 0, y: 8)
        )
    }

    private func detailRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .font(.callout)
                .foregroundStyle(Color(hex: "5B5B7A"))
            Spacer()
            Text(value)
                .font(.callout.weight(.semibold))
                .foregroundStyle(Color(hex: "1E1E32"))
        }
    }
}

#Preview {
    let chore = Chore(
        title: "Laundry",
        notes: "Separate colors.",
        frequencyValue: 1,
        frequencyUnit: .week,
        lastCompletedAt: Date().addingTimeInterval(-86400)
    )
    return NavigationStack {
        ChoreDetailView(chore: chore)
    }
}
