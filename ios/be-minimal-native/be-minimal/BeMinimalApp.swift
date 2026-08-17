import SwiftUI
import Photos

@main
struct BeMinimalApp: App {
    var body: some Scene {
        WindowGroup {
            AppLaunchRoot()
        }
    }
}

private struct AppLaunchRoot: View {
    @AppStorage("gekko.tutorial.completed") private var tutorialCompleted = false
    @AppStorage("gekko.tutorial.migration.checked") private var migrationChecked = false

    @State private var didResolveMigration = false
    @State private var requestAccessAfterTutorial = false

    var body: some View {
        Group {
            if didResolveMigration {
                if tutorialCompleted {
                    PhotoAppContainer(requestAccessOnAppear: requestAccessAfterTutorial)
                } else {
                    TutorialExperienceView(
                        onFinish: { finishTutorial(requestAccess: true) },
                        onSkip: { finishTutorial(requestAccess: false) }
                    )
                }
            } else {
                LaunchBackground()
            }
        }
        .onAppear(perform: resolveMigration)
    }

    private func resolveMigration() {
        guard !didResolveMigration else { return }

        if !migrationChecked {
            // Do not surprise existing installs with a newly-added tutorial.
            // Reading authorization status does not request permission or fetch Photos assets.
            if PHPhotoLibrary.authorizationStatus(for: .readWrite) != .notDetermined {
                tutorialCompleted = true
            }
            migrationChecked = true
        }

        didResolveMigration = true
    }

    private func finishTutorial(requestAccess: Bool) {
        requestAccessAfterTutorial = requestAccess
        tutorialCompleted = true
    }
}

private struct PhotoAppContainer: View {
    @StateObject private var library = PhotoLibraryStore()
    let requestAccessOnAppear: Bool

    @State private var didRequestAccess = false

    var body: some View {
        ContentView()
            .environmentObject(library)
            .preferredColorScheme(.light)
            .task {
                guard requestAccessOnAppear,
                      !didRequestAccess,
                      library.authorizationStatus == .notDetermined else { return }
                didRequestAccess = true
                await library.requestAccess()
            }
    }
}

private struct LaunchBackground: View {
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        (colorScheme == .dark
            ? Color(red: 0.075, green: 0.073, blue: 0.070)
            : Color(red: 0.969, green: 0.961, blue: 0.941))
            .ignoresSafeArea()
    }
}
