# iOS App Scaffold

This folder contains a minimal placeholder structure for an Xcode iOS app target.

## Suggested Xcode setup
1. Open Xcode and create a new iOS App project named `PlanApp` in this directory.
2. Use bundle identifier: `com.example.planapp`.
3. Add the Kotlin framework from `../shared` using Gradle task output.
4. Configure signing with your Apple Developer Team.

## TestFlight readiness checklist
- Increment `CFBundleVersion` and `CFBundleShortVersionString` each release.
- Set distribution provisioning profile for App Store distribution.
- Archive in **Release** configuration.
- Upload archive to App Store Connect and enable TestFlight internal testing.
