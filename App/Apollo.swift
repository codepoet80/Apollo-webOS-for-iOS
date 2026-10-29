import LunaKit
import UIKit

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {}

final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options: UIScene.ConnectionOptions) {
        guard let scene = scene as? UIWindowScene else { return }
        // Apollo shipped as two webOS apps: the TouchPad's, and the phones' with its own layout.
        // Each device runs the one written for it, told it is the device that one was made for.
        let appId = UIDevice.current.userInterfaceIdiom == .phone ? "com.jmtk.apollophone" : "com.jmtk.apollo"
        let webos = Bundle.main.resourceURL!.appendingPathComponent("webos")
        let apollo = LunaApp(appId: appId, package: webos.appendingPathComponent("apps/\(appId)"), assets: webos)
        let window = UIWindow(windowScene: scene)
        window.rootViewController = LunaCardViewController(app: apollo)
        window.makeKeyAndVisible()
        self.window = window
    }
}
