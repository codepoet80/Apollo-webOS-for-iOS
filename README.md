# Apollo for iOS

Apollo, the ad-free Pandora client for webOS, on iPhone and iPad: the original webOS apps,
hosted by [iOSLuna](https://github.com/webOSArchive/Lunacy)'s LunaKit. On TestFlight as
"Apollo (webOS)" for family and friends; not for the App Store.

| Folder | What it is |
|---|---|
| `com.jmtk.apollo/` | Apollo for the TouchPad (Enyo 1), the iPad's. Also released for webOS. |
| `com.jmtk.apollophone/` | Apollo for webOS phones, the iPhone's. Also releasable for webOS. |
| `App/` | The iOS app: chooses the webOS app for the device and hands it to LunaKit. |
| `project.yml` | The Xcode project, generated with [XcodeGen](https://github.com/yonaskolb/XcodeGen). |
| `ExportOptions.plist` | Signing and upload settings for TestFlight. |

The webOS apps are changed only as webOS releases (bump `appinfo.json`, add to the changelog in
`index.html`); anything iOS needs from the host belongs in LunaKit, not in an app.
`com.jmtk.apollo/CLAUDE.md` has the app's own notes.

## Building

Beside this folder: a [Lunacy](https://github.com/webOSArchive/Lunacy) checkout (LunaKit is
`Lunacy/iOSLuna`, and its shared scripts are Lunacy's) and a
[webos-sdk-redux](https://github.com/webOSArchive/webos-sdk-redux) clone (Enyo).

```sh
xcodegen generate                       # makes Apollo.xcodeproj and App/Info.plist
open Apollo.xcodeproj
```

Xcode 26 or later (App Store Connect takes the iOS 26 SDK and up). On a Mac whose default
Xcode is another, set `DEVELOPER_DIR` to the one to use, e.g.
`export DEVELOPER_DIR="/Applications/Xcode 26.3.app/Contents/Developer"`.

## Releasing to TestFlight

Each upload needs a build number higher than the last; the archive carries one from the clock.

```sh
B=$(date +%y%m%d%H%M)
xcodebuild -project Apollo.xcodeproj -scheme Apollo -configuration Release \
  -destination 'generic/platform=iOS' -archivePath build/Apollo.xcarchive \
  -allowProvisioningUpdates CURRENT_PROJECT_VERSION=$B archive
xcodebuild -exportArchive -archivePath build/Apollo.xcarchive \
  -exportOptionsPlist ExportOptions.plist -exportPath build/export -allowProvisioningUpdates
```

Team Z97JEYX9UJ, bundle id `org.webosarchive.apollo`. Testers need only a free Apple ID: an
internal tester is a user on the App Store Connect team (any role), and gets each build as soon
as it is processed; an external tester is added by email or public link, after Beta App Review.

## A log from the phone

LunaKit logs Apollo's console, its network requests, media keys and the background keep-alive
to the unified log (subsystem `org.webosarchive.lunakit`), with tokens, passwords and email
addresses blanked. On a Mac new enough for the phone's iOS, with the phone plugged in:

```sh
sudo log collect --device-name "<iPhone name>" --last 1h --output apollo.logarchive
/usr/bin/log show --archive apollo.logarchive --style compact \
  --predicate 'process == "Apollo" OR process BEGINSWITH "com.apple.WebKit" OR ((process == "runningboardd" OR process == "mediaserverd" OR process == "audiomxd") AND eventMessage CONTAINS[c] "apollo")' \
  > apollo.txt
```

Use `/usr/bin/log`: in zsh, plain `log` is a shell builtin.
