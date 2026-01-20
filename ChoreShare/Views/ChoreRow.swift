import SwiftUI

struct ChoreRow: View {
    let chore: Chore

    var body: some View {
        HStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 8) {
                Text(chore.title)
                    .font(.headline.weight(.semibold))
                    .foregroundStyle(Color(hex: "1E1E32"))

                HStack(spacing: 8) {
                    Label(chore.frequencyDescription, systemImage: "repeat")
                        .font(.caption)
                        .foregroundStyle(Color(hex: "5B5B7A"))

                    if let assignee = chore.assignee {
                        Label(assignee.name, systemImage: "person.fill")
                            .font(.caption)
                            .foregroundStyle(assignee.color)
                    }
                }
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 6) {
                if let dueDate = chore.nextDueDate {
                    Text(dueDate, style: .date)
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(chore.isOverdue ? Color(hex: "EF476F") : Color(hex: "1E1E32"))
                    Text(chore.isOverdue ? "Overdue" : "Due next")
                        .font(.caption)
                        .foregroundStyle(Color(hex: "5B5B7A"))
                } else {
                    Text("No schedule")
                        .font(.subheadline)
                        .foregroundStyle(Color(hex: "5B5B7A"))
                }
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(Color.white)
                .shadow(color: Color.black.opacity(0.07), radius: 10, x: 0, y: 6)
        )
    }
}

#Preview {
    let chore = Chore(title: "Deep clean kitchen", notes: "", frequencyValue: 2, frequencyUnit: .week)
    return ChoreRow(chore: chore)
        .padding()
        .background(Color.gray.opacity(0.1))
}
