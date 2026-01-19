import Foundation
import SwiftData
import SwiftUI

@Model
final class Chore {
    var title: String
    var notes: String
    var frequencyValue: Int
    var frequencyUnit: FrequencyUnit
    var lastCompletedAt: Date?
    var createdAt: Date
    var assignee: Person?

    init(
        title: String,
        notes: String = "",
        frequencyValue: Int = 1,
        frequencyUnit: FrequencyUnit = .week,
        lastCompletedAt: Date? = nil,
        createdAt: Date = Date(),
        assignee: Person? = nil
    ) {
        self.title = title
        self.notes = notes
        self.frequencyValue = frequencyValue
        self.frequencyUnit = frequencyUnit
        self.lastCompletedAt = lastCompletedAt
        self.createdAt = createdAt
        self.assignee = assignee
    }

    var frequencyDescription: String {
        switch frequencyUnit {
        case .week:
            return frequencyValue == 1 ? "Every week" : "Every \(frequencyValue) weeks"
        case .month:
            return frequencyValue == 1 ? "Every month" : "Every \(frequencyValue) months"
        }
    }

    var nextDueDate: Date? {
        let calendar = Calendar.current
        let baseDate = lastCompletedAt ?? createdAt
        switch frequencyUnit {
        case .week:
            return calendar.date(byAdding: .weekOfYear, value: frequencyValue, to: baseDate)
        case .month:
            return calendar.date(byAdding: .month, value: frequencyValue, to: baseDate)
        }
    }

    var isOverdue: Bool {
        guard let nextDueDate else { return false }
        return nextDueDate < Date()
    }
}

enum FrequencyUnit: String, CaseIterable, Codable {
    case week
    case month

    var label: String {
        switch self {
        case .week: return "Week(s)"
        case .month: return "Month(s)"
        }
    }
}

@Model
final class Person {
    var name: String
    var colorHex: String

    init(name: String, colorHex: String) {
        self.name = name
        self.colorHex = colorHex
    }

    var color: Color {
        Color(hex: colorHex)
    }
}
