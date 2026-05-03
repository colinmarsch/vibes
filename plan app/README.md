# Plan App (Kotlin Multiplatform Scaffold)

This scaffold prepares a blank Kotlin Multiplatform setup with:
- `shared` KMP module targeting Android + iOS frameworks
- `androidApp` Android application module
- `iosApp` placeholder structure and TestFlight publishing notes

## Build commands

From this folder:

- Android debug build:
  - `./gradlew :androidApp:assembleDebug`
- iOS framework build:
  - `./gradlew :shared:linkDebugFrameworkIosSimulatorArm64`

## Next steps

1. Add a Gradle wrapper (`gradle wrapper`) if not already present.
2. Open `iosApp` in Xcode and create full project/workspace.
3. Configure signing and capabilities for TestFlight/App Store Connect.
